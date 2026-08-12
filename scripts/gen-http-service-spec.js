/**
 * Generate deep HttpClientTestingModule specs for thin HTTP services.
 * Usage: node scripts/gen-http-service-spec.js path/to/service.ts
 */
const fs = require('fs');
const path = require('path');

const servicePath = process.argv[2];
if (!servicePath) {
  console.error('Usage: node scripts/gen-http-service-spec.js <service.ts>');
  process.exit(1);
}

const abs = path.resolve(servicePath);
const src = fs.readFileSync(abs, 'utf8').replace(/\r\n/g, '\n');
const base = path.basename(abs, '.ts');
const classMatch = src.match(/export class (\w+)/);
if (!classMatch) {
  console.error('No export class found');
  process.exit(1);
}
const className = classMatch[1];

const ctorMatch = src.match(/constructor\s*\([^)]*private\s+(\w+)\s*:\s*HttpClient/);
const httpProp = ctorMatch ? ctorMatch[1] : 'http';

const ctorFull = src.match(/constructor\s*\(([^)]*)\)/);
const ctorArgs = ctorFull ? ctorFull[1] : '';
const extraProviders = [];
const extraImports = [];
let encrySetup = '';
if (/EncryDecryService/.test(ctorArgs)) {
  extraImports.push(`import { EncryDecryService } from 'src/app/shared/services/encry-decry.service';`);
  extraProviders.push(`{ provide: EncryDecryService, useValue: encryDecry }`);
  encrySetup = `
    const encryDecry = jasmine.createSpyObj('EncryDecryService', ['get', 'set']);
    encryDecry.get.and.returnValue(JSON.stringify({ details: { id: 'u1', org: { id: 'o1' } } }));
    localStorage.setItem('logData', 'x');
`;
}
if (/FormBuilder/.test(ctorArgs)) {
  extraImports.push(`import { FormBuilder } from '@angular/forms';`);
  extraProviders.push(`FormBuilder`);
}
if (/Router/.test(ctorArgs)) {
  extraImports.push(`import { Router } from '@angular/router';`);
  extraProviders.push(`{ provide: Router, useValue: jasmine.createSpyObj('Router', ['navigate']) }`);
}
if (/MatDialog/.test(ctorArgs)) {
  extraImports.push(`import { MatDialog } from '@angular/material/dialog';`);
  extraProviders.push(`{ provide: MatDialog, useValue: jasmine.createSpyObj('MatDialog', ['open', 'closeAll']) }`);
}

const methods = [];
const lines = src.split('\n');
for (let i = 0; i < lines.length; i++) {
  const header = lines[i].match(/^\s+([a-zA-Z]\w*)\s*\(([^)]*)\)\s*(?::\s*[^{]+)?\s*\{?\s*$/);
  if (!header) continue;
  const name = header[1];
  if (['constructor', 'if', 'for', 'while', 'switch', 'catch'].includes(name)) continue;

  let body = '';
  let depth = 0;
  let started = false;
  for (let j = i; j < Math.min(i + 60, lines.length); j++) {
    const line = lines[j];
    for (const ch of line) {
      if (ch === '{') { depth++; started = true; }
      if (ch === '}') depth--;
    }
    body += line + '\n';
    if (started && depth <= 0) break;
  }
  // skip if no http call or only commented
  const activeBody = body
    .split('\n')
    .filter((l) => !/^\s*\/\//.test(l))
    .join('\n');
  const httpCall = activeBody.match(new RegExp(httpProp + '\\.(get|post|put|delete|patch)\\s*\\(([\\s\\S]+?)\\)\\s*;?'));
  if (!httpCall) continue;
  const verb = httpCall[1].toUpperCase();
  const argsExpr = httpCall[2];
  const urlMatch = argsExpr.match(/AppApiConfig\.apiEndpoint\s*\+\s*(AppApiConfig\.\w+)/);
  let urlExpr = urlMatch ? `AppApiConfig.apiEndpoint + ${urlMatch[1]}` : null;
  // this.url pattern
  if (!urlExpr && /this\.url/.test(argsExpr)) {
    urlExpr = 'service.url';
  }
  if (!urlExpr) continue;
  const params = header[2].trim();
  const hasArg = params.length > 0;
  methods.push({ name, verb, urlExpr, hasArg });
}

const relativeImport = './' + base;
const specPath = abs.replace(/\.ts$/, '.spec.ts');

const tests = methods.map((meth) => {
  const call = meth.hasArg ? `service.${meth.name}({ id: 1 })` : `service.${meth.name}()`;
  return `
  it('should call ${meth.name}', () => {
    ${call}.subscribe((res: any) => {
      expect(res).toEqual({ ok: true });
    });
    const req = httpMock.expectOne(${meth.urlExpr});
    expect(req.request.method).toBe('${meth.verb}');
    req.flush({ ok: true });
  });`;
}).join('\n');

const content = `import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ${className} } from '${relativeImport}';
import { AppApiConfig } from 'src/app/shared/constants/app-api.config';
${extraImports.join('\n')}

describe('${className}', () => {
  let service: ${className};
  let httpMock: HttpTestingController;

  beforeEach(() => {${encrySetup}
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        ${className}${extraProviders.length ? ',\n        ' + extraProviders.join(',\n        ') : ''}
      ]
    });
    service = TestBed.inject(${className});
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
${tests}
});
`;

fs.writeFileSync(specPath, content);
console.log('WROTE', path.relative(process.cwd(), specPath), 'methods=', methods.length);

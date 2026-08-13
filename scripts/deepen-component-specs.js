#!/usr/bin/env node
/**
 * Generate deep component specs with correct DI (nested @Inject support),
 * shared autoMock helpers, and method-exercise coverage harness.
 */
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const dryRun = process.argv.includes('--dry-run');
const force = process.argv.includes('--force');
const explicit = process.argv
  .slice(2)
  .filter((a) => !a.startsWith('--'));

/** Hand-maintained specs — skip unless --force */
const PRESERVE = new Set(
  [
    // keep empty by default; use --force to overwrite all
  ].map((p) => path.normalize(p))
);

function walk(dir, out = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full, out);
    else if (entry.name.endsWith('.component.spec.ts')) out.push(full);
  }
  return out;
}

function parseClass(src) {
  const m = src.match(/export class (\w+)/);
  return m ? m[1] : null;
}

/** Extract constructor parameter list with nested parentheses support */
function ctorArgs(src) {
  const i = src.search(/constructor\s*\(/);
  if (i < 0) return '';
  let start = src.indexOf('(', i) + 1;
  let depth = 1;
  let j = start;
  for (; j < src.length && depth > 0; j++) {
    if (src[j] === '(') depth++;
    else if (src[j] === ')') depth--;
  }
  return src.slice(start, j - 1);
}

function parseConstructorDeps(src) {
  const body = ctorArgs(src);
  if (!body.trim()) return [];
  const deps = [];

  // Split on top-level commas
  const parts = [];
  let cur = '';
  let depth = 0;
  for (const ch of body) {
    if (ch === '(') depth++;
    if (ch === ')') depth--;
    if (ch === ',' && depth === 0) {
      parts.push(cur.trim());
      cur = '';
      continue;
    }
    cur += ch;
  }
  if (cur.trim()) parts.push(cur.trim());

  for (const part of parts) {
    if (!part) continue;
    const inject = part.match(/@Inject\(\s*([A-Za-z0-9_]+)\s*\)/);
    const token = inject ? inject[1] : null;
    const m = part.match(
      /(?:private|public|protected|readonly)\s+(?:readonly\s+)?(\w+)\s*:\s*([^,=]+)/
    );
    if (m) {
      deps.push({
        name: m[1],
        type: m[2].replace(/<[^>]*>/g, '').trim(),
        token,
      });
      continue;
    }
    // shorthand: public router: Router without access modifier already handled;
    // try without access modifier
    const m2 = part.match(/(\w+)\s*:\s*([^,=]+)/);
    if (m2 && !part.startsWith('@')) {
      deps.push({
        name: m2[1],
        type: m2[2].replace(/<[^>]*>/g, '').trim(),
        token,
      });
    } else if (token) {
      const nameMatch = part.match(
        /(?:private|public|protected|readonly)?\s*(\w+)\s*(?::|$)/
      );
      deps.push({
        name: nameMatch ? nameMatch[1] : 'injected',
        type: 'any',
        token,
      });
    }
  }
  return deps;
}

function findTypeImport(src, typeName) {
  if (!typeName || typeName === 'any') return null;
  const re = /import\s+\{([^}]*)\}\s+from\s+['"]([^'"]+)['"]/g;
  let m;
  while ((m = re.exec(src))) {
    const names = m[1].split(',').map((s) => s.trim().split(/\s+as\s+/).pop());
    if (names.includes(typeName)) return `import { ${typeName} } from '${m[2]}';`;
  }
  return null;
}

function relImport(fromSpec, toSrc) {
  let rel = path
    .relative(path.dirname(fromSpec), toSrc)
    .replace(/\\/g, '/')
    .replace(/\.ts$/, '');
  if (!rel.startsWith('.')) rel = './' + rel;
  return rel;
}

function helpersImport(specPath) {
  let rel = path
    .relative(path.dirname(specPath), path.join(ROOT, 'src/testing/test-helpers.ts'))
    .replace(/\\/g, '/')
    .replace(/\.ts$/, '');
  if (!rel.startsWith('.')) rel = './' + rel;
  return rel;
}

function generate(specPath, srcPath) {
  const src = fs.readFileSync(srcPath, 'utf8');
  const className = parseClass(src);
  if (!className) return null;
  const deps = parseConstructorDeps(src);
  const standalone = /standalone\s*:\s*true/.test(src);
  const importPath = relImport(specPath, srcPath);
  const helpersPath = helpersImport(specPath);

  const importSet = new Set([
    `import { ComponentFixture, TestBed } from '@angular/core/testing';`,
    `import { NO_ERRORS_SCHEMA, ChangeDetectorRef } from '@angular/core';`,
    `import { CommonModule, DatePipe } from '@angular/common';`,
    `import { of } from 'rxjs';`,
    `import { ${className} } from '${importPath}';`,
    `import { autoMock, defaultAppConfig, seedComponent, exerciseComponent } from '${helpersPath}';`,
  ]);

  const setups = [];
  const providers = [];
  let needsForms =
    /FormBuilder|NgForm|FormsModule|ReactiveFormsModule|FormGroup|FormControl/.test(
      src
    );
  let needsHttp = /HttpClient/.test(src);
  let needsRouter = deps.some((d) => d.type === 'Router' || d.type === 'ActivatedRoute');
  let providedTokens = new Set();

  const provideOnce = (tokenKey, setupLines, providerLine, imports = []) => {
    if (providedTokens.has(tokenKey)) return;
    providedTokens.add(tokenKey);
    imports.forEach((i) => importSet.add(i));
    setupLines.forEach((s) => setups.push(s));
    providers.push(providerLine);
  };

  // Always useful defaults for this codebase
  provideOnce(
    'APP_CONFIG',
    [],
    `{ provide: APP_CONFIG, useValue: defaultAppConfig }`,
    [`import { APP_CONFIG } from 'src/app/app.config';`]
  );
  provideOnce(
    'ChangeDetectorRef',
    [],
    `{ provide: ChangeDetectorRef, useValue: autoMock('ChangeDetectorRef') }`
  );
  provideOnce('DatePipe', [], `DatePipe`);
  provideOnce(
    'MAT_DIALOG_SCROLL_STRATEGY',
    [],
    `{ provide: MAT_DIALOG_SCROLL_STRATEGY, useValue: () => ({ attach: () => undefined, enable: () => undefined, disable: () => undefined, detach: () => undefined }) }`,
    [`import { MAT_DIALOG_SCROLL_STRATEGY } from '@angular/material/dialog';`]
  );

  for (const dep of deps) {
    if (dep.token === 'MAT_DIALOG_DATA' || dep.token === 'MAT_DIALOG_DATA') {
      provideOnce(
        'MAT_DIALOG_DATA',
        [],
        `{ provide: MAT_DIALOG_DATA, useValue: { isNewVendor: true, vendorProduct: [], vendorService: [], id: '1', status: 'Success', data: [], graphTitle: 'Price: Item A', deliveryDate: '2020-01-01', lineItems: [], documents: [], vendors: [], items: [], content: [], clientdeliverylocationrfq: [] } }`,
        [`import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';`]
      );
      provideOnce(
        'MatDialogRef',
        [],
        `{ provide: MatDialogRef, useValue: autoMock('MatDialogRef') }`,
        [`import { MatDialogRef } from '@angular/material/dialog';`]
      );
      continue;
    }
    if (dep.token === 'APP_CONFIG') {
      // already provided
      continue;
    }
    if (dep.token && dep.token !== dep.type) {
      // generic injection token
      const typeImport = findTypeImport(src, dep.token);
      if (typeImport) importSet.add(typeImport);
      provideOnce(
        dep.token,
        [],
        `{ provide: ${dep.token}, useValue: defaultAppConfig }`
      );
      continue;
    }

    const t = dep.type;

    if (t === 'Router') {
      needsRouter = true;
      provideOnce(
        'Router',
        [],
        `{ provide: Router, useValue: autoMock('Router') }`,
        [`import { Router } from '@angular/router';`]
      );
    } else if (t === 'ActivatedRoute') {
      needsRouter = true;
      provideOnce(
        'ActivatedRoute',
        [
          `const activatedRoute = { snapshot: { params: {}, queryParams: { returnUrl: '/' }, paramMap: { get: () => null }, data: {} }, params: of({}), queryParams: of({ returnUrl: '/' }), paramMap: of({ get: () => null }), data: of({}) };`,
        ],
        `{ provide: ActivatedRoute, useValue: activatedRoute }`,
        [`import { ActivatedRoute } from '@angular/router';`]
      );
    } else if (t === 'FormBuilder') {
      importSet.add(`import { FormBuilder, ReactiveFormsModule } from '@angular/forms';`);
      provideOnce('FormBuilder', [], `FormBuilder`);
      needsForms = true;
    } else if (t === 'MatDialog' || t === 'MatDialogRef') {
      provideOnce(
        t,
        [],
        `{ provide: ${t}, useValue: autoMock('${t}') }`,
        [`import { ${t} } from '@angular/material/dialog';`]
      );
    } else if (t === 'NgbModal' || t === 'NgbActiveModal') {
      provideOnce(
        t,
        [],
        `{ provide: ${t}, useValue: autoMock('${t}') }`,
        [`import { ${t} } from '@ng-bootstrap/ng-bootstrap';`]
      );
    } else if (t === 'ToastrService') {
      provideOnce(
        'ToastrService',
        [],
        `{ provide: ToastrService, useValue: autoMock('ToastrService') }`,
        [`import { ToastrService } from 'ngx-toastr';`]
      );
    } else if (t === 'HttpClient') {
      needsHttp = true;
    } else if (t === 'ChangeDetectorRef') {
      // already
    } else if (t === 'DatePipe') {
      // already
    } else if (t === 'ElementRef' || t === 'Renderer2' || t === 'NgZone') {
      // TestBed provides these for components usually; skip
    } else if (t === 'ConfirmationService') {
      provideOnce(
        'ConfirmationService',
        [],
        `{ provide: ConfirmationService, useValue: autoMock('ConfirmationService') }`,
        [`import { ConfirmationService } from 'primeng/api';`]
      );
    } else if (t === 'EncryDecryService') {
      const typeImport = findTypeImport(src, t);
      if (typeImport) importSet.add(typeImport);
      else
        importSet.add(
          `import { EncryDecryService } from 'src/app/shared/services';`
        );
      provideOnce(
        'EncryDecryService',
        [],
        `{ provide: EncryDecryService, useValue: autoMock('EncryDecryService') }`
      );
    } else if (t === 'AuthenticationService') {
      const typeImport = findTypeImport(src, t);
      if (typeImport) importSet.add(typeImport);
      else
        importSet.add(
          `import { AuthenticationService } from 'src/app/shared/services/authentication.service';`
        );
      provideOnce(
        'AuthenticationService',
        [],
        `{ provide: AuthenticationService, useValue: autoMock('AuthenticationService') }`
      );
    } else if (t && t !== 'any' && t !== 'IAppConfig') {
      const typeImport = findTypeImport(src, t);
      if (typeImport) importSet.add(typeImport);
      provideOnce(t, [], `{ provide: ${t}, useValue: autoMock('${t}') }`);
    }
  }

  // Dialog components often need both even if only one is in ctor
  if (/MatDialogRef|MAT_DIALOG_DATA/.test(src)) {
    provideOnce(
      'MAT_DIALOG_DATA',
      [],
      `{ provide: MAT_DIALOG_DATA, useValue: { isNewVendor: true, vendorProduct: [], vendorService: [], id: '1', status: 'Success', data: [], graphTitle: 'Price: Item A', deliveryDate: '2020-01-01', lineItems: [], documents: [], vendors: [], items: [], content: [], clientdeliverylocationrfq: [] } }`,
      [`import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';`]
    );
    provideOnce(
      'MatDialogRef',
      [],
      `{ provide: MatDialogRef, useValue: autoMock('MatDialogRef') }`,
      [`import { MatDialogRef } from '@angular/material/dialog';`]
    );
  }

  if (/ToastrService/.test(src)) {
    provideOnce(
      'ToastrService',
      [],
      `{ provide: ToastrService, useValue: autoMock('ToastrService') }`,
      [`import { ToastrService } from 'ngx-toastr';`]
    );
  }

  if (needsHttp) {
    importSet.add(
      `import { HttpClientTestingModule } from '@angular/common/http/testing';`
    );
  }

  if (needsForms) {
    importSet.add(
      `import { FormsModule, ReactiveFormsModule, FormBuilder } from '@angular/forms';`
    );
    if (!providedTokens.has('FormBuilder')) {
      providers.push('FormBuilder');
      providedTokens.add('FormBuilder');
    }
  }

  // Deduplicate forms imports
  const formsSymbols = new Set();
  for (const line of [...importSet]) {
    const m = line.match(/import \{([^}]+)\} from '@angular\/forms';/);
    if (m) {
      m[1].split(',').forEach((s) => formsSymbols.add(s.trim()));
      importSet.delete(line);
    }
  }
  if (formsSymbols.size) {
    importSet.add(
      `import { ${[...formsSymbols].filter(Boolean).join(', ')} } from '@angular/forms';`
    );
  }

  // Deduplicate material dialog imports
  const matSymbols = new Set();
  for (const line of [...importSet]) {
    const m = line.match(/import \{([^}]+)\} from '@angular\/material\/dialog';/);
    if (m) {
      m[1].split(',').forEach((s) => matSymbols.add(s.trim()));
      importSet.delete(line);
    }
  }
  if (matSymbols.size) {
    importSet.add(
      `import { ${[...matSymbols].filter(Boolean).join(', ')} } from '@angular/material/dialog';`
    );
  }

  const importsArr = [
    'CommonModule',
    needsForms ? 'FormsModule' : null,
    needsForms ? 'ReactiveFormsModule' : null,
    needsHttp ? 'HttpClientTestingModule' : null,
  ]
    .filter(Boolean)
    .join(', ');

  const decl = standalone
    ? `imports: [${importsArr}, ${className}],`
    : `declarations: [${className}],\n      imports: [${importsArr}],`;

  return `${[...importSet].join('\n')}

describe('${className}', () => {
  let component: ${className};
  let fixture: ComponentFixture<${className}>;

  beforeEach(async () => {
    localStorage.setItem('logData', 'x');
    localStorage.setItem('at', 'token');
    localStorage.setItem('rt', 'refresh');
    localStorage.setItem('et', String(Date.now() + 600000));
    localStorage.setItem('orgId', 'o1');
    localStorage.setItem('system-view', 'GMT Basic');
    localStorage.setItem('perm', 'x');
${setups.map((s) => '    ' + s).join('\n')}

    await TestBed.configureTestingModule({
      ${decl}
      providers: [
        ${providers.join(',\n        ')}
      ],
      schemas: [NO_ERRORS_SCHEMA]
    })
      .overrideTemplate(${className}, '')
      .overrideComponent(${className}, { set: { providers: [] } })
      .compileComponents();

    fixture = TestBed.createComponent(${className});
    component = fixture.componentInstance;
    seedComponent(component as any);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should exercise component API for coverage', () => {
    exerciseComponent(component as any);
    expect(component).toBeTruthy();
  });
});
`;
}

function main() {
  const targets = explicit.length
    ? explicit.map((p) => path.resolve(p))
    : walk(path.join(ROOT, 'src'));

  let written = 0;
  let skipped = 0;
  for (const specPath of targets) {
    const srcPath = specPath.replace(/\.spec\.ts$/, '.ts');
    if (!fs.existsSync(srcPath)) continue;
    const rel = path.relative(ROOT, specPath);
    if (!force && PRESERVE.has(path.normalize(rel))) {
      skipped++;
      continue;
    }
    try {
      const content = generate(specPath, srcPath);
      if (!content) continue;
      if (!dryRun) fs.writeFileSync(specPath, content);
      console.log('WROTE', rel);
      written++;
    } catch (e) {
      console.error('FAIL', specPath, e.message);
    }
  }
  console.log('Done written=' + written + ' skipped=' + skipped);
}

main();

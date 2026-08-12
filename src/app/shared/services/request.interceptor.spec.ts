import { HttpRequest, HttpResponse, HttpHeaders } from '@angular/common/http';
import { of } from 'rxjs';
import { RequestInterceptor } from './request.interceptor';
import { LoaderService } from './loader.service';
import { AppApiConfig } from '../constants/app-api.config';

describe('RequestInterceptor', () => {
  let interceptor: RequestInterceptor;
  let loaderService: LoaderService;
  let toaster: jasmine.SpyObj<any>;
  let router: jasmine.SpyObj<any>;

  beforeEach(() => {
    loaderService = new LoaderService();
    toaster = jasmine.createSpyObj('ToastrService', ['error']);
    router = jasmine.createSpyObj('Router', ['navigate']);
    interceptor = new RequestInterceptor(loaderService, toaster, router);
    localStorage.clear();
  });

  afterEach(() => {
    localStorage.clear();
  });

  it('should be created', () => {
    expect(interceptor).toBeTruthy();
  });

  it('should pass through refresh token requests', (done) => {
    const req = new HttpRequest('POST', AppApiConfig.apiEndpoint + AppApiConfig.REFRESH_TOKEN_PATH, {});
    const next = {
      handle: (r: HttpRequest<any>) => {
        expect(r).toBe(req);
        return of(new HttpResponse({ status: 200 }));
      }
    } as any;
    interceptor.intercept(req, next).subscribe(() => done());
  });

  it('should clone headers for forgot password path', (done) => {
    const req = new HttpRequest('POST', AppApiConfig.apiEndpoint + AppApiConfig.FORGOT_PASSWORD, {});
    const next = {
      handle: (r: HttpRequest<any>) => {
        expect(r.headers.get('Content-Type')).toBe('application/json');
        return of(new HttpResponse({ status: 200 }));
      }
    } as any;
    interceptor.intercept(req, next).subscribe(() => done());
  });

  it('should attach bearer token for authenticated requests', (done) => {
    localStorage.setItem('at', 'abc-token');
    const req = new HttpRequest('GET', AppApiConfig.apiEndpoint + '/rest/users/user/loggedUser');
    const next = {
      handle: (r: HttpRequest<any>) => {
        expect(r.headers.get('Authorization')).toBe('Bearer abc-token');
        return of(new HttpResponse({ status: 200 }));
      }
    } as any;
    interceptor.intercept(req, next).subscribe(() => done());
  });

  it('should pass through access token path without bearer clone', (done) => {
    const req = new HttpRequest('POST', AppApiConfig.apiEndpoint + AppApiConfig.ACCESS_TOKEN_PATH, {});
    const next = {
      handle: (r: HttpRequest<any>) => {
        expect(r).toBe(req);
        return of(new HttpResponse({ status: 200 }));
      }
    } as any;
    interceptor.intercept(req, next).subscribe(() => done());
  });
});

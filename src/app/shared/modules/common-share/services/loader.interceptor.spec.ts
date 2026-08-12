import { HttpRequest, HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { of, throwError } from 'rxjs';
import { LoaderInterceptor } from './loader.interceptor';
import { LoaderService } from './loader.service';

describe('LoaderInterceptor (common-share)', () => {
  let interceptor: LoaderInterceptor;
  let loaderService: LoaderService;
  let toaster: jasmine.SpyObj<any>;
  let router: jasmine.SpyObj<any>;
  let modal: jasmine.SpyObj<any>;

  beforeEach(() => {
    loaderService = new LoaderService();
    toaster = jasmine.createSpyObj('ToastrService', ['error']);
    router = jasmine.createSpyObj('Router', ['navigate']);
    modal = jasmine.createSpyObj('NgbModal', ['dismissAll']);
    interceptor = new LoaderInterceptor(loaderService, toaster, router, modal);
    localStorage.clear();
  });

  afterEach(() => {
    localStorage.clear();
  });

  it('should be created', () => {
    expect(interceptor).toBeTruthy();
  });

  it('should removeRequest when present', () => {
    const req = new HttpRequest('GET', '/x');
    (interceptor as any).requests.push(req);
    interceptor.removeRequest(req);
    expect((interceptor as any).requests.length).toBe(0);
  });

  it('should navigate to sessionExpired when no encryptUser', () => {
    const req = new HttpRequest('GET', '/api');
    const next = { handle: () => of(new HttpResponse({ status: 200 })) } as any;
    interceptor.intercept(req, next);
    expect(router.navigate).toHaveBeenCalledWith(['/logout/sessionExpired']);
    expect(loaderService.isLoading.value).toBe(false);
  });

  it('should process request when encryptUser exists', (done) => {
    localStorage.setItem('encryptUser', '1');
    const req = new HttpRequest('GET', '/api/data');
    const next = {
      handle: () => of(new HttpResponse({ status: 200, body: {} }))
    } as any;
    interceptor.intercept(req, next).subscribe({
      complete: () => {
        expect(loaderService.isLoading.value).toBe(false);
        done();
      }
    });
  });

  it('should handle non-401 errors via showErrorMessages', (done) => {
    localStorage.setItem('encryptUser', '1');
    const req = new HttpRequest('GET', '/api/data');
    const err = new HttpErrorResponse({ status: 404, statusText: 'Not Found' });
    const next = { handle: () => throwError(() => err) } as any;
    interceptor.intercept(req, next).subscribe({
      error: () => {
        expect(toaster.error).toHaveBeenCalledWith('Resource Not Found', 'Failure');
        done();
      }
    });
  });

  it('should handle 401 errors', (done) => {
    localStorage.setItem('encryptUser', '1');
    const req = new HttpRequest('GET', '/api/data');
    const err = new HttpErrorResponse({
      status: 401,
      error: { message: 'nope' }
    });
    const next = { handle: () => throwError(() => err) } as any;
    interceptor.intercept(req, next).subscribe({
      error: () => {
        expect(modal.dismissAll).toHaveBeenCalled();
        expect(router.navigate).toHaveBeenCalledWith(['/login/unauthorized']);
        done();
      }
    });
  });

  it('should cover showErrorMessages status branches', () => {
    const statuses = [400, 401, 408, 415, 500, 503, 504, 511, 418];
    statuses.forEach(status => {
      interceptor.showErrorMessages(new HttpErrorResponse({ status }));
    });
    expect(toaster.error).toHaveBeenCalled();
  });
});

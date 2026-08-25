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
    localStorage.setItem('encryptUser', 'someuser');
  });

  afterEach(() => localStorage.clear());

  it('should be created', () => {
    expect(interceptor).toBeTruthy();
  });

  it('removeRequest should handle missing request', () => {
    const req = new HttpRequest('GET', '/test');
    expect(() => interceptor.removeRequest(req)).not.toThrow();
  });

  it('should pass through and complete for valid requests', (done) => {
    const req = new HttpRequest('GET', '/api/data');
    const next = { handle: () => of(new HttpResponse({ status: 200, body: {} })) } as any;
    interceptor.intercept(req, next).subscribe({
      next: (event) => expect(event instanceof HttpResponse).toBe(true),
      complete: () => done()
    });
  });

  it('should not push vendorInfoById requests to queue', (done) => {
    const req = new HttpRequest('GET', '/api/vendorInfoById/123');
    const next = { handle: () => of(new HttpResponse({ status: 200, body: {} })) } as any;
    interceptor.intercept(req, next).subscribe({ complete: () => done() });
  });

  it('should handle 401 errors', (done) => {
    const req = new HttpRequest('GET', '/api/secure');
    const err = new HttpErrorResponse({ status: 401, error: { message: 'Unauthorized' } });
    const next = { handle: () => throwError(() => err) } as any;
    interceptor.intercept(req, next).subscribe({
      error: () => {
        expect(modal.dismissAll).toHaveBeenCalled();
        expect(router.navigate).toHaveBeenCalledWith(['/login/unauthorized']);
        done();
      }
    });
  });

  it('should handle non-401 errors', (done) => {
    const req = new HttpRequest('GET', '/api/data');
    const err = new HttpErrorResponse({ status: 500, error: {} });
    const next = { handle: () => throwError(() => err) } as any;
    interceptor.intercept(req, next).subscribe({
      error: () => {
        expect(toaster.error).toHaveBeenCalled();
        done();
      }
    });
  });

  it('should redirect to session expired when no encryptUser and not generateToken', () => {
    localStorage.removeItem('encryptUser');
    const req = new HttpRequest('GET', '/api/data');
    const next = { handle: () => of(new HttpResponse({ status: 200 })) } as any;
    interceptor.intercept(req, next);
    expect(router.navigate).toHaveBeenCalledWith(['/logout/sessionExpired']);
  });

  it('should allow generateToken requests even without encryptUser', (done) => {
    localStorage.removeItem('encryptUser');
    const req = new HttpRequest('POST', '/user/generateToken', {});
    const next = { handle: () => of(new HttpResponse({ status: 200, body: {} })) } as any;
    interceptor.intercept(req, next).subscribe({ complete: () => done() });
  });

  describe('showErrorMessages', () => {
    it('should show 404 error', () => {
      interceptor.showErrorMessages(new HttpErrorResponse({ status: 404 }));
      expect(toaster.error).toHaveBeenCalledWith('Resource Not Found', 'Failure');
    });

    it('should show 400 error', () => {
      interceptor.showErrorMessages(new HttpErrorResponse({ status: 400 }));
      expect(toaster.error).toHaveBeenCalledWith('Bad Request', 'Failure');
    });

    it('should show 401 error and navigate', () => {
      interceptor.showErrorMessages(new HttpErrorResponse({ status: 401, error: {} }));
      expect(router.navigate).toHaveBeenCalledWith(['/login/unauthorized']);
    });

    it('should show 500 error', () => {
      interceptor.showErrorMessages(new HttpErrorResponse({ status: 500 }));
      expect(toaster.error).toHaveBeenCalledWith('Internal Server Error', 'Failure');
    });

    it('should show 408 error', () => {
      interceptor.showErrorMessages(new HttpErrorResponse({ status: 408 }));
      expect(toaster.error).toHaveBeenCalledWith('Request Timeout', 'Failure');
    });

    it('should show 415 error', () => {
      interceptor.showErrorMessages(new HttpErrorResponse({ status: 415 }));
      expect(toaster.error).toHaveBeenCalledWith('Unsupp\u00ADorted Media Type', 'Failure');
    });

    it('should show 503 error', () => {
      interceptor.showErrorMessages(new HttpErrorResponse({ status: 503 }));
      expect(toaster.error).toHaveBeenCalledWith('Service Unavai\u00ADlable', 'Failure');
    });

    it('should show 504 error', () => {
      interceptor.showErrorMessages(new HttpErrorResponse({ status: 504 }));
      expect(toaster.error).toHaveBeenCalledWith('Gateway Timeout', 'Failure');
    });

    it('should show 511 error', () => {
      interceptor.showErrorMessages(new HttpErrorResponse({ status: 511 }));
      expect(toaster.error).toHaveBeenCalledWith('Network Authen\u00ADtic\u00ADation Required', 'Failure');
    });

    it('should show default error for unknown status', () => {
      interceptor.showErrorMessages(new HttpErrorResponse({ status: 999 }));
      expect(toaster.error).toHaveBeenCalledWith('Network error, Please retry after sometime', 'Failure');
    });
  });
});

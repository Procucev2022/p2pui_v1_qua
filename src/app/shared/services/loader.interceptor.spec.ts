import { HttpRequest, HttpResponse, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { of, throwError } from 'rxjs';
import { LoaderInterceptor } from './loader.interceptor';
import { LoaderService } from './loader.service';
import { AppApiConfig } from '../constants/app-api.config';

describe('LoaderInterceptor (shared/services)', () => {
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
  });

  it('should be created', () => {
    expect(interceptor).toBeTruthy();
  });

  it('should removeRequest safely when request missing', () => {
    const req = new HttpRequest('GET', '/missing');
    expect(() => interceptor.removeRequest(req)).not.toThrow();
  });

  it('should show loader and complete successful responses', (done) => {
    const req = new HttpRequest('GET', '/api/items');
    const next = {
      handle: () => of(new HttpResponse({ status: 200, body: { ok: true } }))
    } as any;

    interceptor.intercept(req, next).subscribe({
      next: (event) => {
        expect(event instanceof HttpResponse).toBe(true);
      },
      complete: () => {
        expect(loaderService.isLoading.value).toBe(false);
        done();
      }
    });
  });

  it('should skip loader for refresh token path', (done) => {
    const req = new HttpRequest('POST', AppApiConfig.apiEndpoint + AppApiConfig.REFRESH_TOKEN_PATH, {});
    const next = {
      handle: () => of(new HttpResponse({ status: 200, body: {} }))
    } as any;
    spyOn(loaderService.isLoading, 'next');

    interceptor.intercept(req, next).subscribe({
      complete: () => {
        expect(loaderService.isLoading.next).not.toHaveBeenCalledWith(true);
        done();
      }
    });
  });

  it('should handle 401 errors', (done) => {
    const req = new HttpRequest('GET', '/api/secure');
    const err = new HttpErrorResponse({
      status: 401,
      error: { message: 'Unauthorized' }
    });
    const next = {
      handle: () => throwError(() => err)
    } as any;

    interceptor.intercept(req, next).subscribe({
      error: () => {
        // 401 handling in source runs after observer.error(); assert on next macrotask
        setTimeout(() => {
          expect(modal.dismissAll).toHaveBeenCalled();
          expect(toaster.error).toHaveBeenCalled();
          expect(router.navigate).toHaveBeenCalledWith(['/login/unauthorized']);
          done();
        }, 0);
      }
    });
  });
});

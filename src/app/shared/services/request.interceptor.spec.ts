import {
  HttpRequest,
  HttpResponse,
  HttpErrorResponse,
  HttpEventType,
} from '@angular/common/http';
import { of, throwError } from 'rxjs';
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
    try {
      delete (window as any).event;
    } catch {
      (window as any).event = undefined;
    }
  });

  function subscribeOk(req: HttpRequest<any>, nextHandle: any) {
    return new Promise<void>((resolve, reject) => {
      interceptor.intercept(req, { handle: nextHandle } as any).subscribe({
        next: () => resolve(),
        error: (e) => reject(e),
        complete: () => resolve(),
      });
    });
  }

  it('should be created', () => {
    expect(interceptor).toBeTruthy();
  });

  it('should pass through refresh token requests and cover HttpResponse tap', async () => {
    const req = new HttpRequest(
      'POST',
      AppApiConfig.apiEndpoint + AppApiConfig.REFRESH_TOKEN_PATH,
      {}
    );
    spyOn(console, 'log');
    await subscribeOk(req, () => of(new HttpResponse({ status: 200 })));
  });

  it('should cover refresh token error tap with window.event as HttpResponse', async () => {
    const req = new HttpRequest(
      'POST',
      AppApiConfig.apiEndpoint + AppApiConfig.REFRESH_TOKEN_PATH,
      {}
    );
    spyOn(console, 'log');
    (window as any).event = new HttpResponse({ status: 500 });
    await expectAsync(
      subscribeOk(req, () =>
        throwError(() => new HttpErrorResponse({ status: 500 }))
      )
    ).toBeRejected();
    expect(console.log).toHaveBeenCalled();
  });

  it('should cover refresh token error tap when window.event is not HttpResponse', async () => {
    const req = new HttpRequest(
      'POST',
      AppApiConfig.apiEndpoint + AppApiConfig.REFRESH_TOKEN_PATH,
      {}
    );
    spyOn(console, 'log');
    (window as any).event = { type: 'not-http' };
    await expectAsync(
      subscribeOk(req, () =>
        throwError(() => new HttpErrorResponse({ status: 500 }))
      )
    ).toBeRejected();
  });

  const publicPaths = [
    AppApiConfig.FORGOT_PASSWORD,
    AppApiConfig.SUBMIT_VENDOR_SELF_REGISTRATION,
    AppApiConfig.PAN_VALIDATION,
    AppApiConfig.GET_CLIENT_DETAILS_BY_PAN,
    AppApiConfig.SUBMIT_CLIENT_SELF_REGISTRATION,
    AppApiConfig.SEND_OTP_TO_MAIL,
    '/sds/upload',
    AppApiConfig.OTP_VALIDATION,
  ];

  publicPaths.forEach((path) => {
    it(`should clone JSON headers for public path ${path}`, async () => {
      const req = new HttpRequest(
        'POST',
        AppApiConfig.apiEndpoint + path,
        {}
      );
      await subscribeOk(req, (r: HttpRequest<any>) => {
        expect(r.headers.get('Content-Type')).toBe('application/json');
        expect(r.headers.get('Accept')).toBe('application/json');
        return of(new HttpResponse({ status: 200 }));
      });
    });
  });

  it('should attach bearer token for authenticated requests', async () => {
    localStorage.setItem('at', 'abc-token');
    const req = new HttpRequest(
      'GET',
      AppApiConfig.apiEndpoint + '/rest/users/user/loggedUser'
    );
    await subscribeOk(req, (r: HttpRequest<any>) => {
      expect(r.headers.get('Authorization')).toBe('Bearer abc-token');
      return of(new HttpResponse({ status: 200 }));
    });
  });

  it('should attach empty bearer when token is absent', async () => {
    const req = new HttpRequest(
      'GET',
      AppApiConfig.apiEndpoint + '/rest/users/user/loggedUser'
    );
    await subscribeOk(req, (r: HttpRequest<any>) => {
      expect(r.headers.get('Authorization')).toBe('Bearer ');
      return of(new HttpResponse({ status: 200 }));
    });
  });

  it('should pass through access token path without bearer clone', async () => {
    const req = new HttpRequest(
      'POST',
      AppApiConfig.apiEndpoint + AppApiConfig.ACCESS_TOKEN_PATH,
      {}
    );
    await subscribeOk(req, (r: HttpRequest<any>) => {
      expect(r).toBe(req);
      return of(new HttpResponse({ status: 200 }));
    });
  });

  it('should cover final tap with non-HttpResponse sent event', async () => {
    const req = new HttpRequest(
      'POST',
      AppApiConfig.apiEndpoint + AppApiConfig.ACCESS_TOKEN_PATH,
      {}
    );
    await subscribeOk(req, () =>
      of({ type: HttpEventType.Sent } as any)
    );
  });

  it('should cover final error tap with window.event as HttpResponse', async () => {
    const req = new HttpRequest(
      'POST',
      AppApiConfig.apiEndpoint + AppApiConfig.ACCESS_TOKEN_PATH,
      {}
    );
    spyOn(console, 'log');
    (window as any).event = new HttpResponse({ status: 401 });
    await expectAsync(
      subscribeOk(req, () =>
        throwError(() => new HttpErrorResponse({ status: 401 }))
      )
    ).toBeRejected();
    expect(console.log).toHaveBeenCalled();
  });

  it('should cover final error tap when window.event is not HttpResponse', async () => {
    const req = new HttpRequest(
      'POST',
      AppApiConfig.apiEndpoint + AppApiConfig.ACCESS_TOKEN_PATH,
      {}
    );
    spyOn(console, 'log');
    (window as any).event = undefined;
    await expectAsync(
      subscribeOk(req, () =>
        throwError(() => new HttpErrorResponse({ status: 401 }))
      )
    ).toBeRejected();
  });
});

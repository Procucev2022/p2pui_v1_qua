import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import * as authModule from './authentication.service';
import { AuthenticationService } from './authentication.service';
import { EncryDecryService } from './encry-decry.service';
import { AppApiConfig } from '../constants/app-api.config';
import { SystemViewConfig } from 'src/app/app.config';
import { environment } from 'src/environments/environment';

describe('AuthenticationService', () => {
  let service: AuthenticationService;
  let httpMock: HttpTestingController;
  let router: jasmine.SpyObj<Router>;
  let encryDecry: jasmine.SpyObj<EncryDecryService>;
  let toaster: jasmine.SpyObj<ToastrService>;

  function buildUser(overrides: any = {}) {
    const { role, org, ...rest } = overrides;
    return {
      id: 'user-1',
      resetPassword: false,
      selfClient: false,
      ...rest,
      role: role || { roleName: 'Vendor' },
      org: {
        id: 'org-1',
        gmtName: SystemViewConfig.GMT_BASIC,
        dpsName: SystemViewConfig.DPS_BASIC,
        bfsName: SystemViewConfig.BFS_PRO,
        ...(org || {})
      }
    };
  }

  async function flushNavigate() {
    const last = (router.navigate as jasmine.Spy).calls.mostRecent();
    if (last && last.returnValue && typeof last.returnValue.then === 'function') {
      await last.returnValue;
    }
  }

  beforeEach(() => {
    spyOn(authModule.AuthPageReload, 'run').and.stub();

    router = jasmine.createSpyObj('Router', ['navigate']);
    router.navigate.and.returnValue(Promise.resolve(true));

    encryDecry = jasmine.createSpyObj('EncryDecryService', ['set', 'get']);
    encryDecry.set.and.returnValue('encrypted-payload');
    toaster = jasmine.createSpyObj('ToastrService', ['warning', 'error', 'success']);

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        AuthenticationService,
        { provide: Router, useValue: router },
        { provide: EncryDecryService, useValue: encryDecry },
        { provide: ToastrService, useValue: toaster }
      ]
    });

    service = TestBed.inject(AuthenticationService);
    httpMock = TestBed.inject(HttpTestingController);
    localStorage.clear();
  });

  afterEach(() => {
    if (httpMock) {
      httpMock.verify();
    }
    localStorage.clear();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should call getAccessToken', () => {
    const reqBody = { userName: 'u', userPassword: 'p' };
    service.getAccessToken(reqBody).subscribe(res => {
      expect(res.access_token).toBe('tok');
    });
    const req = httpMock.expectOne(AppApiConfig.apiEndpoint + AppApiConfig.ACCESS_TOKEN_PATH);
    expect(req.request.method).toBe('POST');
    expect(req.request.headers.get('Authorization')).toBe(environment.basicAuthToken);
    req.flush({ access_token: 'tok' });
  });

  it('should call validateEmailOTP', () => {
    service.validateEmailOTP({ otp: '1234' }).subscribe(res => {
      expect(res).toEqual({ ok: true });
    });
    const req = httpMock.expectOne(AppApiConfig.apiEndpoint + AppApiConfig.OTP_VALIDATION);
    expect(req.request.method).toBe('POST');
    req.flush({ ok: true });
  });

  it('should updateExpiredTime via BehaviorSubject', () => {
    let value = null;
    service.$expiresTime.subscribe(v => (value = v));
    service.updateExpiredTime(42);
    expect(value).toBe(42);
  });

  it('should call getLoggedUserData', () => {
    service.getLoggedUserData({ id: 1 }).subscribe(res => {
      expect(res.id).toBe(1);
    });
    const req = httpMock.expectOne(AppApiConfig.apiEndpoint + AppApiConfig.LOGGED_USER_PATH);
    expect(req.request.method).toBe('POST');
    req.flush({ id: 1 });
  });

  it('should call saveLoggedUserData', () => {
    service.saveLoggedUserData({ visit: 1 }).subscribe(res => {
      expect(res).toEqual({ saved: true });
    });
    const req = httpMock.expectOne(AppApiConfig.apiEndpoint + AppApiConfig.SAVE_USER_LOGIN_DATA);
    expect(req.request.method).toBe('POST');
    req.flush({ saved: true });
  });

  it('should call getVisitorsCount', () => {
    service.getVisitorsCount().subscribe(res => {
      expect(res.count).toBe(5);
    });
    const req = httpMock.expectOne(AppApiConfig.apiEndpoint + AppApiConfig.GET_VISITORS_COUNT);
    expect(req.request.method).toBe('GET');
    req.flush({ count: 5 });
  });

  it('should call updatePassword', () => {
    service.updatePassword({ password: 'x' }).subscribe((res: any) => {
      expect(res.ok).toBe(true);
    });
    const req = httpMock.expectOne(AppApiConfig.apiEndpoint + AppApiConfig.CHANGE_PASSWORD);
    expect(req.request.method).toBe('POST');
    req.flush({ ok: true });
  });

  it('should call forgotpassword', () => {
    service.forgotpassword({ email: 'a@b.com' }).subscribe((res: any) => {
      expect(res.ok).toBe(true);
    });
    const req = httpMock.expectOne(AppApiConfig.apiEndpoint + AppApiConfig.FORGOT_PASSWORD);
    expect(req.request.method).toBe('POST');
    req.flush({ ok: true });
  });

  it('should call getRefreshToken and store tokens', () => {
    localStorage.setItem('rt', 'refresh-old');
    service.getRefreshToken().subscribe(res => {
      expect(res.access_token).toBe('new-at');
    });
    const req = httpMock.expectOne(AppApiConfig.apiEndpoint + AppApiConfig.REFRESH_TOKEN_PATH);
    expect(req.request.method).toBe('POST');
    expect(req.request.headers.get('Authorization')).toBe(environment.basicAuthToken);
    req.flush({ access_token: 'new-at', refresh_token: 'new-rt', expires_in: 100 });
    expect(localStorage.getItem('at')).toBe('new-at');
    expect(localStorage.getItem('rt')).toBe('new-rt');
    expect(localStorage.getItem('et')).toBe('100');
    expect(service.refreshTokenCount).toBe(1);
  });

  it('should expose empty navigationForDFSSystem', () => {
    expect(service.navigationForDFSSystem()).toBeUndefined();
  });

  describe('onSelectedSubscriptions', () => {
    it('should navigate GMT vendor via gmtName early path', async () => {
      const data = buildUser({
        role: { roleName: 'Vendor' },
        org: { gmtName: SystemViewConfig.GMT_BASIC }
      });
      const result = service.onSelectedSubscriptions('gmtName', data);
      expect(result).toBe(true);
      expect(encryDecry.set).toHaveBeenCalled();
      expect(localStorage.getItem('isLoggedin')).toBe('true');
      expect(router.navigate).toHaveBeenCalledWith(['/categorymgr/my-profile']);
      await flushNavigate();
    });

    it('should navigate Registration vendor to dashboard on non-GMT gmtName path', async () => {
      const data = buildUser({
        role: { roleName: 'Registration' },
        org: { gmtName: SystemViewConfig.DPS_BASIC }
      });
      service.onSelectedSubscriptions('gmtName', data);
      expect(router.navigate).toHaveBeenCalledWith(['/dashboard']);
      await flushNavigate();
    });

    it('should navigate PartialVendor to dashboard on non-GMT gmtName path', async () => {
      const data = buildUser({
        role: { roleName: 'PartialVendor' },
        org: { gmtName: 'Other' }
      });
      service.onSelectedSubscriptions('gmtName', data);
      expect(router.navigate).toHaveBeenCalledWith(['/dashboard']);
      await flushNavigate();
    });

    it('should navigate Vendor to /vendor/rfq on non-GMT gmtName path', async () => {
      const data = buildUser({
        role: { roleName: 'Vendor' },
        org: { gmtName: SystemViewConfig.DPS_BASIC }
      });
      service.onSelectedSubscriptions('gmtName', data);
      expect(router.navigate).toHaveBeenCalledWith(['/vendor/rfq']);
      await flushNavigate();
    });

    it('should navigate to passwordChange when resetPassword is true', () => {
      const data = buildUser({
        resetPassword: true,
        role: { roleName: 'VendorManager' },
        org: { dpsName: SystemViewConfig.DPS_BASIC }
      });
      service.onSelectedSubscriptions('dpsName', data);
      expect(router.navigate).toHaveBeenCalledWith(['login/passwordChange']);
    });

    it('should navigate VendorManager to vendormgr dashboard', () => {
      const data = buildUser({
        role: { roleName: 'VendorManager' },
        org: { dpsName: SystemViewConfig.DPS_BASIC }
      });
      service.onSelectedSubscriptions('dpsName', data);
      expect(router.navigate).toHaveBeenCalledWith(['/vendormgr/dashboard']);
    });

    it('should navigate Vendor GMT path to gmt-rqfs', async () => {
      const data = buildUser({
        role: { roleName: 'Vendor' },
        org: { dpsName: SystemViewConfig.GMT_BASIC }
      });
      service.onSelectedSubscriptions('dpsName', data);
      expect(router.navigate).toHaveBeenCalledWith(['/categorymgr/gmt-rqfs']);
      await flushNavigate();
    });

    it('should navigate Vendor BFS path to bfs/my-items', async () => {
      const data = buildUser({
        role: { roleName: 'Vendor' },
        org: { bfsName: SystemViewConfig.BFS_PRO }
      });
      service.onSelectedSubscriptions('bfsName', data);
      expect(router.navigate).toHaveBeenCalledWith(['/bfs/my-items']);
      await flushNavigate();
    });

    it('should navigate Registration DPS path to dashboard', async () => {
      const data = buildUser({
        role: { roleName: 'Registration' },
        org: { dpsName: SystemViewConfig.DPS_BASIC }
      });
      service.onSelectedSubscriptions('dpsName', data);
      expect(router.navigate).toHaveBeenCalledWith(['/dashboard']);
      await flushNavigate();
    });

    it('should navigate Vendor DPS path to /vendor/rfq', async () => {
      const data = buildUser({
        role: { roleName: 'Vendor' },
        org: { dpsName: SystemViewConfig.DPS_BASIC }
      });
      service.onSelectedSubscriptions('dpsName', data);
      expect(router.navigate).toHaveBeenCalledWith(['/vendor/rfq']);
      await flushNavigate();
    });

    it('should navigate PRApprover to procurerequest', () => {
      const data = buildUser({
        role: { roleName: 'PRApprover' },
        org: { dpsName: SystemViewConfig.DPS_BASIC }
      });
      service.onSelectedSubscriptions('dpsName', data);
      expect(router.navigate).toHaveBeenCalledWith(['/client/procurerequest']);
    });

    it('should navigate ClientInitiator selfClient GMT to create-rfq', async () => {
      const data = buildUser({
        selfClient: true,
        role: { roleName: 'ClientInitiator' },
        org: { gmtName: SystemViewConfig.GMT_BASIC }
      });
      service.onSelectedSubscriptions('gmtName', data);
      expect(router.navigate).toHaveBeenCalledWith(['/categorymgr/create-rfq']);
      await flushNavigate();
    });

    it('should navigate ClientInitiator non-self DPS to procurerequest', async () => {
      const data = buildUser({
        selfClient: false,
        role: { roleName: 'ClientInitiator' },
        org: { dpsName: SystemViewConfig.DPS_BASIC }
      });
      service.onSelectedSubscriptions('dpsName', data);
      expect(router.navigate).toHaveBeenCalledWith(['/client/procurerequest']);
      await flushNavigate();
    });

    it('should navigate ClientInitiator BFS to bfs/items', async () => {
      const data = buildUser({
        role: { roleName: 'ClientInitiator' },
        org: { bfsName: SystemViewConfig.BFS_PRO }
      });
      service.onSelectedSubscriptions('bfsName', data);
      expect(router.navigate).toHaveBeenCalledWith(['/bfs/items']);
      await flushNavigate();
    });

    it('should navigate ClientInitiator GMT in nested else when selfClient false', async () => {
      const data = buildUser({
        selfClient: false,
        role: { roleName: 'ClientInitiator' },
        org: { gmtName: SystemViewConfig.GMT_BASIC }
      });
      service.onSelectedSubscriptions('gmtName', data);
      expect(router.navigate).toHaveBeenCalledWith(['/categorymgr/create-rfq']);
      await flushNavigate();
    });

    it('should warn ClientInitiator when system view unsupported', () => {
      const data = buildUser({
        selfClient: true,
        role: { roleName: 'ClientInitiator' },
        org: { dpsName: 'Unknown View' }
      });
      service.onSelectedSubscriptions('dpsName', data);
      expect(toaster.warning).toHaveBeenCalled();
    });

    it('should navigate CategoryManagerBasic GMT to create-rfq', async () => {
      const data = buildUser({
        role: { roleName: 'CategoryManagerBasic' },
        org: { gmtName: SystemViewConfig.GMT_BASIC }
      });
      service.onSelectedSubscriptions('gmtName', data);
      expect(router.navigate).toHaveBeenCalledWith(['/categorymgr/create-rfq']);
      await flushNavigate();
    });

    it('should navigate CategoryManagerBasic DPS to procurequests', async () => {
      const data = buildUser({
        role: { roleName: 'CategoryManagerBasic' },
        org: { dpsName: SystemViewConfig.DPS_BASIC }
      });
      service.onSelectedSubscriptions('dpsName', data);
      expect(router.navigate).toHaveBeenCalledWith(['/categorymgr/procurequests']);
      await flushNavigate();
    });

    it('should navigate VendorExecutive to vendormgr/vendors', () => {
      const data = buildUser({
        role: { roleName: 'VendorExecutive' },
        org: { dpsName: SystemViewConfig.DPS_BASIC }
      });
      service.onSelectedSubscriptions('dpsName', data);
      expect(router.navigate).toHaveBeenCalledWith(['vendormgr/vendors']);
    });

    it('should navigate VendorExecutive2 to vendormgr/vendors', () => {
      const data = buildUser({
        role: { roleName: 'VendorExecutive2' },
        org: { dpsName: SystemViewConfig.DPS_BASIC }
      });
      service.onSelectedSubscriptions('dpsName', data);
      expect(router.navigate).toHaveBeenCalledWith(['vendormgr/vendors']);
    });

    it('should navigate CategoryManager GMT to create-rfq', async () => {
      const data = buildUser({
        role: { roleName: 'CategoryManager' },
        org: { gmtName: SystemViewConfig.GMT_BASIC }
      });
      service.onSelectedSubscriptions('gmtName', data);
      expect(router.navigate).toHaveBeenCalledWith(['/categorymgr/create-rfq']);
      await flushNavigate();
    });

    it('should navigate CategoryManager2 GMT to gmt-rqfs', async () => {
      const data = buildUser({
        role: { roleName: 'CategoryManager2' },
        org: { gmtName: SystemViewConfig.GMT_BASIC_PLUS }
      });
      service.onSelectedSubscriptions('gmtName', data);
      expect(router.navigate).toHaveBeenCalledWith(['/categorymgr/gmt-rqfs']);
      await flushNavigate();
    });

    it('should navigate CategoryManager BFS to bfs/items', async () => {
      const data = buildUser({
        role: { roleName: 'CategoryManager' },
        org: { bfsName: SystemViewConfig.BFS_PRO }
      });
      service.onSelectedSubscriptions('bfsName', data);
      expect(router.navigate).toHaveBeenCalledWith(['/bfs/items']);
      await flushNavigate();
    });

    it('should navigate CategoryManager2 DPS to dashboard', async () => {
      const data = buildUser({
        role: { roleName: 'CategoryManager2' },
        org: { dpsName: SystemViewConfig.DPS_BASIC }
      });
      service.onSelectedSubscriptions('dpsName', data);
      expect(router.navigate).toHaveBeenCalledWith(['/dashboard']);
      await flushNavigate();
    });

    it('should navigate unknown role to dashboard', () => {
      const data = buildUser({
        role: { roleName: 'SomeOtherRole' },
        org: { dpsName: SystemViewConfig.DPS_BASIC }
      });
      service.onSelectedSubscriptions('dpsName', data);
      expect(router.navigate).toHaveBeenCalledWith(['/dashboard']);
    });

    it('should handle null org system view safely', () => {
      const data = buildUser({
        role: { roleName: 'VendorManager' },
        org: { dpsName: null }
      });
      service.onSelectedSubscriptions('dpsName', data);
      expect(localStorage.getItem('orgId')).toBe('org-1');
      expect(router.navigate).toHaveBeenCalledWith(['/vendormgr/dashboard']);
    });
  });
});

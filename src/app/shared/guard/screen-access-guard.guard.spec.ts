import { ScreenAccessGuardGuard } from './screen-access-guard.guard';
import { SystemViewConfig } from 'src/app/app.config';

describe('ScreenAccessGuardGuard', () => {
  let guard: ScreenAccessGuardGuard;
  let encry: jasmine.SpyObj<any>;
  let router: jasmine.SpyObj<any>;
  let toaster: jasmine.SpyObj<any>;

  function permPayload(roleName: string) {
    return JSON.stringify({
      details: {
        username: 'u1',
        listofPermission: [],
        role: { roleName }
      }
    });
  }

  function routeState(url: string) {
    return { url } as any;
  }

  beforeEach(() => {
    encry = jasmine.createSpyObj('EncryDecryService', ['get', 'set']);
    router = jasmine.createSpyObj('Router', ['navigate']);
    toaster = jasmine.createSpyObj('ToastrService', ['error']);
    guard = new ScreenAccessGuardGuard(encry, router, toaster);
    localStorage.clear();
  });

  afterEach(() => {
    localStorage.clear();
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });

  it('should allow GMT user on allowed screen for GMT system', () => {
    localStorage.setItem('logData', 'x');
    localStorage.setItem('system-view', SystemViewConfig.GMT_BASIC);
    encry.get.and.returnValue(permPayload('CategoryManager'));
    expect(guard.canActivateChild({} as any, routeState('/categorymgr/create-rfq'))).toBe(true);
  });

  it('should deny GMT user on disallowed screen for GMT system', () => {
    localStorage.setItem('logData', 'x');
    localStorage.setItem('system-view', SystemViewConfig.GMT_PROF);
    encry.get.and.returnValue(permPayload('CategoryManager'));
    expect(guard.canActivateChild({} as any, routeState('/forbidden'))).toBe(false);
    expect(router.navigate).toHaveBeenCalledWith(['/login/unauthorizedAccess']);
  });

  it('should allow BFS user on allowed BFS screen', () => {
    localStorage.setItem('logData', 'x');
    localStorage.setItem('system-view', SystemViewConfig.BFS_PRO);
    encry.get.and.returnValue(permPayload('Vendor'));
    expect(guard.canActivateChild({} as any, routeState('/bfs'))).toBe(true);
  });

  it('should deny BFS user on disallowed BFS screen', () => {
    localStorage.setItem('logData', 'x');
    localStorage.setItem('system-view', SystemViewConfig.BFS_PRO);
    encry.get.and.returnValue(permPayload('Vendor'));
    expect(guard.canActivateChild({} as any, routeState('/not-allowed'))).toBe(false);
    expect(router.navigate).toHaveBeenCalledWith(['/login/unauthorizedAccess']);
  });

  it('should deny GMT user when system view is DPS and url is in GMT list', () => {
    localStorage.setItem('logData', 'x');
    localStorage.setItem('system-view', SystemViewConfig.DPS_BASIC);
    encry.get.and.returnValue(permPayload('CategoryManager'));
    expect(guard.canActivateChild({} as any, routeState('/categorymgr/create-rfq'))).toBe(false);
    expect(router.navigate).toHaveBeenCalledWith(['/login/unauthorizedAccess']);
  });

  it('should allow GMT user when system view is DPS and url is not in GMT list', () => {
    localStorage.setItem('logData', 'x');
    localStorage.setItem('system-view', SystemViewConfig.DPS_BASIC);
    encry.get.and.returnValue(permPayload('CategoryManager'));
    expect(guard.canActivateChild({} as any, routeState('/other'))).toBe(true);
  });

  it('should expire session for GMT user when system-view missing', () => {
    localStorage.setItem('logData', 'x');
    encry.get.and.returnValue(permPayload('ClientInitiator'));
    expect(guard.canActivateChild({} as any, routeState('/any'))).toBe(false);
    expect(toaster.error).toHaveBeenCalled();
    expect(router.navigate).toHaveBeenCalledWith(['/login']);
  });

  it('should allow non-GMT user when system-view missing', () => {
    localStorage.setItem('logData', 'x');
    encry.get.and.returnValue(permPayload('Admin'));
    expect(guard.canActivateChild({} as any, routeState('/any'))).toBe(true);
  });

  it('should treat system-view null string as missing', () => {
    localStorage.setItem('logData', 'x');
    localStorage.setItem('system-view', 'null');
    encry.get.and.returnValue(permPayload('Vendor'));
    expect(guard.canActivateChild({} as any, routeState('/any'))).toBe(false);
    expect(router.navigate).toHaveBeenCalledWith(['/login']);
  });
});

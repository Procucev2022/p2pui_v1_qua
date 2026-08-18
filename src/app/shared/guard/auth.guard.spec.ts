import { AuthGuard } from './auth.guard';

describe('AuthGuard', () => {
  let guard: AuthGuard;
  let router: jasmine.SpyObj<any>;

  beforeEach(() => {
    router = jasmine.createSpyObj('Router', ['navigate']);
    guard = new AuthGuard(router);
    localStorage.clear();
  });

  afterEach(() => localStorage.clear());

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });

  it('should return true when isLoggedin is set', () => {
    localStorage.setItem('isLoggedin', 'true');
    expect(guard.canActivate()).toBe(true);
  });

  it('should navigate to /login and return false when not logged in', () => {
    expect(guard.canActivate()).toBe(false);
    expect(router.navigate).toHaveBeenCalledWith(['/login']);
  });
});

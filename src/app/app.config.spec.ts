import {
  APP_CONFIG,
  AppConfig,
  BFS_SYSTEM_SCREEN_LIST,
  GMT_SYSTEM_SCREENS_LIST,
  PATTERNS,
  SystemViewConfig
} from './app.config';

describe('app.config', () => {
  it('should expose AppConfig with key fields', () => {
    expect(AppConfig.apiEndpoint).toBeDefined();
    expect(AppConfig.loggedUserRole).toBe('Vendor');
    expect(AppConfig.userRoles.length).toBeGreaterThan(0);
    expect(AppConfig.GRID_PAGE_INFO.initpageSize).toBe(100);
    expect(AppConfig.GRID_PAGE_INFO.pageOptions).toEqual([100, 150, 200]);
  });

  it('should expose SystemViewConfig values', () => {
    expect(SystemViewConfig.DPS_BASIC).toBe('DPS Basic');
    expect(SystemViewConfig.GMT_BASIC).toBe('GMT Basic');
    expect(SystemViewConfig.GMT_PROF).toBe('GMT Professional');
    expect(SystemViewConfig.BFS_PRO).toBe('BFS PRO');
  });

  it('should expose GMT_SYSTEM_SCREENS_LIST role routes', () => {
    expect(GMT_SYSTEM_SCREENS_LIST.CategoryManager.length).toBeGreaterThan(0);
    expect(GMT_SYSTEM_SCREENS_LIST.Vendor.length).toBeGreaterThan(0);
    expect(GMT_SYSTEM_SCREENS_LIST.ClientInitiator.length).toBeGreaterThan(0);
  });

  it('should expose BFS_SYSTEM_SCREEN_LIST role routes', () => {
    expect(BFS_SYSTEM_SCREEN_LIST.CategoryManager.length).toBeGreaterThan(0);
    expect(BFS_SYSTEM_SCREEN_LIST.Vendor.length).toBeGreaterThan(0);
    expect(BFS_SYSTEM_SCREEN_LIST.ClientInitiator.length).toBeGreaterThan(0);
  });

  it('should expose PATTERNS', () => {
    expect(PATTERNS.EMAIL).toBeDefined();
    expect(PATTERNS.ONLY_NUMBERS).toBeDefined();
    expect(PATTERNS.GSTIN).toBeDefined();
  });

  it('should expose APP_CONFIG injection token', () => {
    expect(APP_CONFIG).toBeTruthy();
  });
});

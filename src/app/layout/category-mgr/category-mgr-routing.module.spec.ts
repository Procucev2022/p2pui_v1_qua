import { CategoryMgrRoutingModule, categoryMgrRoutes } from './category-mgr-routing.module';

describe('CategoryMgrRoutingModule', () => {
  it('should create an instance', () => {
    expect(new CategoryMgrRoutingModule()).toBeTruthy();
  });

  it('should be constructible multiple times', () => {
    const a = new CategoryMgrRoutingModule();
    const b = new CategoryMgrRoutingModule();
    expect(a).toBeTruthy();
    expect(b).toBeTruthy();
  });

  it('should export categoryMgrRoutes with expected paths', () => {
    const paths = categoryMgrRoutes.map((r) => r.path);
    expect(paths).toContain('analytics');
    expect(paths).toContain('cat-mgr-reports');
    expect(paths).toContain('dashboard');
  });

  it('should invoke the analytics loadChildren factory', async () => {
    const analyticsRoute = categoryMgrRoutes.find((r) => r.path === 'analytics');
    expect(analyticsRoute).toBeTruthy();
    expect(typeof analyticsRoute?.loadChildren).toBe('function');
    const loaded: any = await (analyticsRoute?.loadChildren as () => Promise<any>)();
    expect(typeof loaded).toBe('function');
    expect(loaded.name).toBe('AnalyticsModule');
  });
});

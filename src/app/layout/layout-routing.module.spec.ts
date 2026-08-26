import { LayoutRoutingModule, layoutRoutes } from './layout-routing.module';
import { layoutRouteLoaderHooks } from './layout-route-loaders';

describe('LayoutRoutingModule', () => {
  afterEach(() => {
    layoutRouteLoaderHooks.fixtures = null;
  });

  it('should create an instance', () => {
    expect(new LayoutRoutingModule()).toBeTruthy();
  });

  it('should export layoutRoutes with child paths', () => {
    expect(layoutRoutes.length).toBe(1);
    const children = layoutRoutes[0].children || [];
    const paths = children.map((c) => c.path);
    expect(paths).toContain('dashboard');
    expect(paths).toContain('vendormgr');
    expect(paths).toContain('categorymgr');
    expect(paths).toContain('bfs');
    expect(paths).toContain('invoices');
  });

  it('should invoke every loadChildren factory via fixtures (Edge-safe)', async () => {
    const exportByKey: Record<string, string> = {
      dashboard: 'DashboardModule',
      vendormgr: 'VendorMgrModule',
      categorymgr: 'CategoryMgrModule',
      procuceve: 'ProcuceveAdminModule',
      client: 'ClientModule',
      vendor: 'VendorModule',
      vendorReq: 'VendorRequestModule',
      'raise-issue': 'RaiseIssueModule',
      ppos: 'PposModule',
      pos: 'PosModule',
      invoices: 'InvoicesModule',
      category: 'CategoryModule',
      config: 'ConfigurationsModule',
      bfs: 'BfsModule',
      'buyer-dashboard': 'BuyerDashboardModule',
    };
    layoutRouteLoaderHooks.fixtures = {};
    Object.keys(exportByKey).forEach((key) => {
      const exportName = exportByKey[key];
      (layoutRouteLoaderHooks.fixtures as any)[key] = {
        [exportName]: { name: exportName },
      };
    });

    const children = layoutRoutes[0].children || [];
    const loadersRoutes = children.filter(
      (r) => typeof r.loadChildren === 'function'
    );
    expect(loadersRoutes.length).toBeGreaterThan(0);

    for (const route of loadersRoutes) {
      const loaded = await (route.loadChildren as () => Promise<any>)();
      expect(loaded).toEqual(
        jasmine.objectContaining({ name: jasmine.any(String) })
      );
    }
  });
});

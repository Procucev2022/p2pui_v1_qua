import {
  layoutRouteLoaderHooks,
  loadLayoutRouteModule,
} from './layout-route-loaders';

describe('layout-route-loaders', () => {
  const originalImporters = { ...layoutRouteLoaderHooks.importers };

  afterEach(() => {
    layoutRouteLoaderHooks.fixtures = null;
    layoutRouteLoaderHooks.importers = { ...originalImporters };
  });

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
    'buyer-vendors': 'BuyerVendorsModule',
  };

  it('should load modules via fixtures for every key (Edge-safe)', async () => {
    layoutRouteLoaderHooks.fixtures = {};
    Object.keys(exportByKey).forEach((key) => {
      const exportName = exportByKey[key];
      (layoutRouteLoaderHooks.fixtures as any)[key] = {
        [exportName]: { name: exportName },
      };
    });

    for (const [key, exportName] of Object.entries(exportByKey)) {
      const loaded = await loadLayoutRouteModule(key, exportName);
      expect(loaded).toEqual(jasmine.objectContaining({ name: exportName }));
    }
  });

  it('should load via stubbed importers when fixtures are absent', async () => {
    layoutRouteLoaderHooks.fixtures = null;
    Object.keys(exportByKey).forEach((key) => {
      const exportName = exportByKey[key];
      layoutRouteLoaderHooks.importers[key] = async () => ({
        [exportName]: { name: exportName },
      });
    });

    for (const [key, exportName] of Object.entries(exportByKey)) {
      const loaded = await loadLayoutRouteModule(key, exportName);
      expect(loaded).toEqual(jasmine.objectContaining({ name: exportName }));
    }
  });

  it('should reject unknown keys via loadReal', async () => {
    layoutRouteLoaderHooks.fixtures = null;
    await expectAsync(
      layoutRouteLoaderHooks.loadReal('nope')
    ).toBeRejectedWithError(/Unknown layout route module key/);
  });
});

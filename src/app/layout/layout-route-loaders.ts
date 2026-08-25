/** Lazy loaders for layout child routes. Separated for Edge-safe stubbing in specs. */

/* istanbul ignore next -- real NgModule dynamic imports poison Karma/Edge TestBed */
function createLayoutRouteImporters(): Record<string, () => Promise<any>> {
  return {
    dashboard: () => import('./dashboard/dashboard.module'),
    vendormgr: () => import('./vendor-mgr/vendor-mgr.module'),
    categorymgr: () => import('./category-mgr/category-mgr.module'),
    procuceve: () => import('./procuceve-admin/procuceve-admin.module'),
    client: () => import('./client/client.module'),
    vendor: () => import('./vendor/vendor.module'),
    vendorReq: () => import('./vendor-request/vendor-request.module'),
    'raise-issue': () => import('./raise-issue/raise-issue.module'),
    ppos: () => import('./ppos/ppos.module'),
    pos: () => import('./pos/pos.module'),
    invoices: () => import('./invoices/invoices.module'),
    category: () => import('./category/category.module'),
    config: () => import('./configurations/configurations.module'),
    bfs: () => import('./bfs/bfs.module'),
    'buyer-dashboard': () => import('./buyer-dashboard/buyer-dashboard.module'),
  };
}

export const layoutRouteLoaderHooks = {
  fixtures: null as Record<string, any> | null,

  /** Overridable importers; unit tests replace entries with stubs. */
  importers: createLayoutRouteImporters(),

  loadReal: async (key: string): Promise<any> => {
    const importer = layoutRouteLoaderHooks.importers[key];
    if (!importer) {
      throw new Error('Unknown layout route module key: ' + key);
    }
    return importer();
  },

  importModule: async (key: string): Promise<any> => {
    const fixtures = layoutRouteLoaderHooks.fixtures;
    if (fixtures && Object.prototype.hasOwnProperty.call(fixtures, key)) {
      return fixtures[key];
    }
    return layoutRouteLoaderHooks.loadReal(key);
  },
};

export async function loadLayoutRouteModule(
  key: string,
  exportName: string
): Promise<any> {
  const mod = await layoutRouteLoaderHooks.importModule(key);
  return mod[exportName];
}

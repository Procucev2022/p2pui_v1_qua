/** Lazy loaders for app routes. Separated so unit tests can stub safely on Edge. */

/* istanbul ignore next -- real NgModule dynamic imports poison Karma/Edge TestBed */
function createAppRouteImporters(): Record<string, () => Promise<any>> {
  return {
    layout: () => import('./layout/layout.module'),
    login: () => import('./login/login.module'),
    signup: () => import('./signup/signup.module'),
    error: () => import('./server-error/server-error.module'),
    'not-found': () => import('./not-found/not-found.module'),
    pdf: () => import('./PdfReadable/PdfReadable.module'),
  };
}

export const appRouteLoaderHooks = {
  /**
   * When set, short-circuits dynamic import (Edge-safe unit tests).
   * Keys must match loadAppRouteModule keys.
   */
  fixtures: null as Record<string, any> | null,

  /** Overridable importers; unit tests replace entries with stubs. */
  importers: createAppRouteImporters(),

  loadReal: async (key: string): Promise<any> => {
    const importer = appRouteLoaderHooks.importers[key];
    if (!importer) {
      throw new Error('Unknown app route module key: ' + key);
    }
    return importer();
  },

  importModule: async (key: string): Promise<any> => {
    const fixtures = appRouteLoaderHooks.fixtures;
    if (fixtures && Object.prototype.hasOwnProperty.call(fixtures, key)) {
      return fixtures[key];
    }
    return appRouteLoaderHooks.loadReal(key);
  },
};

export async function loadAppRouteModule(
  key: string,
  exportName: string
): Promise<any> {
  const mod = await appRouteLoaderHooks.importModule(key);
  return mod[exportName];
}

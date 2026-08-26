import { CategoryMgrRoutingModule, routes } from './category-mgr-routing.module';

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

  it('should have routes defined with buyer-vendors loadChildren loader', async () => {
    expect(routes).toBeDefined();
    expect(routes.length).toBeGreaterThan(0);

    const buyerVendorsRoute = routes.find(r => r.path === 'buyer-vendors');
    expect(buyerVendorsRoute).toBeDefined();
    expect(typeof buyerVendorsRoute?.loadChildren).toBe('function');

    const loadedModule = await (buyerVendorsRoute?.loadChildren as () => Promise<any>)();
    expect(loadedModule).toBeDefined();
  });
});

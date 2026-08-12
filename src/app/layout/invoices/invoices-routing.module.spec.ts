import { InvoicesRoutingModule } from './invoices-routing.module';

describe('InvoicesRoutingModule', () => {
  let module: InvoicesRoutingModule;

  beforeEach(() => {
    module = new InvoicesRoutingModule();
  });

  it('should create an instance', () => {
    expect(module).toBeTruthy();
  });
});

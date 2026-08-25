import { InvoicesRoutingModule } from './invoices-routing.module';

describe('InvoicesRoutingModule', () => {
  it('should create an instance', () => {
    expect(new InvoicesRoutingModule()).toBeTruthy();
  });

  it('should be constructible multiple times', () => {
    const a = new InvoicesRoutingModule();
    const b = new InvoicesRoutingModule();
    expect(a).toBeTruthy();
    expect(b).toBeTruthy();
  });
});

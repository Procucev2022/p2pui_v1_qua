import { InvoicesModule } from './invoices.module';

describe('InvoicesModule', () => {
  it('should create an instance', () => {
    expect(new InvoicesModule()).toBeTruthy();
  });

  it('should be constructible multiple times', () => {
    const a = new InvoicesModule();
    const b = new InvoicesModule();
    expect(a).toBeTruthy();
    expect(b).toBeTruthy();
  });
});

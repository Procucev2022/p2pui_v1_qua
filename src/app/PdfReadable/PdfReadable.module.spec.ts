import { PdfReadableModule } from './PdfReadable.module';

describe('PdfReadableModule', () => {
  it('should create an instance', () => {
    expect(new PdfReadableModule()).toBeTruthy();
  });

  it('should be constructible multiple times', () => {
    const a = new PdfReadableModule();
    const b = new PdfReadableModule();
    expect(a).toBeTruthy();
    expect(b).toBeTruthy();
  });
});

import { PDFReadableRouterModule } from './PdfReadable.routing';

describe('PDFReadableRouterModule', () => {
  it('should create an instance', () => {
    expect(new PDFReadableRouterModule()).toBeTruthy();
  });

  it('should be constructible multiple times', () => {
    const a = new PDFReadableRouterModule();
    const b = new PDFReadableRouterModule();
    expect(a).toBeTruthy();
    expect(b).toBeTruthy();
  });
});

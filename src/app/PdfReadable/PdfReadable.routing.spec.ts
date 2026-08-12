import { PDFReadableRouterModule } from './PdfReadable.routing';

describe('PDFReadableRouterModule', () => {
  let module: PDFReadableRouterModule;

  beforeEach(() => {
    module = new PDFReadableRouterModule();
  });

  it('should create an instance', () => {
    expect(module).toBeTruthy();
  });
});

import * as jsPDFModule from 'jspdf';
import * as autoTableModule from 'jspdf-autotable';

/** Mutable API object so Jasmine can spy across ES module bindings. */
export const pdfExport: any = {
  createJsPdf(): any {
    const Ctor = (jsPDFModule as any).jsPDF || (jsPDFModule as any).default;
    return new Ctor();
  },
  runAutoTable(doc: any, opts: any) {
    const fn = (autoTableModule as any).default || autoTableModule;
    return fn(doc, opts);
  },
};

/** Back-compat named exports used by some specs/components. */
export function createJsPdf(): any {
  return pdfExport.createJsPdf();
}

export function runAutoTable(doc: any, opts: any) {
  return pdfExport.runAutoTable(doc, opts);
}

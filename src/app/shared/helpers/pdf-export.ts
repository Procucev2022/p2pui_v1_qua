import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

/** Mutable API object so Jasmine can spy across ES module bindings. */
export const pdfExport: any = {
  createJsPdf(): any {
    return new (jsPDF as any)();
  },
  runAutoTable(doc: any, opts: any) {
    return (autoTable as any)(doc, opts);
  },
};

/** Back-compat named exports used by some specs/components. */
export function createJsPdf(): any {
  return pdfExport.createJsPdf();
}

export function runAutoTable(doc: any, opts: any) {
  return pdfExport.runAutoTable(doc, opts);
}

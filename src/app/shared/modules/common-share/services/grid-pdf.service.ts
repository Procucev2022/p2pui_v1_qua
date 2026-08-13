import { Injectable } from '@angular/core';
import * as jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { ExportPdfService } from 'src/app/layout/category-mgr/services/export-pdf.service';

@Injectable({
  providedIn: 'root'
})
export class GridPdfService {

  constructor(private exportPDFService: ExportPdfService) { }
  exportAsPDF(rows, cols, pageTitle, fileName) {
    const doc = new jsPDF();
    doc.autoTable(cols, rows, {
      headerStyles: {
     lineWidth: 0.06,
     lineColor: [0, 0, 0],
     fontSize: 10,
     background: [217, 216, 216],
     fillColor: [232, 232, 232]
 },

     margin: {top: 20, left: 10, right: 10},
     theme: 'plain',
     styles: {
             // overflow: 'linebreak',
             lineWidth: 0.06,
             lineColor: [0, 0, 0],
             fontSize: 9,
           },
           // columnStyles: { 0: { halign: 'center', fillColor: [232,232,232] } }
    });
        // doc.autoTableHtmlToJson(columns, rows);
        const totalPages = doc.internal.getNumberOfPages();

        for (let i = 1; i <= totalPages; i++) {
          doc.setPage(i);
          doc.setFont('Times New Roman');
          doc.setFontType('bold');
          doc.setFontSize(12);
          doc.setLineWidth(0.5);
          doc.setDrawColor(0, 0, 0);
          // doc.rect(5, 5, 200, 285); // empty red square
          doc.setFont('Arial');
          doc.text(pageTitle, 10, 15);
          doc.setFontSize(10);
          doc.text('Page ' + i + ' of ' + totalPages, 10, doc.internal.pageSize.getHeight() - 8);
        }

        this.exportPDFService.addFooters(doc);
        doc.save(fileName);
  }
}

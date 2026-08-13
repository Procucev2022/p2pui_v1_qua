import { Component, OnInit, Inject } from '@angular/core';
import { CatProcuRequestsService } from 'src/app/layout/category-mgr/services';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { AppConfig } from 'src/app/app.config';
import { GridPdfService } from '../../services/grid-pdf.service';
import { ExportPdfService } from 'src/app/layout/category-mgr/services/export-pdf.service';
import { pdfExport } from 'src/app/shared/helpers/pdf-export';
@Component({
    selector: 'app-quot-view-details',
    templateUrl: './quot-view-details.component.html',
    styleUrls: ['./quot-view-details.component.scss']
})
export class QuotViewDetailsComponent implements OnInit {
    quotDetails: any;

    pageRecordSize: any;
    pageOptions: any;
    itempageOptions: any;
    itempaginatoryDetails: any;
    selectedIndex: any = 0;
    excelData: any[] = [];

    exportColumns: any;

    quotsItemTableHeaders: any = [
        { field: 'description', header: 'Desc', isLink: false, width: '180px' },
        { field: 'brand', header: 'Specification', isLink: false, width: '170px' },
        // { field: 'category', header: 'Category', isLink: false },
        // { field: 'itemcode', header: 'Item Code', isLink: false },
        { field: 'quantity', header: 'QTY', isLink: false, width: '90px' },
        { field: 'unitofMeasures', header: 'UOM', isLink: false, width: '90px' },
        { field: 'unitprice', header: 'Unit Price', isLink: false, width: '100px' },
        // { field: 'cgstPercentage', header: 'CGST %', isLink: false },
       // { field: 'cgstValue', header: 'CGST Value', isLink: false },
        { field: 'gstPercentage', header: 'GST %', isLink: false, width: '90px' },
        { field: 'gstValue', header: 'GST Value', isLink: false, width: '120px' },
        // { field: 'discountType', header: 'Discount Type', isLink: false },
        // { field: 'discountValue', header: 'Discount Value', isLink: false },
        { field: 'totalamount', header: 'Total Amount', isLink: false, width: '120px' },
    ];

    quotsItemTableData: any = [];
    quotationDocuments: any = [];

    constructor(private procuReqService: CatProcuRequestsService, private gridPdf: GridPdfService,
        @Inject(MAT_DIALOG_DATA) public data: any, private exportPDFService: ExportPdfService,
        public dialogRef: MatDialogRef<QuotViewDetailsComponent>) { }

    ngOnInit() {
        this.pageRecordSize = AppConfig.GRID_PAGE_INFO.initpageSize;
        this.pageOptions = AppConfig.GRID_PAGE_INFO.pageOptions;
        this.itempageOptions = AppConfig.GRID_PAGE_INFO.pageOptions;
        const obj = {
            'id': this.data.id
        };

        this.procuReqService.getQuotationDetails(obj).subscribe((res) => {
            if (res.status === 'Failure' || res.statusCode === 'Failure') {
                this.quotDetails = null;
            } else {
                this.quotDetails = Object.assign({}, res);
                this.quotsItemTableData = res.quotationItems;
                this.quotationDocuments = res.quotationDocuments;
            }

        });
    }

    onItemPage(event) {
        this.itempaginatoryDetails = event;

    }

    closeDialog() {
        this.dialogRef.close({ event: 'Cancel' });
    }

    back() {
        this.selectedIndex--;
    }

    next() {
        this.selectedIndex++;
    }

    safeText(value: any): string {
        return value == null ? '' : value.toString();
    }

    safeDateText(value: any): string {
        return value == null ? '' : new Date(value).toLocaleString();
    }

    exportAsPDF() {
        const self = this;
        const doc = pdfExport.createJsPdf();
        this.exportColumns = self.quotsItemTableHeaders.map(col => ({ title: col.header, dataKey: col.field }));
        const pageHeight = doc.internal.pageSize.height;
        doc.setLineWidth(0.3);
        doc.setTextColor(255, 165, 0);
        doc.text('Vendor Quotation', 12, 15);

        doc.setFontSize(12);
        doc.setFontSize(10);
        doc.setFont('helvetica');
        doc.setTextColor(0, 0, 0);
        doc.setFontType('normal');
        doc.text('Quotation Id', 30, 30);
        doc.text(this.quotDetails.quotationId.toString(), 80, 30);
        doc.text('Vendor Name', 30, 40);
        doc.text(this.quotDetails.orgId.companyName, 80, 40);
        doc.text('Vendor Mail Id', 30, 50);
        doc.text(this.safeText(this.quotDetails.orgId.email), 80, 50);
        doc.text('Phone Number', 30, 60);
        doc.text(this.safeText(this.quotDetails.orgId.organizationPhonenumber), 80, 60);
        doc.text('Address', 30, 70);
        doc.text(this.safeText(this.quotDetails.orgId.address1), 80, 70);
        doc.text('City', 30, 80);
        doc.text(this.safeText(this.quotDetails.orgId.city), 80, 80);
        doc.text('GST Amount', 30, 90);
        doc.text(this.quotDetails.gstSum.toString(), 80 , 90);
        doc.text('Total Amount', 30, 100);
        doc.text(this.quotDetails.totalAmount.toString(), 80, 100);
        doc.text('Paymeny Terms', 30, 110);
        doc.text(this.safeText(this.quotDetails.paymentTerms), 80, 110);
        doc.text('Delivery Terms', 30, 120);
        doc.text(this.safeText(this.quotDetails.deliveryTerms), 80, 120);
        doc.text('Other Terms', 30, 130);
        doc.text(this.safeText(this.quotDetails.otherTerms), 80, 130);
        doc.text('Submitted Time', 30, 140);
        doc.text(this.safeDateText(this.quotDetails.createdTS), 80, 140);
        doc.text('Submitted By', 30, 150);
        doc.text(this.safeText(this.quotDetails.createdBy), 80, 150);
        const headers = [];
        this.exportColumns.forEach(col => {
            headers.push(col.title);
        });
        const finalY = (doc.autoTable && doc.autoTable.previous && doc.autoTable.previous.finalY) || 10;
        void finalY;
        void pageHeight;
        const body = [];
        self.quotsItemTableData.forEach(each => {
            const eachRow = [];
            this.exportColumns.forEach(col => {
                eachRow.push(each[col.dataKey]);
            });
            body.push(eachRow);
        });
        pdfExport.runAutoTable(doc, {
            startY: 160,
            head: [headers],
            body: body
        });
        doc.setLineWidth(0.3);
        doc.setTextColor('#000000');

        this.exportPDFService.addFooters(doc);
        doc.save(new Date().getTime().toString() + '.pdf');
      }

      zoomout() {
        this.dialogRef.updateSize('70%');
      }

      zoomin() {
          this.dialogRef.updateSize('90%');
      }


}

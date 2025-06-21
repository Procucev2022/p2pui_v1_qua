import { Component, OnInit, Input, ViewChild, ElementRef, Output, EventEmitter } from '@angular/core';
import { AppApiConfig } from 'src/app/shared/constants/app-api.config';
// import html2canvas from 'html2canvas';
import * as jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import {PoService} from 'src/app/shared/modules/common-share/services/po.service';
import { AppConfig } from 'src/app/app.config';
import { ExportPdfService } from 'src/app/layout/category-mgr/services/export-pdf.service';
import { ExcelService } from '../../../services/excel.service';
@Component({
    selector: 'app-ppo-items',
    templateUrl: './ppo-items.component.html',
    styleUrls: ['./ppo-items.component.scss']
})
export class PpoItemsComponent implements OnInit {
    selectedData: any = [];
    pageRecordSize: any;
    pageOptions: any;
    linkedVendorListByItem: any = [];

    vendorHeaders = [
        { field: 'vendorName',  header: 'Vendor Name',  isLink: false, width: '220px', fieldType: 'text' },
        { field: 'city',  header: 'City',  isLink: false, width: '120px', fieldType: 'text' },
        { field: 'rank', header: 'Rank', isLink: false,  width: '120px',  fieldType: 'text'},
        { field: 'uom', header: 'UOM', isLink: false,  width: '130px',  fieldType: 'text'},
        { field: 'pricePerUnit',  header: 'Price Per Unit',  isLink: false, width: '120px', fieldType: 'text' }
      ];
    ppoItemsHeaders: any = [
        { field: 'description', header: 'Description', isLink: false, width: '300px' },
        { field: 'projectCategory', header: 'Project Category', isLink: false, width: '300px' },
        { field: 'projectSubCategory', header: 'Project SubCategory', isLink: false, width: '300px' },
        { field: 'brand', header: 'Specification', isLink: false, width: '170px' },
        { field: 'quantity', header: 'PR Quantity', isLink: false, width: '140px' },
        { field: 'unitofMeasures', header: 'UOM', isLink: false, width: '100px' },
        { field: 'unitprice', header: 'Unit Price'  , isLink: false, width: '140px'},
        { field: 'excludetaxamount', header: 'Total Basic Amount', isLink: false, width: '150px' },
        // { field: 'gstValue', header: 'GST Value', isLink: false, width: '145px' },
        // { field: 'totalamount', header: 'Total Amount', isLink: false, width: '155px' },
    ];
    paginatoryDetails: any;

    @Input('ppoItems') ppoItems;
    @Input('ppoData') ppoData: any;
    @Input('prDetails') prDetails: any;
    groupItemsByVendorId: any;
    groupItemsByVendorName: any;
    vendorsList: string[];
    vendorsListName: string[];
    @ViewChild('pposRef') pposRef: ElementRef;
    @ViewChild('downloadLink') downloadLink: ElementRef;
    exportColumns: any;
    exportVendorColumns: any;
    pdfDataSize: any;
    vList: any[];
    @Output() onSelectVendorEvent: EventEmitter<any> = new EventEmitter();
    ppoAuditHistory: any[];
    prAuditHistory: any[];
    constructor(private poService: PoService,
        private exportPDFService: ExportPdfService, private excelService: ExcelService) {}



    ngOnInit() {
        this.pageRecordSize = AppApiConfig.GRID_PAGE_INFO.initpageSize;
        this.pageOptions = AppApiConfig.GRID_PAGE_INFO.pageOptions;
        this.groupItemsByVendorId = this.ppoItems.reduce(function (r, a) {
            r[a.org.id] = r[a.org.id] || [];
            r[a.org.id].push(a);
            return r;
        }, Object.create(null));
        this.groupItemsByVendorName = this.ppoItems.reduce(function (x, b) {
            x[b.org.companyName] = x[b.org.companyName] || [];
            x[b.org.companyName].push(b);
            return x;
        }, Object.create(null));
        this.vendorsList = Object.keys(this.groupItemsByVendorId);
        this.vendorsListName = Object.keys(this.groupItemsByVendorName);
        console.log(this.vendorsListName);

        const obj = {};

        for ( let i = 0, len = this.ppoItems.length; i < len; i++ ) {
        obj[this.ppoItems[i].org['id']] = this.ppoItems[i];
        }

        this.vList = new Array();
        for ( const key in obj ) {
        this.vList.push(obj[key]);
        }
        console.log(this.vList);
        this.getAuditHistory();
    }


    exportPdf() {
        const self = this;


        const doc = new jsPDF();
        this.exportColumns = self.ppoItemsHeaders.map(col => ({ title: col.header, dataKey: col.field }));
        doc.setFontSize(12);


        doc.text('PPO Id: ' + this.ppoData.ppoId, 12, 12);
        doc.text('PR Id: ' + this.ppoData.pr.prId, 150, 12);
        doc.text('PPO Value: ' + this.ppoData.ppoValue, 12, 20);

        const headers = [];

        this.exportColumns.forEach(col => {
            headers.push(col.title);
        });

        self.vendorsList.forEach((vendor, index) => {

            const finalY = doc.autoTable.previous.finalY || 10;

            doc.setTextColor(255, 0, 0);

            doc.text('Vendor Id: ' + vendor, 12, index !== 0 ? finalY + 20 : 40);

            const body = [];
            self.groupItemsByVendorId[vendor].forEach(each => {
                const eachRow = [];
                this.exportColumns.forEach(col => {
                    eachRow.push(each[col.dataKey]);
                });
                body.push(eachRow);
            });

            autoTable(doc, {
                startY: index !== 0 ? finalY + 30 : 50,
                head: [headers],
                body: body
            });

        });
        doc.setTextColor('#000000');
        this.exportPDFService.addFooters(doc);

        doc.save(new Date().getTime().toString() + '.pdf');

    }

    getLinkedVendorDetails(rowData, event) {
        console.log(rowData);

        this.linkedVendorListByItem = [];
        if (rowData.linkedItemId != null) {
            const obj = {
                'client': {
                    'id': this.prDetails.org.id
                },
                'item': {
                    'id': rowData.linkedItemId
                }
            };
            this.poService.getVendorsByClientAndItem(obj).subscribe((res) => {
                if (res && Array.isArray(res)) {
                    this.linkedVendorListByItem = [];
                    if (res.length <= 5) {
                        for (let i = 0; i < res.length; i++) {
                            const data = res[i];
                            data['uom'] = data['uom']['description'];
                            data['status'] = data.status ? data['status']['uiDisplay'] : '';
                            this.linkedVendorListByItem.push(data);
                        }
                    } else {
                        for (let i = 0; i < 5; i++) {
                            const data = res[i];
                            data['uom'] = data['uom']['description'];
                            data['status'] = data.status ? data['status']['uiDisplay'] : '';
                            this.linkedVendorListByItem.push(data);
                        }
                    }
                }
            });

        }

    }


    onSelectedVendor(vendorId) {
        const selectedVendorLineItems = this.ppoItems.filter((item) =>  item.org.id === vendorId );
        const poQuantity = { field: 'poQuantity', header: 'PO Quantity', isLink: false, width: '140px' };
        const tableHeaders = [...this.ppoItemsHeaders];
        tableHeaders.splice(3, 0, poQuantity );
        const mock_po_data = {
            lineItemsList: selectedVendorLineItems,
            vendorId : vendorId,
            vendorName: selectedVendorLineItems[0]['org']['companyName'],
            companyId: selectedVendorLineItems[0]['org']['companyId'],
            poItemsHeaders: tableHeaders
        };
        console.log('vendor', mock_po_data);
        this.onSelectVendorEvent.emit(mock_po_data);
    }

    async getAuditHistory(){
        this.excelService.getPPOAuditHistory({id: this.ppoData.id}).subscribe((res:any)=>{
            if(Array.isArray(res)){
                this.ppoAuditHistory = res || [];
            }
        })
        this.excelService.getPRAuditHistory({id: this.ppoData.prsid}).subscribe((res:any)=>{
            if(Array.isArray(res)){
                this.prAuditHistory = res || [];
            }
        })
    }
    downloadViewPPO(data) {

        const self = this;
        const doc = new jsPDF();
        let y = 20;
        const z = 0;
        // self.vendorsList.forEach((vendor, index) => {
        //     if(data == vendor){
        //     doc.internal.pageSize.height = doc.internal.pageSize.height + self.groupItemsByVendorId[vendor].length * 4;
        //     }
        // })
        const pageHeight = doc.internal.pageSize.height;

        this.exportColumns = self.ppoItemsHeaders.map(col => ({ title: col.header, dataKey: col.field }));
        this.exportVendorColumns = this.vendorHeaders.map(col => ({title: col.header, dataKey: col.field }));
        doc.setLineWidth(0.3);
        doc.setFontSize(16);
        doc.setFont('helvetica');
        doc.setFontType('bold');
        doc.text(75, 8, 'Pre Purchase Order');

        const img = new Image();
        img.src = 'assets/Procuce_ New_Logo.png';

        const imgData = AppApiConfig.LOGO_IMG_BASE64_DATA;
        doc.addImage(imgData, 'png', 155, 8, 45, 20);

        doc.setFontSize(10);
        doc.setFont('helvetica');
        doc.setFontType('normal');
        doc.text('PPO Id ', 12, y);

        doc.text(': ' + ' ' + this.ppoData.ppoId, 80, y);

        doc.text('PR Id ', 12, y = y + 8);

        doc.text(': ' + ' ' + this.ppoData.prId, 80, y);

        doc.text('PPO Value ', 12, y = y + 8);

        doc.text(': ' + ' ' + this.ppoData.ppoValue, 80, y);

        doc.text('PPO Date', 12, 44);
        const dateTime = this.exportPDFService.getDateForGivenDateTime(this.ppoData.createdTS);
        doc.text(': ' + ' ' + dateTime, 80, y = y + 8);

        doc.setFontSize(12);
        doc.setFont('helvetica');
        doc.setFontType('normal');
        doc.text('Delivery Location ', 12, y = y + 8);

        doc.setFontSize(10);
        doc.setFont('helvetica');
        doc.setFontType('normal');
       this.ppoData.clientdeliverylocation.forEach((element, index) => {
       const ind: any = index + 1;
        doc.text('Address' + ind, 12, y = y + 8);
        doc.text(': ' + ' ' + element.address + ',' + element.city + ',' + element.state, 80, index === 0 ? 60 : 68);
       });

        doc.setFontSize(12);
        doc.setTextColor(0, 0, 0);
        doc.setFont('helvetica');
        doc.setFontType('normal');
        doc.text('Delivery Terms ', 12,  y = y + 8 );

        if ( y + 10 > pageHeight - 20) {
            doc.addPage();
            doc.setLineWidth(0.3);
        y = 10;
        } else {}
        doc.setFontSize(8);
        doc.setTextColor(128, 128, 128);
        doc.setFont('helvetica');
        doc.setFontType('normal');
        doc.text(this.ppoData.deliveryTerms == null ? 'tc' : this.ppoData.deliveryTerms, 12,  y = y + 8);

        if ( y + 10 > pageHeight - 20) {
            doc.addPage();
            doc.setLineWidth(0.3);
            y = 10;
        } else {}
        doc.setFontSize(12);
        doc.setTextColor(0, 0, 0);
        doc.setFont('helvetica');
        doc.setFontType('normal');
        doc.text('Other Terms ', 12, y = y + 8);

        if ( y + 10 > pageHeight - 20) {
            doc.addPage();
            doc.setLineWidth(0.3);
       y = 10;
        } else {}
        doc.setFontSize(8);
        doc.setTextColor(128, 128, 128);
        doc.setFont('helvetica');
        doc.setFontType('normal');
        doc.text(this.ppoData.otherTerms == null ? 'tc' :  this.ppoData.otherTerms, 12, y = y + 5);

        if ( y + 10 > pageHeight - 20) {
            doc.addPage();
            doc.setLineWidth(0.3);
       y = 10;
        } else {}
        doc.setFontSize(12);
        doc.setTextColor(0, 0, 0);
        doc.setFont('helvetica');
        doc.setFontType('normal');
        doc.text('Payment Terms', 12 , y = y + 8);

        if ( y + 10 > pageHeight - 20) {
            doc.addPage();
            doc.setLineWidth(0.3);
        y = 10;
        } else {}
        doc.setFontSize(8);
        doc.setTextColor(128, 128, 128);
        doc.setFont('helvetica');
        doc.setFontType('normal');
        doc.text(this.ppoData.paymentTerms == null ? 'tc' : this.ppoData.paymentTerms, 12, y = y + 5);

        if (y + 10 > pageHeight - 20) {
            doc.addPage();
            doc.setLineWidth(0.3);
            y = 10;
        } else {}
       doc.setFontSize(10);
       doc.setTextColor(0, 0, 0);
        doc.setFont('helvetica');
        doc.setFontType('normal');
        doc.text('ApprovedBy' , 12, y = y + 8);
         doc.text(': ' + this.ppoData.approvedBy, 80, y);

        if (y + 10 > pageHeight - 20) {
            doc.addPage();
            doc.setLineWidth(0.3);
           y = 10;
        } else {}
        doc.text('ReviewedBy', 12, y = y  + 8);
         doc.text(': ' + this.ppoData.submittedBy, 80, y);


        if (y + 10 > pageHeight - 20) {
            doc.addPage();
            doc.setLineWidth(0.3);
            y = 10;
        } else {}
        doc.text('Submitted', 12, y = y + 8);
        doc.text(': ' + this.ppoData.createdBy, 80, y);
        const headers = [];

        this.exportColumns.forEach(col => {
            headers.push(col.title);
        });
        self.vendorsList.forEach((vendor, index) => {
            if (data === vendor) {
            const body = [];
            self.groupItemsByVendorId[vendor].forEach(each => {
                this.pdfDataSize = self.groupItemsByVendorId[vendor];
                doc.setTextColor(255, 0, 0);
                doc.text('Vendor Name: ' + each.org.companyName, 12, index !== 0 ? y = y + 20 : 130);
                const eachRow = [];
                this.exportColumns.forEach(col => {
                    eachRow.push(each[col.dataKey]);
                });
                body.push(eachRow);
            }
            );
            autoTable(doc, {
                startY: y = y + 20,
                head: [headers],
                body: body,
            });
            if (doc.lastAutoTable.finalY + 10 > pageHeight - 20) {
                doc.addPage();
                doc.lastAutoTable.finalY = 10;
            } else {}
        }
        });

        const vedndorHeaders = [];
        this.exportVendorColumns.forEach(col => {
            vedndorHeaders.push(col.title);
        });
        if (this.ppoItems[0].linkedItemId != null) {
            for (let v = 0; v < this.ppoItems.length; v++) {
                const obj = {
                    'client': {
                        'id': this.prDetails.org.id
                    },
                    'item': {
                        'id': this.ppoItems[v].linkedItemId
                    }
                };
                let updatedres = [];
                this.poService.getVendorsByClientAndItem(obj).subscribe((res) => {
                    if (res && Array.isArray(res)) {
                        updatedres = this.getTopFiveElements(res);


                        updatedres.forEach((data) => {
                            data['uom'] = data['uom']['description'];
                            data['status'] = data.status ? data['status']['uiDisplay'] : '';
                        });

                        const body = [];
                        doc.setTextColor(255, 0, 0);
                        doc.text('Item Name: ' + this.ppoItems[v].description,  12,  doc.lastAutoTable.finalY + 10);
                        updatedres.forEach((vendor, index) => {
                            const eachRow = [];
                            this.exportVendorColumns.forEach(col => {
                                eachRow.push(vendor[col.dataKey]);
                            });
                            body.push(eachRow);
                        });

                        autoTable(doc, {
                            startY:  doc.lastAutoTable.finalY + 15,
                            head: [vedndorHeaders],
                            body: body
                        });

                        if (doc.lastAutoTable.finalY + 10 > pageHeight - 20) {
                            doc.addPage();
                            doc.lastAutoTable.finalY = 10;
                        }



                    }
                });
            }
        }
        if (doc.lastAutoTable.finalY + 40 > pageHeight - 20) {
            doc.addPage();
            doc.lastAutoTable.finalY = 10;
        }

        doc.setFontType('bold');
        doc.setTextColor(255, 0, 0);
        doc.text('PPO Accepted History: ',12 , (doc.lastAutoTable.finalY<=220? doc.lastAutoTable.finalY+15 : 25) );
        doc.setFontType('normal');
        doc.setTextColor('#000000');
        const ppoAuditData = this.ppoAuditHistory.map((ele:any, index)=>{return [index+1, ele.email, this.exportPDFService.utcToIst(ele.createdTS)]})
        const prAuditData = this.prAuditHistory.map((ele:any, index)=>{return [index+1, ele.email, this.exportPDFService.utcToIst(ele.createdTS)]})
        autoTable(doc, {
            startY:  doc.lastAutoTable.finalY + 20,
            head: [['S.No', 'Username/ Email', 'Date & Time']],
            body:
                ppoAuditData

        });


        doc.setFontType('bold');
        doc.setTextColor(255, 0, 0);
        doc.text('PR Accepted History: ',12 , doc.lastAutoTable.finalY + 15);
        doc.setFontType('normal');
        doc.setTextColor('#000000');
        autoTable(doc, {
            startY:  doc.lastAutoTable.finalY +20,
            head: [['S.No', 'Username/ Email', 'Date & Time']],
            body:
            prAuditData

        });
        this.exportPDFService.addFooters(doc);
        setTimeout(function() {
            doc.save(new Date().getTime().toString() + '.pdf');
        }, 2000);

    }

    getTopFiveElements(arr): any[] {
        const new_array = [];
        if (arr.length <= 5) {
            return arr;
        } else {
            for (let i = 0; i < arr.length; i++) {
                new_array.push(arr[i]);
            }
            return new_array;
        }
    }

}

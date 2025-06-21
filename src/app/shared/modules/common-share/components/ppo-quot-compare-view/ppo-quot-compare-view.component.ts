import { Component, OnInit, Input, ElementRef, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { CatProcuRequestsService } from 'src/app/layout/category-mgr/services';
import { ToastrService } from 'ngx-toastr';
import { PpoCreateComponent } from '../ppo-create/ppo-create.component';
import html2canvas from 'html2canvas';
import * as jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { ExportPdfService } from 'src/app/layout/category-mgr/services/export-pdf.service';
import * as xlsx from 'xlsx';
@Component({
    selector: 'app-ppo-quot-compare-view',
    templateUrl: './ppo-quot-compare-view.component.html',
    styleUrls: ['./ppo-quot-compare-view.component.scss']
})
export class PpoQuotCompareViewComponent implements OnInit {
    isPageLoad: boolean;
    finalPPOData: any[] = [];
    @Input('prId') prId;
    @Input('rfqId') rfqId;
    @Input('ppoData') ppoData;

    @ViewChild('exportTable') exportTable: ElementRef;
    @ViewChild('screen') screen: ElementRef;
    @ViewChild('canvas') canvas: ElementRef;

    @ViewChild('downloadLink') downloadLink: ElementRef;
    itemData: { items: any; headers: any; };
    constructor(private modalDialog: MatDialog, private procService: CatProcuRequestsService, private toastrService: ToastrService,
        private exportService: ExportPdfService) { }
    selectedPr;
    prList: any[] = [];
    selectedCategoryType: any;
    ngOnInit() {
        this.selectedCategoryType = this.rfqId ? 'RFQ Wise' : '';
        this.isPageLoad = false;
        // this.arrayPrepare();
        this.selectedPr = this.prId;
        // this.prChange();
    }


    vendorColHeaders = [];
    itemRowHeaders = [];
    itemArray = [];
    // vendorColHeaders = [
    //   { id: 'v1', name: 'Vendor1'},
    //   { id: 'v2', name: 'Vendor2'},
    //   { id: 'v3', name: 'Vendor3'},
    //   { id: 'v4', name: 'Vendor4'},
    //   { id: 'v5', name: 'Vendor5'},
    //   { id: 'v6', name: 'Vendor6'},
    //   { id: 'v7', name: 'Vendor7'},
    //   { id: 'v8', name: 'Vendor8'}
    // ]

    // itemRowHeaders = [
    //   { id: 'item1', name: 'item1'},
    //   { id: 'item2', name: 'Item2'},
    //   { id: 'item3', name: 'Item3'},
    //   { id: 'item4', name: 'Item4'},
    //   { id: 'item5', name: 'Item5'},
    //   { id: 'item6', name: 'Item6'},
    //   { id: 'item7', name: 'Item7'},
    //   { id: 'item8', name: 'Item8'},
    //   { id: 'item9', name: 'Item9'},
    // ]

    // itemArray = [
    //   { id: 'item1', vendorId: 'v1', name: 'Item11', isActive: false},
    //   { id: 'item2', vendorId: 'v1', name: 'Item12', isActive: false},
    //   { id: 'item3', vendorId: 'v1', name: 'Item13', isActive: false},

    //   { id: 'item1', vendorId: 'v2', name: 'Item21', isActive: false},
    //   { id: 'item2', vendorId: 'v2', name: 'Item22', isActive: false},

    //   { id: 'item6', vendorId: 'v2', name: 'itemv26', isActive: false},
    //   { id: 'item7', vendorId: 'v2', name: 'itemv27', isActive: false},
    //   { id: 'item8', vendorId: 'v2', name: 'itemv28', isActive: false},

    //   { id: 'item3', vendorId: 'v3', name: 'Item33', isActive: false},
    //   { id: 'item4', vendorId: 'v3', name: 'item34', isActive: false},
    //   { id: 'item5', vendorId: 'v3', name: 'item35', isActive: false},
    //   { id: 'item3', vendorId: 'v2', name: 'Item23', isActive: false},
    //   { id: 'item4', vendorId: 'v2', name: 'item24', isActive: false},
    //   { id: 'item5', vendorId: 'v2', name: 'item25', isActive: false},

    //   { id: 'item6', vendorId: 'v3', name: 'itemv36', isActive: false},
    //   { id: 'item7', vendorId: 'v3', name: 'itemv37', isActive: false},
    //   { id: 'item8', vendorId: 'v3', name: 'itemv38', isActive: false},

    //   { id: 'item1', vendorId: 'v3', name: 'Item31', isActive: false},
    //   { id: 'item2', vendorId: 'v3', name: 'Item32', isActive: false},

    //   { id: 'item1', vendorId: 'v4', name: 'Item41', isActive: false},
    //   { id: 'item2', vendorId: 'v4', name: 'Item42', isActive: false},
    //   { id: 'item2', vendorId: 'v5', name: 'Item52', isActive: false},
    //   { id: 'item3', vendorId: 'v5', name: 'Item53', isActive: false},
    //   { id: 'item3', vendorId: 'v4', name: 'Item43', isActive: false},
    //   { id: 'item4', vendorId: 'v4', name: 'item44', isActive: false},
    //   { id: 'item5', vendorId: 'v4', name: 'item45', isActive: false},

    //   { id: 'item6', vendorId: 'v4', name: 'itemv46', isActive: false},
    //   { id: 'item7', vendorId: 'v4', name: 'itemv47', isActive: false},
    //   { id: 'item8', vendorId: 'v4', name: 'itemv48', isActive: false},

    //   { id: 'item1', vendorId: 'v5', name: 'Item51', isActive: false},
    //   { id: 'item4', vendorId: 'v5', name: 'item54', isActive: false},
    //   { id: 'item5', vendorId: 'v5', name: 'item55', isActive: false},

    //   { id: 'item4', vendorId: 'v1', name: 'itemv14', isActive: false},
    //   { id: 'item5', vendorId: 'v1', name: 'itemv15', isActive: false},
    //   { id: 'item6', vendorId: 'v1', name: 'itemv16', isActive: false},
    //   { id: 'item7', vendorId: 'v1', name: 'itemv17', isActive: false},
    //   { id: 'item8', vendorId: 'v1', name: 'itemv18', isActive: false},


    //   { id: 'item1', vendorId: 'v6', name: 'item61', isActive: false},
    //   { id: 'item2', vendorId: 'v6', name: 'item62', isActive: false},
    //   { id: 'item3', vendorId: 'v6', name: 'item63', isActive: false},
    //   { id: 'item4', vendorId: 'v6', name: 'item64', isActive: false},
    //   { id: 'item5', vendorId: 'v6', name: 'item65', isActive: false},
    //   { id: 'item6', vendorId: 'v6', name: 'item66', isActive: false},
    //   { id: 'item7', vendorId: 'v6', name: 'item67', isActive: false},
    //   { id: 'item8', vendorId: 'v6', name: 'item68', isActive: false},


    //   { id: 'item1', vendorId: 'v7', name: 'item71', isActive: false},
    //   { id: 'item2', vendorId: 'v7', name: 'item72', isActive: false},
    //   { id: 'item3', vendorId: 'v7', name: 'item73', isActive: false},
    //   { id: 'item4', vendorId: 'v7', name: 'item74', isActive: false},
    //   { id: 'item5', vendorId: 'v7', name: 'item75', isActive: false},
    //   { id: 'item6', vendorId: 'v7', name: 'item76', isActive: false},
    //   { id: 'item7', vendorId: 'v7', name: 'item77', isActive: false},
    //   { id: 'item8', vendorId: 'v7', name: 'item78', isActive: false},

    //   { id: 'item1', vendorId: 'v8', name: 'item81', isActive: false},
    //   { id: 'item2', vendorId: 'v8', name: 'item82', isActive: false},
    //   { id: 'item3', vendorId: 'v8', name: 'item83', isActive: false},
    //   { id: 'item4', vendorId: 'v8', name: 'item84', isActive: false},
    //   { id: 'item5', vendorId: 'v8', name: 'item85', isActive: false},
    //   { id: 'item6', vendorId: 'v8', name: 'item86', isActive: false},
    //   { id: 'item7', vendorId: 'v8', name: 'item87', isActive: false},
    //   { id: 'item8', vendorId: 'v8', name: 'item88', isActive: false},

    //   { id: 'item6', vendorId: 'v5', name: 'item56', isActive: false},
    //   { id: 'item7', vendorId: 'v5', name: 'item57', isActive: false},
    //   { id: 'item8', vendorId: 'v5', name: 'item58', isActive: false},

    //   { id: 'item9', vendorId: 'v1', name: 'item91', isActive: false},
    //   { id: 'item9', vendorId: 'v2', name: 'item92', isActive: false},
    //   { id: 'item9', vendorId: 'v3', name: 'item93', isActive: false},
    //   { id: 'item9', vendorId: 'v4', name: 'item94', isActive: false},
    //   { id: 'item9', vendorId: 'v5', name: 'item95', isActive: false},
    //   { id: 'item9', vendorId: 'v6', name: 'item96', isActive: false},
    //   { id: 'item9', vendorId: 'v7', name: 'item97', isActive: false},
    //   { id: 'item9', vendorId: 'v5', name: 'item98', isActive: false},
    // ]


    arrayPrepare() {
        this.itemArray.forEach(element => {

        });
    }

    downloadAsPDF() {
        this.exportService.downloadPDFForQuoteComp(this.vendorColHeaders, this.itemRowHeaders, this.itemArray, this.ppoData);
    }
    downloadImage() {
        const doc = new jsPDF('landscape');
        doc.setFontSize(10);

        doc.setFont('helvetica');
        doc.setFontType('bold');
        doc.text(75, 12, 'Quote Comparison');
        autoTable(doc, { html: '#my-table' });

        // Or use javascript directly:
        const tableHeaders = this.vendorColHeaders.map(ele => (ele.vendorName + '\n' + ele.quoteId));



        const z = [[1, 'MS PIPE 1/4 INCH, EACH LENGTH 6 MTRS, B Class', 60, 'MTR', 100, 80], [2, 'MS PIPE 3/8INCH MS PIPE 3/8INCH EACH LENGTH 6 MTRS MS PIPE 3/8INCH, EACH LENGTH 6 MTRS.,B Class', 60, 'MTR', 210, 90], [3, 'GI PIPE 2 INCH CLASS B GI PIPE 2 INCH CLASS B - GI PIPE 2 INCH CLASS B -', 60, 'MTR', 250, 78], [4, 'MS PIPE 100mm,,B Class', 96, 'MTR', 456, 75], [5, 'MS PIPE 150mm,,B Class', 84, 'MTR', 255.2, 95], [6, 'MS PIPE 10 DIA, 4.85mmWALL THK,, MS PIPE 10 DIA, CLASS-C MS PIPE 10 DIA, CLASS-C, WATER LINE MAINTENANCE', 72, 'MTR', 330, 89], [7, 'MS PIPE 75MM NB,, MS PIPE 75MM NB MS PIPE 75MM NB', 72, 'MTR', 320, 95], [8, 'MS PIPE 4 INCH DIA , CLASS:B MS PIPE 4 INCH DIA , CLASS:B MS PIPE 4 INCH DIA(101.6 MM) CLASS ,B, MS PIPE 4 INCH DIA , CLASS:B MS PIPE 4 INCH DIA(101.6 MM) CLASS ,B,', 150, 'MTR', 400, 99], [9, 'MS PIPE 150mm,,  SIZE : EACH 6 MTRS LONG AS PER STANDARD,B Class', 90, 'MTR', 200, 85], [10, 'MS PIPE 219.1 DIA X 3.4 MM MS PIPE 219.1 DIA X 3.4 MM THICKNESS MAT:IS-1239 SIZE: EACH LENGTH 6 MTRS LONG', 60, 'MTR', 220, 85], [777, 'BasicAmount', ' ', ' ', 236812.8, 70908], [888, 'GSTValue', ' ', ' ', 42624, 12762], [999, 'total', ' ', ' ', 279439.1, 83671.44]];
        tableHeaders.unshift('Item/Vendor');
        tableHeaders.unshift('S.No');
        autoTable(doc, {
            head: [tableHeaders],
            body: z
            //  [
            //   [1, 'ABC', 'David', 'david@example.com', 'Sweden', 'david@example.com', 'Sweden', 'david@example.com', 'Sweden', 'david@example.com', 'Sweden'],
            //   [2, 'XYZ', 'Castille', 'castille@example.com', 'Spain', 'david@example.com', 'Sweden', 'david@example.com', 'Sweden', 'david@example.com', 'Sweden'],
            // ],
        });
        // doc.save('table.pdf');

        // html2canvas(this.screen.nativeElement, {scrollX: -window.scrollX}).then(canvas => {
        //   const imgSrc = canvas.toDataURL();
        //   console.log('data', canvas.toDataURL());
        //   doc.addImage(imgSrc, 'png', 10, 10, 180, 130);
        //   let width = doc.internal.pageSize.getWidth();
        //   let height = doc.internal.pageSize.getHeight();
        //   // this.downloadLink.nativeElement.href = canvas.toDataURL('image/png');
        //   // this.downloadLink.nativeElement.download = 'marble-diagram.png';
        //   // this.downloadLink.nativeElement.click();
        //   doc.save('Quote_Comparison_'+new Date().getTime().toString() + '.pdf');
        // });
    }

    itemClicked(event, item, itemHead, venHead, idx) {
        if (item.item_NA) {
            return;
        }

        if (item.pritemId === 'quotTotId123') {  // By clicking Total Amount Cell
            this.itemArray.forEach(element => {
                if (item.quotationId === element.quotationId && item.vendorId === element.vendorId && !element.item_NA) {
                    element['isActive'] = true;
                } else {
                    element['isActive'] = false;
                }
            });
        } else {  // By clicking individual Cell
            this.itemArray.forEach((element, index) => {
                if (item.id !== element.id && (item.pritemId === element.pritemId || element.pritemId === 'quotTotId123')) {
                    this.itemArray[index]['isActive'] = false;
                }

            });
            this.itemArray[idx]['isActive'] = item.isActive ? false : true;
        }
    }

    resetContainer() {
        this.vendorColHeaders = [];
        this.itemRowHeaders = [];
        this.itemArray = [];
    }

    prChange() {
        this.isPageLoad = true;
        this.resetContainer();
        this.procService.getCompareQuoteByRFQView({ 'id': this.selectedPr }).subscribe(res => {
            console.log('res', res);
            this.vendorColHeaders = res.vendorHeaders;
            const itemArray = res.totalItems; // res.totalItems;
            this.itemRowHeaders = res.itemsHeaders;

            if (Array.isArray(itemArray) && itemArray.length > 0) {
                itemArray.forEach(element => {
                    const obj = Object.assign({}, element);
                    obj['isActive'] = false;
                    this.itemArray.push(obj);
                });
            }
            this.getMinMaxValue();
            this.getQuotTotal();
        });
    }
    getGST() {
        const item_gstArray = [];
        this.vendorColHeaders.forEach((venHead, index) => {
            const obj = {};
            let basicAmount = 0;
            let itemCount = 0;
            this.itemArray.forEach(item => {
                if (item.quotationId === venHead.quotationId) {
                    itemCount = itemCount + 1;
                    // for quot total amount
                    // basicAmount=basicAmount+(item.id?item.excludetaxamount:0);
                    basicAmount = basicAmount + (item.id ? item.excludetaxamount : 0);
                    console.log('basicAmount---->' + basicAmount);
                    if (this.itemRowHeaders.length === itemCount) {
                        obj['basicAmount'] = basicAmount;
                        obj['quotationId'] = venHead.quotationId;
                        obj['vendorId'] = venHead.vendorId;
                        obj['description'] = 'BasicAmount';
                        obj['serialNo'] = '7777';
                        if (this.selectedCategoryType === 'RFQ Wise') {
                            obj['rfqitemId'] = 'quotTotId1234';
                            obj['pritemId'] = 'quotTotId1234';

                        }
                        if (this.selectedCategoryType !== 'RFQ Wise') {
                            obj['rfqitemId'] = 'quotTotId1234';
                            obj['pritemId'] = 'quotTotId1234';
                        }

                        item_gstArray.push(obj);
                    }
                }
            });

        });

        this.itemRowHeaders.push({
            'id': 'quotTotId1234',
            'description': 'BasicAmount',

        });

        if (item_gstArray.length > 0) {
            item_gstArray.forEach(element => {
                this.itemArray.push(element);
            });
        }
    }
    getGSTValue() {
        const item_gstArray1 = [];
        this.vendorColHeaders.unshift({ 'vendorName': 'uom', 'quoteId': '' });
        this.vendorColHeaders.unshift({ 'vendorName': 'qty', 'quoteId': '' });
        this.vendorColHeaders.forEach((venHead, index) => {
            const obj = {};
            let gstValues = 0;
            let itemCount = 0;
            this.itemArray.forEach(item => {
                if (item.quotationId === venHead.quotationId) {
                    itemCount = itemCount + 1;
                    // for quot total amount
                    // basicAmount=basicAmount+(item.id?item.excludetaxamount:0);
                    gstValues = gstValues + (item.id ? parseInt(item.gstValue) : 0);

                    if (this.itemRowHeaders.length === itemCount) {
                        console.log('Gstvalues--' + gstValues);
                        obj['gstValues'] = gstValues;
                        obj['quotationId'] = venHead.quotationId;
                        obj['vendorId'] = venHead.vendorId;
                        obj['description'] = 'GSTValue';
                        obj['serialNo'] = '8888';
                        if (this.selectedCategoryType === 'RFQ Wise') {
                            obj['rfqitemId'] = 'quotTotId12345';
                            obj['pritemId'] = 'quotTotId12345';
                        }
                        if (this.selectedCategoryType !== 'RFQ Wise') {
                            obj['pritemId'] = 'quotTotId12345';
                            obj['rfqitemId'] = 'quotTotId12345';
                        }


                        item_gstArray1.push(obj);
                    }
                }
            });

        });

        this.itemRowHeaders.push({
            'id': 'quotTotId12345',
            'description': 'GSTValue',

        });

        if (item_gstArray1.length > 0) {
            item_gstArray1.forEach(element => {
                this.itemArray.push(element);
            });
        }
    }
    roundTo(num: number, places: number) {
        const factor = 10 ** places;
        return Math.round(num * factor) / factor;
    }
    getQuotTotal() {
        this.getGST();
        this.getGSTValue();
        const item_totalAmountArray = [];
        this.vendorColHeaders.forEach((venHead, index) => {
            const obj = {};
            let totalamount = 0;
            let itemCount = 0;
            this.itemArray.forEach(item => {
                if (item.quotationId === venHead.quotationId) {
                    itemCount = itemCount + 1;
                    // for quot total amount
                    totalamount = this.roundTo(totalamount + (item.id ? item.totalamount : 0), 2);
                    if (this.itemRowHeaders.length === itemCount) {
                        obj['unitprice'] = totalamount;
                        obj['quotationId'] = venHead.quotationId;
                        obj['vendorId'] = venHead.vendorId;
                        obj['description'] = 'total';
                        obj['serialNo'] = '9999';
                        if (this.selectedCategoryType === 'RFQ Wise') {
                            obj['rfqitemId'] = 'quotTotId123';
                            obj['pritemId'] = 'quotTotId123';
                        }
                        if (this.selectedCategoryType !== 'RFQ Wise') {
                            obj['pritemId'] = 'quotTotId123';
                            obj['rfqitemId'] = 'quotTotId123';
                        }
                        item_totalAmountArray.push(obj);
                    }
                }
            });

        });

        this.itemRowHeaders.push({
            'id': 'quotTotId123',
            'description': 'Total',

        });

        if (item_totalAmountArray.length > 0) {
            item_totalAmountArray.forEach(element => {
                this.itemArray.push(element);
            });
        }
        console.log(this.itemArray, 'item aray....');
    }



    getMinMaxValue() {

        this.itemRowHeaders && this.itemRowHeaders.forEach(itemRowHead => {
            const itemsList = [];
            const zeroTotalItemsList = [];
            const itemsList_NA = [];
            itemRowHead['l1Value'] = null;
            this.vendorColHeaders.forEach(venHead => {
                const obj = {};
                const totalamount = 0;
                let itemCount = 0;
                this.itemArray.forEach(item => {
                    if (item.quotationId === venHead.quotationId) {
                        itemCount = itemCount + 1;
                        if (this.selectedCategoryType === 'RFQ Wise') {
                            if (item.rfqitemId === itemRowHead.id) {
                                if (item.id != null && item.totalamount > 0) {
                                    item['item_NA'] = false;
                                    itemsList.push(item);
                                } else {
                                    item['item_NA'] = true;
                                }
                            }
                        } else {
                            if (item.pritemId === itemRowHead.id) {
                                if (item.id != null && item.totalamount > 0) {
                                    item['item_NA'] = false;
                                    itemsList.push(item);
                                } else {
                                    item['item_NA'] = true;
                                }
                            }
                        }
                    }
                });

            });
            console.log(Math.min.apply(Math, itemsList.map(function (o) {
                return o.excludetaxamount;
            })
            ));

            itemRowHead['l1Value'] = Math.min.apply(Math, itemsList.map(function (o) {
                return o.unitprice;
            })
            );
        });


        console.log('itemArray', this.itemArray);
        // this.itemArray.forEach(element => {
        //  if(element['pritemId'] = 'quotTotId123'){
        //   console.log('ele1::', element)
        //  }

        // });
    }

    exportToExcel() {
        this.getCompareQuoteExcelByPR({ 'id': this.prId });
    }

    getCompareQuoteExcelByPR(req) {
        this.procService.getCompareQuoteExcelByPR(req).subscribe((res) => {
            if (res) {


                if (res && Array.isArray(res.headers)) {

                    const excelData = { items: res.items, headers: res.headers }
                    this.itemData = excelData;
                    setTimeout(() => {
                        this.excelDownload(excelData);
                    }, 2000);
                    console.log('response---' + res);
                }
            }
        });
    }
    excelDownload(res) {
        const ws: xlsx.WorkSheet =
        // xlsx.utils.table_to_sheet(res);
        xlsx.utils.table_to_sheet(this.exportTable.nativeElement);
        console.log('nativeElement--' + this.exportTable.nativeElement);
        const wb: xlsx.WorkBook = xlsx.utils.book_new();
        xlsx.utils.book_append_sheet(wb, ws, 'Sheet1');
        xlsx.writeFile(wb, 'epltable.xlsx');
      }

}

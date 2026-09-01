import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { CatProcuRequestsService } from 'src/app/layout/category-mgr/services';
import { ToastrService } from 'ngx-toastr';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { PpoCreateComponent } from '../ppo-create/ppo-create.component';
import { CreateAuctionModalComponent } from '../create-auction-modal/create-auction-modal.component';
import { ViewChild } from '@angular/core';
import { ElementRef } from '@angular/core';
import * as xlsx from 'xlsx';
import { ClientService } from 'src/app/layout/client/services/client-service.service';
import { EncryDecryService } from 'src/app/shared/services';
import { LoaderService } from '../../services/loader.service';

@Component({
    selector: 'app-quot-compare-view',
    templateUrl: './quot-compare-view.component.html',
    styleUrls: ['./quot-compare-view.component.scss']
})
export class QuotCompareViewComponent implements OnInit, OnChanges {
    selectedCategoryType : any = 'PR Wise'

    @Output() updateQuoteCompareData = new EventEmitter();
    @Input('squreFeet') squreFeet:any;
    @Input('prId') prId:any;
    @Input('isCreatePR')isCreatePR: boolean = false;
  mockResponse = {
        "vendorHeaders": [
            {
                "itemCount": "2",
                "vendorId": "570bb46e-765a-4c1f-b6b7-a6ae9df0a090",
                "vendorName": "Sony Industries PVT LTD",
                "quotationId": null,
                "quoteId": "APS240808063556-R1001-Q1001",
                "paymentTerms": "",
                "deliveryTerms": "",
                "otherTerms": ""
            },
            {
                "itemCount": "2",
                "vendorId": "d8fa49cd-a351-4adf-ac18-d670be522547",
                "vendorName": "Chaitanya LLP",
                "quotationId": null,
                "quoteId": "APS240808063556-R1001-Q1002",
                "paymentTerms": "",
                "deliveryTerms": "",
                "otherTerms": ""
            }
        ],
        "itemsHeaders": [
            {
                "id": "43cd0e53-163d-4aa9-91cd-4dc6f6f0bc95",
                "createdBy": null,
                "lastModifiedBy": null,
                "createdTS": "2024-08-08T06:37:58.000+0000",
                "lastModifiedTS": "2024-08-08T06:37:58.000+0000",
                "description": "Iron Scrap",
                "serialNo": 1,
                "brand": null,
                "quantity": 350,
                "category": "Iron Scrap",
                "itemcode": "",
                "specification": null,
                "procucevItemCode": null,
                "vendorPrice": null,
                "linkedItemId": null,
                "linkedItemStatus": false,
                "vendorName": null,
                "vendorId": null,
                "linkedItemPrice": 0,
                "unitofMeasures": "Tons",
                "estimatedItemValue": 0,
                "status": null,
                "uom": null
            },
            {
                "id": "4b76c32b-897f-4969-9d28-7032800c74b5",
                "createdBy": null,
                "lastModifiedBy": null,
                "createdTS": "2024-08-08T06:37:58.000+0000",
                "lastModifiedTS": "2024-08-08T06:37:58.000+0000",
                "description": "Steel Scrap",
                "serialNo": 2,
                "brand": null,
                "quantity": 200,
                "category": "Steel Scrap",
                "itemcode": null,
                "specification": null,
                "procucevItemCode": null,
                "vendorPrice": null,
                "linkedItemId": null,
                "linkedItemStatus": false,
                "vendorName": null,
                "vendorId": null,
                "linkedItemPrice": 0,
                "unitofMeasures": "Tons",
                "estimatedItemValue": 0,
                "status": null,
                "uom": null
            }
        ],
        "totalItems": [
            {
                "id": "318ece70-964c-4069-8543-a880a1fd81e9",
                "createdBy": null,
                "lastModifiedBy": null,
                "createdTS": "2024-08-08T08:04:57.000+0000",
                "lastModifiedTS": "2024-08-08T08:04:57.000+0000",
                "category": "Iron Scrap",
                "itemcode": "",
                "description": "Iron Scrap",
                "brand": null,
                "quantity": 350,
                "unitofMeasures": "Tons",
                "unitprice": 900,
                "totalamount": 315000,
                "excludetaxamount": 315000,
                "discountValue": 0,
                "discountType": null,
                "rfqitemId": "59ef749a-52c8-4a65-b8c3-d2d368d11c15",
                "pritemId": "43cd0e53-163d-4aa9-91cd-4dc6f6f0bc95",
                "vendorId": "d8fa49cd-a351-4adf-ac18-d670be522547",
                "cgstPercentage": null,
                "gstPercentage": "0",
                "gstValue": "0",
                "cgstValue": null,
                "sgstPercentage": null,
                "sgstValue": null,
                "serialNo": 1,
                "quotationId": null,
                "vendorName": "Chaitanya LLP"
            },
            {
                "id": "dd9313c8-dddf-412b-9548-6b929d0f3d25",
                "createdBy": null,
                "lastModifiedBy": null,
                "createdTS": "2024-08-08T08:00:09.000+0000",
                "lastModifiedTS": "2024-08-08T08:00:09.000+0000",
                "category": "Iron Scrap",
                "itemcode": "",
                "description": "Iron Scrap",
                "brand": null,
                "quantity": 350,
                "unitofMeasures": "Tons",
                "unitprice": 1000,
                "totalamount": 350000,
                "excludetaxamount": 350000,
                "discountValue": 0,
                "discountType": null,
                "rfqitemId": "59ef749a-52c8-4a65-b8c3-d2d368d11c15",
                "pritemId": "43cd0e53-163d-4aa9-91cd-4dc6f6f0bc95",
                "vendorId": "570bb46e-765a-4c1f-b6b7-a6ae9df0a090",
                "cgstPercentage": null,
                "gstPercentage": "",
                "gstValue": "0",
                "cgstValue": null,
                "sgstPercentage": null,
                "sgstValue": null,
                "serialNo": 1,
                "quotationId": "e245e8a3-5676-4077-8fe3-a4fbf4f5b268",
                "vendorName": "Sony Industries PVT LTD"
            },
            {
                "id": "8dfbe45b-6ac7-42fc-b25a-a8fca62cc84b",
                "createdBy": null,
                "lastModifiedBy": null,
                "createdTS": "2024-08-08T08:04:57.000+0000",
                "lastModifiedTS": "2024-08-08T08:04:57.000+0000",
                "category": "Steel Scrap",
                "itemcode": null,
                "description": "Steel Scrap",
                "brand": null,
                "quantity": 200,
                "unitofMeasures": "Tons",
                "unitprice": 1000,
                "totalamount": 200000,
                "excludetaxamount": 200000,
                "discountValue": 0,
                "discountType": null,
                "rfqitemId": "b56eb4bb-70fd-4bc4-a6ec-2432b2872957",
                "pritemId": "4b76c32b-897f-4969-9d28-7032800c74b5",
                "vendorId": "d8fa49cd-a351-4adf-ac18-d670be522547",
                "cgstPercentage": null,
                "gstPercentage": "0",
                "gstValue": "0",
                "cgstValue": null,
                "sgstPercentage": null,
                "sgstValue": null,
                "serialNo": 2,
                "quotationId": null,
                "vendorName": "Chaitanya LLP"
            },
            {
                "id": "c4c31913-33c6-4a3f-91ac-a0c4cb1166f1",
                "createdBy": null,
                "lastModifiedBy": null,
                "createdTS": "2024-08-08T08:00:09.000+0000",
                "lastModifiedTS": "2024-08-08T08:00:09.000+0000",
                "category": "Steel Scrap",
                "itemcode": null,
                "description": "Steel Scrap",
                "brand": null,
                "quantity": 200,
                "unitofMeasures": "Tons",
                "unitprice": 1100,
                "totalamount": 220000,
                "excludetaxamount": 220000,
                "discountValue": 0,
                "discountType": null,
                "rfqitemId": "b56eb4bb-70fd-4bc4-a6ec-2432b2872957",
                "pritemId": "4b76c32b-897f-4969-9d28-7032800c74b5",
                "vendorId": "570bb46e-765a-4c1f-b6b7-a6ae9df0a090",
                "cgstPercentage": null,
                "gstPercentage": "0",
                "gstValue": "0",
                "cgstValue": null,
                "sgstPercentage": null,
                "sgstValue": null,
                "serialNo": 2,
                "quotationId": null,
                "vendorName": "Sony Industries PVT LTD"
            }
        ]
    }
    isPageLoad: boolean;
    finalPPOData: any[] = [];
    selectedPrItem: any;
    categoryList: any = [
        'PR Wise',
        'RFQ Wise',
        'Item Wise'
    ];
    selectedRFQ;
    rfqList: any = [];
    prItemList: any = [];
    selectedPrStatus: any;
    @ViewChild('exportTable') exportTable: ElementRef;
    itemData: any;
    quoteList: Object;
    newCoustmItemArray = [];

    filteredprList: any = [];
    displayMessageTextBox: boolean;
    @Input('quoteComparisionData') quoteComparisionData:any;
    @Input('quoteItemList') quoteItemList:any = []
    vendorWiseBasicTotalArray: any =[];
    prEstimatedValue: any;
    viewPrByIdData: any;
    prSquareFeet: any = 1;
    loggedUserDetails: any;
    roleName:any;
    constructor(private modalDialog: MatDialog, private procService: CatProcuRequestsService,
        private toastrService: ToastrService,  private clientService:ClientService,
        private encryDecryService: EncryDecryService,
        private loaderService: LoaderService) { }
    selectedPr;
    prList: any[] = [];
    ngOnInit() {
        this.isPageLoad = false;
        this.displayMessageTextBox = false;
        const temp = JSON.parse(this.encryDecryService.get(localStorage.getItem('logData')));
        this.loggedUserDetails = temp.details;
        this.roleName = this.loggedUserDetails.role.roleName;
        // this.getQuoteComparison(this.mockResponse);

    }

    ngOnChanges(changes: SimpleChanges): void {
        if(changes && changes.quoteComparisionData.currentValue){
            console.log('inpu data quotcomparison', changes.quoteComparisionData)
            // this.quoteComparisionData.vendorHeaders.forEach(element => {
            //     element['quoteId'] = 'quoteId_perUnit_'+element.vendorId;
            //     const x = {...element}
            //     this.quoteComparisionData.vendorHeaders.push({...x, 'quoteId':'quoteId_perQty_'+element.vendorId})
            //     this.quoteComparisionData.totalItems.forEach((element:any) => {
            //             element['pricePerUnit'] = isNaN(element['pricePerUnit']) ? 0: parseInt(element['pricePerUnit']);
            //             element['quantity'] = isNaN(element['quantity']) ?11: parseInt(element['quantity']);
            //             // element['quantity'] = 10;
            //         });
            // });
            console.log('x', this.quoteComparisionData)
            // this.quoteComparisionData.totalItems.forEach(element => {
            //     element['pricePerUnit'] =Math.floor(Math.random() * 10001);
            //     element['quantity'] = 10;
            // });

            // const quoteCompareData = {...this.quoteComparisionData, 'vendorHeaders': vendorHeaders}
            // console.log('inpu data quotcomparison',quoteCompareData)
            if(this.prId && !this.isCreatePR ){
            this.getPRDetails();
            }else{
                this.prSquareFeet = this.squreFeet ? this.squreFeet:  this.quoteComparisionData.totalSqft;
            }
            setTimeout(() => {
                this.getQuoteComparison(this.quoteComparisionData)
            }, 500);

        }
    }

    getPRDetails(){
        const temp = {
            id: this.prId
          };
          this.clientService.getPrById(temp).subscribe((res: any) => {
            if (res) {
              this.viewPrByIdData = res;
            }
          });
          this.clientService.getSquareFeetPrById(temp).subscribe((res: any) => {
            if (res) {
              this.prSquareFeet = res;
            }
          });


    }
    getPrsList() {
        const reqObj = {
            'masterStatus': ['PC_PR_ACCEPTED']
        };
        this.procService.getPRIdsList().subscribe((res) => {
            this.prList = Array.isArray(res) ? res : [];
        });
    }

    vendorColHeaders = [];
    itemRowHeaders = [];
    itemArray = [];
    isLoadedComparison = false;
    isFullComparison = 'f';



    arrayPrepare() {
        this.itemArray.forEach(element => {

        });
    }

    itemClicked(event, item, itemHead, venHead, idx) {
    }

    resetContainer() {
        this.vendorColHeaders = [];
        this.itemRowHeaders = [];
        this.itemArray = [];
    }

    categoryChange() {
        this.selectedPr = undefined;
        this.selectedRFQ = undefined;
        this.selectedPrItem = undefined;
        this.isPageLoad = false;
    }


    getQuotData(type) {
        this.prItemList = [];
        console.log(this.selectedPr);
        const reqObj = {
            'id': this.selectedPr.id
        };
        this.procService.getLineItemsByPr(reqObj).subscribe((res) => {
            if (Array.isArray(res)) {
                this.prItemSuccessCall(res);
            }
        });
    }
    prItemSuccessCall(res) {
        // this.prItemList = res
        res.forEach(element => {
            const obj = {
                'brand': element.brand,
                'id': element.id,
                'description': element.description
            };
            this.prItemList.push(obj);

            // this.prItemList = this.prItemList.filter((el, i, a) => i === a.indexOf(el))
        });
    }

    getQuoteComparison(res) {
        const itemHeaders = res.itemsHeaders.map((res:any)=>{
            const quoteItem = this.quoteItemList.find(ele => res.itemId ==ele.linkedItemId)
            const x  ={...quoteItem}
            if(!this.isCreatePR){
                delete x['uom'];
            }
           return {...res, ...x}
        })
        itemHeaders.forEach((element:any, index:number) => {
            element['serialNo'] = index+1;
        });
        console.log('res', res);
        this.vendorColHeaders = res.vendorHeaders.filter((ele:any)=>{
            if(!ele.quoteId.split('_').includes('perQty')){
                return ele;
            }
        });
       const itemArray = res.totalItems; // res.totalItems;
        this.itemRowHeaders = itemHeaders;
        console.log('vendor headers', this.vendorColHeaders);
        console.log('itemRowHeaders', this.itemRowHeaders);

        if (Array.isArray(itemArray) && itemArray.length > 0) {
          itemArray.forEach(element => {
            const obj = Object.assign({}, element);
            obj['isActive'] = false;
            this.itemArray.push(obj);
          });
          console.log('totalItems', this.itemArray);
          // this.getCompareQuoteExcelByPR({'id': this.selectedPr});
        }
        this.getMinMaxValue();
        this.vendorColHeaders.unshift({ 'vendorName': 'uom', 'quoteId': '' });
        this.vendorColHeaders.unshift({ 'vendorName': 'qty', 'quoteId': '' });
        // this.getQuotTotal();
        this.calculateVendorBasesTotal();
        this.isPageLoad = true;
        this.isLoadedComparison = true;
        this.isFullComparison = 'f';
    }



    changeQuoteView(){
        this.loaderService.isLoading.next(true);
        setTimeout(() => {
            // this.isFullComparison = val;
            this.isLoadedComparison = true;
            this.loaderService.isLoading.next(false);
        }, 200);
    }


    getQuotTotal() {
        const item_totalAmountArray = [];


        this.vendorColHeaders.forEach((venHead) => {
            let totalAmount = 0,   basicAmount = 0, itemCount = 0;

            this.itemArray.forEach((item) => {
                if (venHead.vendorId && item.vendorId === venHead.vendorId) {
                    itemCount++;
                    basicAmount += item.id ? item.excludetaxamount : 0;
                    totalAmount += item.id ? item.totalamount : 0;

                    if (this.itemRowHeaders.length === itemCount) {
                        // Add to total array
                        item_totalAmountArray.push(
                            this.createTotalObject(venHead, 'BasicAmount', basicAmount, 'quotTotId1234')
                        );

                        item_totalAmountArray.push(
                            this.createTotalObject(venHead, 'total', totalAmount, 'quotTotId123')
                        );
                    }
                }
            });
        });

        if (item_totalAmountArray.length > 0) {
            this.itemArray.push(...item_totalAmountArray);
        }

        // this.calculateVendorBasesTotal();
    }

    createTotalObject(venHead, description, value, id) {
        const isRfq = this.selectedCategoryType === 'RFQ Wise';
        return {
            unitprice: description === 'total' ? value : undefined,
            basicAmount: description === 'BasicAmount' ? value : undefined,
            gstValues: description === 'GSTValue' ? value : undefined,
            quotationId: venHead.quotationId,
            vendorId: venHead.vendorId,
            description,
            rfqitemId: isRfq ? id : undefined,
            pritemId: isRfq ? undefined : id,
        };
    }


    calculateVendorBasesTotal(){
          // Group by id and calculate the sum of 'value'
          const result = this.itemArray.reduce((acc, item) => {
            const itemObj = this.itemRowHeaders.find((ele:any)=> item && ele.itemId == item.itemId);
            if (!acc[item.vendorId] && item) {
              acc[item.vendorId] = { id: item.vendorId, sum: 0, totalPrice: 0 };
            }
            const qty = itemObj ? Number(itemObj.quantity) : 0;
            const price = isNaN(item.pricePerUnit) ? 0 : item.pricePerUnit;
            acc[item.vendorId].sum += price;
            acc[item.vendorId].totalPrice += (price * qty);

            return acc;
          }, {});

          const groupedArray: any = Object.values(result);
          this.vendorWiseBasicTotalArray = [...groupedArray];
          this.prEstimatedValue = groupedArray.length > 0 ? Math.min(...groupedArray.map((g: any) => isNaN(g.totalPrice) ? 0 : g.totalPrice)) : 0;
          this.updateQuoteCompareData.emit({totalPrice: this.prEstimatedValue});
    }

    getVendorBasicTotal(vendor:any, columnName:string){
         const item = this.vendorWiseBasicTotalArray.find((ele:any) => vendor.vendorId && vendor.vendorId == ele.id);
         return item ? ( columnName == 'perUnit' ? item.sum : item.totalPrice  ): 0;
    }

    getVendorSquareFeetTotal(vendor:any, columnName){
        const item = this.vendorWiseBasicTotalArray.find((ele:any) => vendor.vendorId && vendor.vendorId == ele.id);
        const itemTotal = item ? (columnName == 'perUnit' ? item.sum : item.totalPrice) : 0;
        if (vendor.vendorName == 'qty' || vendor.vendorName == 'uom') {
            return vendor.vendorName == 'qty' ? this.prSquareFeet : ' ';
        }
        if (!item) return 0;
        return !vendor.quoteId.split('_').includes('perUnit') ? '' : (itemTotal / (this.prSquareFeet ? Number(this.prSquareFeet) : 1)).toFixed(1);
   }

    getMinMaxValue() {
        this.itemRowHeaders.forEach(itemRowHead => {
            const itemsList = [];
            itemRowHead['l1Value'] = null;
            this.vendorColHeaders.forEach(venHead => {
                this.itemArray.forEach(item => {
                    if (item.vendorId === venHead.vendorId) {
                        if (this.selectedCategoryType === 'RFQ Wise') {
                            if (item.rfqitemId === itemRowHead.id) {
                                const isValid = item.id != null && item.totalamount > 0;
                                item['item_NA'] = !isValid;
                                if (isValid) itemsList.push(item);
                            }
                        } else {
                            if (item.itemId === itemRowHead.itemId) {
                                const isValid = item.itemId != null && item.quantity;
                                item['item_NA'] = !isValid;
                                if (isValid) itemsList.push(item);
                            }
                        }
                    }
                });
            });
            itemRowHead['l1Value'] = Math.min.apply(Math, itemsList.map(function (o) {
                return o.unitprice;
            })
            );
        });
    }

    onCreate(actionType) {

        this.finalPPOData = [];
        let quotTotal = 0;
        let excludetax = 0;
        const selectedItems = [];
        this.itemArray.forEach(element => {

            if (element.isActive) {
                selectedItems.push(element);
                if (element.pritemId !== 'quotTotId123') {
                    excludetax += (element.excludetaxamount || 0);
                    quotTotal += (element.totalamount || 0);
                    this.finalPPOData.push(element);
                }
            }
        });

        if (selectedItems.length >= this.itemRowHeaders.length - 3) {
            for (let i = 0; i < selectedItems.length; i++) {
                if (selectedItems[i].description !== 'BasicAmount' && selectedItems[i].description !== 'GSTValue' &&
                    selectedItems[i].description !== 'total') {
                    if (!this.checkL1Selected(selectedItems[i])) {
                        this.displayMessageTextBox = true;
                        break;
                    }
                }
            }
        } else {
            this.displayMessageTextBox = true;
        }
        if (this.finalPPOData.length === 0 && actionType === 'PPO') {
            this.toastrService.warning('Please select the items & create PPO', 'Warning');
            return;
        }
        console.log('this.finalPPOData', this.finalPPOData);

        console.log('final PPO', this.finalPPOData);
        console.log('final PPO quotTotal', quotTotal);


        console.log('final PPO', this.finalPPOData);
        console.log('final PPO quotTotal', quotTotal);

        if (actionType === 'PPO') {
            setTimeout(() => {
                const ppoData = {
                    'ppoValue': quotTotal,
                    'rfq': this.selectedRFQ,
                    'prId': this.selectedPr.id,
                    'ppoitems': this.finalPPOData,
                    'prData': this.prList.filter(item => item.id === this.selectedPr.id)[0],
                    'pposVendors': this.vendorColHeaders,
                    'displayMessageTextBox': this.displayMessageTextBox
                };
                const dialog = this.modalDialog.open(PpoCreateComponent, { data: ppoData, width: '80%', height: '80%' });

                dialog.afterClosed().subscribe(result => {
                    this.displayMessageTextBox = false;
                });

            }, 100);
        }

        if (actionType === 'Auction') {
            const ppoData = {
                'ppoValue': quotTotal,
                'prId': this.selectedPr.id,
                'ppoitems': this.finalPPOData,
                'vendorsList': this.vendorColHeaders,
                'prItemsList': this.itemRowHeaders,
                'prData': this.prList.filter(item => item.id === this.selectedPr.id)[0],
                'quotCompareCategory': this.selectedCategoryType,
                'quotCompareRFQId': this.selectedRFQ,
                'rfqList': this.selectedCategoryType === 'RFQ Wise' ? this.rfqList : [],
                'isAdd': true
            };
            const config: MatDialogConfig = {
                width: '80%',
                maxWidth: 'none',
                data: ppoData
            };
            const actionDialogue = this.modalDialog.open(CreateAuctionModalComponent, config);
        }

    }

    checkL1Selected(obj) {
        for (let i = 0; i < this.itemRowHeaders.length; i++) {
            if (this.itemRowHeaders[i].description !== 'BasicAmount' && this.itemRowHeaders[i].description !== 'GSTValue' &&
                this.itemRowHeaders[i].description !== 'total' && obj.description === this.itemRowHeaders[i].description) {
                if (obj.unitprice === this.itemRowHeaders[i].l1Value) {
                    return true;
                }
            }
        }
        return false;
    }
    getCompareQuoteExcelByPR(req) {
        this.procService.getCompareQuoteExcelByPR(req).subscribe((res) => {
            if (res) {
                this.itemData = res;
                setTimeout(() => {
                    this.excelDownload(res);
                }, 2000);
                console.log('response---' + res);
            }
        });
    }
    getCompareQuoteExcelByRfq(req) {
        this.procService.getCompareQuoteExcelByRfq(req).subscribe((res) => {
            if (res) {
                this.itemData = res;
                setTimeout(() => {
                    this.excelDownload(res);
                }, 2000);
                console.log('response---' + res);
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
    exportToExcel() {
        if (this.selectedCategoryType === 'PR Wise') {
            this.getCompareQuoteExcelByPR({ 'id': this.selectedPr.id });
        } if (this.selectedCategoryType === 'RFQ Wise') {

            this.getCompareQuoteExcelByRfq({ 'id': this.selectedRFQ });
        }
    }

    exportExcelComparison(){
        const reqObj = {
            'id': this.prId ? this.prId : this.selectedPr.id
        };
        this.procService.downloadCapexQuoteComparison(reqObj).subscribe((res) => {
            this.itemData = res;
            setTimeout(() => {
                this.excelDownload(res);
            }, 2000);
        });
        // this.procService.getQuoteCompExcelJSON().subscribe((res:any)=>{
        //     console.log("excel Data", res);
        //     this.itemData = res;
        //     setTimeout(() => {
        //         this.excelDownload(res);
        //     }, 2000);

        // })
    }

    filterPr(event) {
        // in a real application, make a request to a remote url with the query and return filtered results, for demo we filter at client side
        const filtered: any[] = [];
        const query = event.query;
        for (let i = 0; i < this.prList.length; i++) {
            const prItem = this.prList[i];
            if (prItem.prId && prItem.prId.toLowerCase().includes(query.toLowerCase())) {
                filtered.push(prItem);
            }
        }
        this.filteredprList = filtered;
    }


}




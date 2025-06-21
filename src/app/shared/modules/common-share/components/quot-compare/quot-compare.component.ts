import { Component, OnInit } from '@angular/core';
import { CatProcuRequestsService } from 'src/app/layout/category-mgr/services';
import { ToastrService } from 'ngx-toastr';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { PpoCreateComponent } from '../ppo-create/ppo-create.component';
import { CreateAuctionModalComponent } from '../create-auction-modal/create-auction-modal.component';
import { ViewChild } from '@angular/core';
import { ElementRef } from '@angular/core';
import * as xlsx from 'xlsx';

@Component({
  selector: 'app-quot-compare',
  templateUrl: './quot-compare.component.html',
  styleUrls: ['./quot-compare.component.scss']
})
export class QuotCompareComponent implements OnInit {
  isPageLoad: boolean;
  finalPPOData: any[] = [];
  selectedCategoryType: any;
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
    prList_forAll: any =[];
    prList_forRFQwise: any =[];

  constructor( private modalDialog: MatDialog, private procService: CatProcuRequestsService, private toastrService: ToastrService) { }
  selectedPr;
  prList: any [] = [];
  ngOnInit() {
    this.isPageLoad = false;
    this.displayMessageTextBox = false;
    // this.arrayPrepare();
    this.getPrsListForAll();
    this.getPrsListForRFQWise();

  }

  getPrsListForAll() {
    const reqObj = {
          'masterStatus': ['PC_PR_ACCEPTED']
    };
      this.procService.getPRIdsList().subscribe((res) => {
      if (Array.isArray(res)) {
        this.prList_forAll = res || [];
      } else {
        this.prList_forAll = [];
      }

    });
  }

  getPrsListForRFQWise() {

      this.procService.getPRIdsListForRFQwise().subscribe((res) => {
      if (Array.isArray(res)) {
        this.prList_forRFQwise = res || [];
      } else {
        this.prList_forRFQwise = [];
      }

    });
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

  itemClicked(event, item, itemHead, venHead, idx) {
    if (item.item_NA) {
      return;
    }
    if (this.selectedCategoryType  === 'PR Wise' || this.selectedCategoryType === 'Item Wise') {
      if (item.pritemId === 'quotTotId123') {  // By clicking Total Amount Cell
        this.itemArray.forEach(element => {
          if (item.quotationId === element.quotationId  && item.vendorId === element.vendorId && !element.item_NA) {
            element['isActive'] = true;
          } else {
            element['isActive'] = false;
          }
        });
      } else {  // By clicking individual Cell
        this.itemArray.forEach((element, index) => {
          if (item.id !== element.id  &&  (item.pritemId === element.pritemId || element.pritemId === 'quotTotId123')) {
            this.itemArray[index]['isActive'] = false;
          }

      });
      this.itemArray[idx]['isActive'] = item.isActive ? false : true;
      }
    } else {
      if (item.rfqitemId === 'quotTotId123') {  // By clicking Total Amount Cell
        this.itemArray.forEach(element => {
          if (item.quotationId === element.quotationId  && item.vendorId === element.vendorId && !element.item_NA) {
            element['isActive'] = true;
          } else {
            element['isActive'] = false;
          }
        });
      } else {  // By clicking individual Cell
        this.itemArray.forEach((element, index) => {
          if (item.id !== element.id  &&  (item.pritemId === element.pritemId || element.rfqitemId === 'quotTotId123')) {
            this.itemArray[index]['isActive'] = false;
          }

      });
      this.itemArray[idx]['isActive'] = item.isActive ? false : true;
      }
    }

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
      if(this.selectedCategoryType == 'RFQ Wise'){
        this.prList = this.prList_forRFQwise
      }else{
        this.prList = this.prList_forAll;
      }
  }

  prChange(event) {
    console.log(event);
    this.selectedRFQ = null;
    console.log('selectedCategoryType', this.selectedCategoryType);
    this.prList.forEach(ele => {
      if (this.selectedPr.id === ele.id) {
        this.selectedPrStatus = ele.Status;
      }
    });

    this.resetContainer();
        if (this.selectedCategoryType === 'PR Wise') {
          this.isPageLoad = true;
      this.procService.getCompareQuoteByPR({'id': this.selectedPr.id}).subscribe(res => {
        console.log('res', res);
        if(res.vendorHeaders && Array.isArray(res.vendorHeaders)){
            if(res.vendorHeaders && Array.isArray(res.vendorHeaders)){

                this.vendorColHeaders= res.vendorHeaders;

            }
        }
       const itemArray = res.totalItems; // res.totalItems;
        this.itemRowHeaders = res.itemsHeaders;

        if (Array.isArray(itemArray) && itemArray.length > 0) {
          itemArray.forEach(element => {
            const obj = Object.assign({}, element);
            obj['isActive'] = false;
            this.itemArray.push(obj);
          });

          // this.getCompareQuoteExcelByPR({'id': this.selectedPr});
        }
        this.getMinMaxValue();
        this.getQuotTotal();
      });
    }
    if (this.selectedCategoryType === 'Item Wise') {
      this.getQuotData('PR Wise');
    }
    if (this.selectedCategoryType === 'RFQ Wise') {
      this.procService.getRFQByPRId({'id': this.selectedPr.id}).subscribe((res) => {
        if (Array.isArray(res)) {
          this.rfqList = res || [];

        }
      });
    }

  }

  convertUTCToIST(utcDateString) {
    // Parse the UTC date string into a Date object
    const utcDate = new Date(utcDateString);

    // IST is UTC + 5 hours 30 minutes
    const istOffset = 5.5 * 60 * 60 * 1000; // Offset in milliseconds

    // Convert UTC to IST
    const istDate = new Date(utcDate.getTime() + istOffset);

    return istDate;
}
  getQuotData(type) {
    this.prItemList = [];
    console.log(this.selectedPr);
    const reqObj = {
      'id' : this.selectedPr.id
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
          'brand' : element.brand,
          'id' : element.id,
          'description': element.description
        };
        this.prItemList.push(obj);

        // this.prItemList = this.prItemList.filter((el, i, a) => i === a.indexOf(el))
      });
    }

  prItemChange(type) {
    this.isPageLoad = false;
    this.vendorColHeaders = [];
    this.itemRowHeaders = [];
    this.itemArray = [];
    if (type === 'Item Wise') {

      this.procService.getCompareQuoteByPR({'id': this.selectedPr.id}).subscribe(async res => {
        console.log('res', res);

        if(res.vendorHeaders && Array.isArray(res.vendorHeaders)){

                    this.vendorColHeaders= res.vendorHeaders;

        }

       const itemArray = res.totalItems; // res.totalItems;
       res.itemsHeaders.forEach(element => {
        if (element.id === this.selectedPrItem) {
          // element['tempDesc']= element.description.split(' ')[0];
        this.itemRowHeaders.push(element);
        }
      });


        if (Array.isArray(itemArray) && itemArray.length > 0) {
          itemArray.forEach(element => {
            if (element.pritemId === this.selectedPrItem) {
            const obj = Object.assign({}, element);
            obj['isActive'] = false;
            this.itemArray.push(obj);
            }
          });
        }
        this.getMinMaxValue();
        this.getQuotTotal();
      });

    }
    if (type === 'RFQ Wise') {
      if(!this.selectedRFQ){
        this.isPageLoad = false;
      }
      this.procService.getCompareQuoteByRFQ({id: this.selectedRFQ}).subscribe(async(res:any) => {
        console.log('res', res);
       await this.pushVendorsHeader(res);
       const itemArray = res.totalItems; // res.totalItems;
        this.itemRowHeaders = res.itemsHeaders;

        if (Array.isArray(itemArray) && itemArray.length > 0) {
          itemArray.forEach((element, index) => {
            let obj = Object.assign({}, element);
            obj['isActive'] = false;

            this.itemArray.push(obj);

          });
         // this.getCompareQuoteExcelByRfq({'id':this.selectedRFQ})
        }
        this.getMinMaxValue();
        this.getQuotTotal();
      });

    }


  }

  async pushVendorsHeader(res){
    if(res.vendorHeaders && Array.isArray(res.vendorHeaders)){
        if(res.vendorHeaders && Array.isArray(res.vendorHeaders)){
            this.vendorColHeaders= res.vendorHeaders;
         }
    }
  }

  // getQuotData(type) {
  //   // compareQuoteByRfq
  //   this.resetContainer();
  //   if (type === 'PR Wise') {

  //     this.procService.getCompareQuoteByPR({'id': this.selectedPr}).subscribe(res => {
  //       console.log('res', res);
  //       this.vendorColHeaders = res.vendorHeaders;
  //      const itemArray = res.totalItems; // res.totalItems;
  //       this.itemRowHeaders = res.itemsHeaders;

  //       if (Array.isArray(itemArray) && itemArray.length > 0) {
  //         itemArray.forEach(element => {
  //           const obj = Object.assign({}, element);
  //           obj['isActive'] = false;
  //           this.itemArray.push(obj);
  //         });
  //       }
  //       this.getMinMaxValue();
  //       this.getQuotTotal();
  //     });
  //   }
  //   if (type === 'RFQ Wise') {
  //     this.procService.getCompareQuoteByRFQ({'id': this.selectedRFQ}).subscribe(res => {
  //       console.log('res', res);
  //       this.vendorColHeaders = res.vendorHeaders;
  //      const itemArray = res.totalItems; // res.totalItems;
  //       this.itemRowHeaders = res.itemsHeaders;

  //       if (Array.isArray(itemArray) && itemArray.length > 0) {
  //         itemArray.forEach(element => {
  //           const obj = Object.assign({}, element);
  //           obj['isActive'] = false;
  //           this.itemArray.push(obj);
  //         });
  //       }
  //       this.getMinMaxValue();
  //       this.getQuotTotal();
  //     });
  //   }

  // }
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
            if (this.selectedCategoryType === 'RFQ Wise') {
              obj['rfqitemId'] = 'quotTotId1234';
            }
            if (this.selectedCategoryType !== 'RFQ Wise') {
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
    this.vendorColHeaders.forEach((venHead, index) => {
      const obj = {};
      let gstValues = 0;
      let itemCount = 0;
      this.itemArray.forEach(item => {
      if (item.quotationId === venHead.quotationId) {
        itemCount = itemCount + 1;
       // for quot total amount
       // basicAmount=basicAmount+(item.id?item.excludetaxamount:0);
       gstValues = gstValues + (item.id ? parseFloat(item.gstValue) : 0);

          if (this.itemRowHeaders.length === itemCount) {
            console.log('Gstvalues--' + gstValues);
            obj['gstValues'] = gstValues;
            obj['quotationId'] = venHead.quotationId;
            obj['vendorId'] = venHead.vendorId;
            obj['description'] = 'GSTValue';
            if (this.selectedCategoryType === 'RFQ Wise') {
              obj['rfqitemId'] = 'quotTotId12345';
            }
            if (this.selectedCategoryType !== 'RFQ Wise') {
              obj['pritemId'] = 'quotTotId12345';
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
  getModifiedQuotTotal() {
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

          totalamount = totalamount + (item.id ? item.totalamount : 0);
          if (this.itemRowHeaders.length === itemCount) {
            obj['unitprice'] = totalamount;
            obj['quotationId'] = venHead.quotationId;
            obj['vendorId'] = venHead.vendorId;
            obj['description'] = 'total';
            if (this.selectedCategoryType === 'RFQ Wise') {
              obj['rfqitemId'] = 'quotTotId123';
            }
            if (this.selectedCategoryType !== 'RFQ Wise') {
              obj['pritemId'] = 'quotTotId123';
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
  console.log(this.itemArray);

  }

  getQuotTotal() {
    // this.getGST();
    // this.getGSTValue();
    const item_totalAmountArray = [];



    this.vendorColHeaders.unshift({'vendorName': 'uom', 'quoteId': ''});
    this.vendorColHeaders.unshift({'vendorName': 'qty', 'quoteId': ''});
    this.vendorColHeaders.forEach((venHead, index) => {
      const obj = {};
      const objGst = {};
      const objBasicAmnt = {};
      let totalamount = 0;
      let gstValues = 0;
      let basicAmount = 0;
      let itemCount = 0;
      this.itemArray.forEach(item => {
      if (item.quotationId === venHead.quotationId) {
        itemCount = itemCount + 1;
       // for quot total amount
          basicAmount = basicAmount + (item.id ? item.excludetaxamount : 0);
          gstValues = gstValues + (item.id ? parseFloat(item.gstValue) : 0);
          totalamount = totalamount + (item.id ? item.totalamount : 0);

          if (this.itemRowHeaders.length === itemCount) {

            // basic amount
            objBasicAmnt['basicAmount'] = basicAmount;
            objBasicAmnt['quotationId'] = venHead.quotationId;
            objBasicAmnt['vendorId'] = venHead.vendorId;
            objBasicAmnt['description'] = 'BasicAmount';
            if (this.selectedCategoryType === 'RFQ Wise') {
              objBasicAmnt['rfqitemId'] = 'quotTotId1234';
            }
            if (this.selectedCategoryType !== 'RFQ Wise') {
              objBasicAmnt['pritemId'] = 'quotTotId1234';
            }
            item_totalAmountArray.push(objBasicAmnt);

            // gst
            console.log('Gstvalues--' + gstValues);
            objGst['gstValues'] = gstValues;
            objGst['quotationId'] = venHead.quotationId;
            objGst['vendorId'] = venHead.vendorId;
            objGst['description'] = 'GSTValue';
            if (this.selectedCategoryType === 'RFQ Wise') {
              objGst['rfqitemId'] = 'quotTotId12345';
            }
            if (this.selectedCategoryType !== 'RFQ Wise') {
              objGst['pritemId'] = 'quotTotId12345';
            }
            item_totalAmountArray.push(objGst);

            // total amount
            obj['unitprice'] = totalamount;
            obj['quotationId'] = venHead.quotationId;
            obj['vendorId'] = venHead.vendorId;
            obj['description'] = 'total';
            if (this.selectedCategoryType === 'RFQ Wise') {
              obj['rfqitemId'] = 'quotTotId123';
            }
            if (this.selectedCategoryType !== 'RFQ Wise') {
              obj['pritemId'] = 'quotTotId123';
            }

            item_totalAmountArray.push(obj);
          }
      }
    });
    setTimeout(() => {
        this.isPageLoad = true;
      }, 500);

  });


  this.itemRowHeaders.push({
    'id': 'quotTotId1234',
    'description': 'BasicAmount',

  });

  this.itemRowHeaders.push({
    'id': 'quotTotId12345',
    'description': 'GSTValue',

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
  console.log(this.itemArray);
  console.log("Current Date", new Date())
  this.vendorColHeaders.forEach((ele:any)=>{
    if(!(['qty','uom'].includes(ele.vendorName)))
    console.log("vendor Name, converted Date", ele.vendorName, this.convertUTCToIST(ele.vendorResponseDate));
    console.log("--------------------")
  })
  }

  getMinMaxValue() {
    if(Array.isArray(this.itemRowHeaders)){
    this.itemRowHeaders.forEach(itemRowHead => {
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
      itemRowHead['l1Value'] =  Math.min.apply(Math, itemsList.map(function(o) {
         return o.unitprice; })
        );
    });


    console.log('itemArray', this.itemArray);
    // this.itemArray.forEach(element => {
    //  if(element['pritemId'] = 'quotTotId123'){
    //   console.log('ele1::', element)
    //  }

    // });
}
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
          excludetax = excludetax + (element.id ? element.excludetaxamount : 0);
          quotTotal = quotTotal + (element.id ? element.totalamount : 0);
          this.finalPPOData.push(element);
        }
      }
    // console.log('items array '+this.itemArray)
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
          'prData': this.prList.filter(item => item.id  === this.selectedPr.id)[0],
          'pposVendors': this.vendorColHeaders,
          'displayMessageTextBox': this.displayMessageTextBox
        };
        const dialog =  this.modalDialog.open(PpoCreateComponent, { data: ppoData, width: '80%', height: '80%' });

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
        'prData': this.prList.filter(item => item.id  === this.selectedPr.id)[0],
        'quotCompareCategory': this.selectedCategoryType,
        'quotCompareRFQId': this.selectedRFQ,
        'rfqList': this.selectedCategoryType === 'RFQ Wise' ? this.rfqList : [],
        'isAdd': true
      };
      const  config: MatDialogConfig = {
        width: '80%',
        maxWidth: 'none',
        data : ppoData
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


            if(res && Array.isArray(res.headers) ){

                const excelData = {items: res.items, headers: res.headers}
                this.itemData = excelData;
                setTimeout(() => {
                    this.excelDownload(excelData);
                  }, 2000);
                  console.log('response---' + res);
                }
            }
    });
}
getCompareQuoteExcelByRfq(req) {
  this.procService.getCompareQuoteExcelByRfq(req).subscribe((res) => {
    if (res) {


    if(res && Array.isArray(res.headers) ){

        const excelData = {items: res.items, headers:res.headers}
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
  exportToExcel() {
  if (this.selectedCategoryType === 'PR Wise') {
    this.getCompareQuoteExcelByPR({'id': this.selectedPr.id});
  }  if (this.selectedCategoryType  === 'RFQ Wise') {

    this.getCompareQuoteExcelByRfq({'id': this.selectedRFQ});
  }
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




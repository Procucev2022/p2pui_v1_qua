import { Component, OnInit, Input, OnChanges, SimpleChange, SimpleChanges } from '@angular/core';
import { AppConfig } from 'src/app/app.config';
import { ConvertToBase64Service } from '../../../services/convert-to-base64.service';

import { NgForm } from '@angular/forms';
import { CatProcuRequestsService } from 'src/app/layout/category-mgr/services';
import { ToastrService } from 'ngx-toastr';
import { MatDialog } from '@angular/material/dialog';
import { AuctionService } from 'src/app/layout/category-mgr/services/auction.service';

@Component({
  selector: 'app-create-rar-auction',
  templateUrl: './create-rar-auction.component.html',
  styleUrls: ['./create-rar-auction.component.scss']
})
export class CreateRarAuctionComponent implements OnInit , OnChanges{
  pageRecordSize: any;
  pageOptions: any;
  templeftGrid_vendorData: any;
  rightSelected_vendorRows: any[];
  rfqList: any;
  leftGrid_itemsData: any[];
  commentNotInvited: any;


  constructor(private convertSer: ConvertToBase64Service, private auctionService: AuctionService, private procService: CatProcuRequestsService, private toastr: ToastrService, private modal: MatDialog) { }
  @Input('vendorData')vendorData: any;
   @Input('prItemsData')prItemsData: any;
   @Input('ppoItems') ppoItems: any;
   @Input('ppoData') ppoData: any;

  selectedAuction;

  minimumBidReductionToVendor = false;
  bidsLimitForVendor = false;
  minMaxValues = {
    min: 1,
    max: 10
  };

  bidExtendTime;
  bidLimit;
  auctionExtendedLimit;
  prData: any;

  selectedVendorsList: any = [];

  // variable declarations
  displaySelectedPrId;
  selectedPrId;
  selectedRFQ;
  auctionName;
  auctionCategory;
  auctionType;
  auctionStartDate;
  auctionEndDate;
  extendBefore;
  auctionRunningTime: any;
  attachments: any = [];
  auctionFileType: any;
  auctionFileData: string;
  termsAndConditions;
  scrollingText;
  pageRefreshInterval;
  currencyTypes: any = [
    'INR',
    'Dollar'
  ];
  currencyType = 'INR';
  conductAuctionForSingleOrWhole = false;
  startPrice = false;
  bigAgainstOn = true;
  showLeadingPriceToVendor = false;
  minimumBidReduction = false;
  minimumBidReductionPrice;
  providePostBidPrice = false;
  autoExtendforAuction = false;
  auctionExtendBefore: any;
  clientInvitation = false;
  auctionAutoExtendedLimit: any;
  leftGrid_vendorData: any  = [];
  rightGrid_vendorData: any = [];
  rightgridSelected_vendorRows: any = [];
  leftSelected_vendorRows: any = [];
  selectedItems = [];
  startpricevalue;
  leadingPrice;

  leftTable_vendorHeaders = [
    { header: 'ID', 'field': 'companyId', isLink: false },
    { header: 'Vendor Name', 'field': 'companyName', isLink: true }
  ];

  rightTable_vendorHeaders = [
    { header: 'ID', 'field': 'companyId', isLink: false },
    { header: 'Vendor Name', 'field': 'companyName', isLink: true }
  ];

  itemHeader: any = [
    { field: 'description', header: 'Description'  , isLink: false, fieldType: 'label', width: '166px'},
    { field: 'brand', header: 'Brand'  , isLink: false, fieldType: 'label', width: '166px'},
    { field: 'unitofMeasures', header: 'Unit Of Measure'  , isLink: false, fieldType: 'label', width: '166px'},
    { field: 'quantity', header: 'Quantity'  , isLink: false, fieldType: 'label', width: '166px'},
    // { field: 'totalamount', header: 'Total Amount'  , isLink: false, fieldType: 'label', width: '166px'},
    // { field: 'minBidPrice', header: 'Min Bid Price'  , isLink: false},

  ];

  auctionItemsList: any = [];

  paginatoryDetails: any;
  ppoItemspaginatoryDetails: any;
  public min = new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate(), new Date().getHours(), new Date().getMinutes());


  ngOnInit() {
    console.log("capex auction", this.ppoData)
    this.selectedPrId = this.ppoData.prId;
    this.displaySelectedPrId = this.ppoData.prData.prId;
    if (this.ppoData.quotCompareCategory === 'RFQ Wise') {
      this.rfqList = this.ppoData.rfqList || [];
    } else {
      if(!this.ppoData.isCapex){
        this.procService.getRFQByPRId({'id': this.selectedPrId}).subscribe((res) => {
            if (Array.isArray(res)) {
              this.rfqList = res || [];
            }
          });
      }else{
        this.selectedPrId = this.ppoData.prData.id;
      }

    }
    this.pageRecordSize = AppConfig.GRID_PAGE_INFO.initpageSize;
    this.pageOptions = AppConfig.GRID_PAGE_INFO.pageOptions;
    // this.ppoItems.forEach(element => {
    //   element['minBidPrice'] = element.totalamount;
    // });
  }

  ngOnChanges(changes: SimpleChanges){
    if(this.ppoData.isCapex  == true){
        this.auctionCategory = 'rfq total wise';
        this.buildCapexVendors();

    }

  }

  buildCapexVendors(){
    const response:any = this.procService.getVendorsListByCapex();
    if (Array.isArray(response)) {
        const vendorsList = response  || [];
        this.leftGrid_vendorData = vendorsList.filter((item, i, arr) => {
          return arr.indexOf(arr.find(t => t.id === item.id)) === i;
        }) || [];
        this.leftGrid_vendorData.forEach(element => {
          element['invited'] = false;
        });
        console.log('vendor list', this.leftGrid_vendorData);
    } else {
        this.leftGrid_vendorData = [];
    }

    this.procService.getLineItemsByPr({id:  this.ppoData.prData.id }).subscribe((response) => {
        if (Array.isArray(response)) {
            this.auctionItemsList = response  || [];
        } else {
            this.auctionItemsList = [];
        }
      });
  }

  createAuction(auctionForm: NgForm) {
    console.log('auctionForm', auctionForm);
    if (auctionForm.valid) {
      this.buildAcutionData();
    } else {
     this.toastr.warning('Please enter required fileds', 'Warning');
    }





  }

  buildAcutionData() {
    const itemsList = [];
    if (this.rightGrid_vendorData.length === 0) {
      this.toastr.warning('Please select atleast one vendor for auction', 'Warning');
      return;
    }

    if (this.leftGrid_vendorData.length > 0) {
      this.leftGrid_vendorData.forEach(element => {
        element['acceptedTermsAndCondition'] = this.termsAndConditions;
        element['commentNotInvited'] = this.commentNotInvited;
        const obj = {
          'id': element['id']
        };
        const obj1 = {
          'id': element['quotationId']
        };
        element['quotation'] = obj1;
        element['vendor'] = obj;
        delete element.id;
        delete element.quotationId;
      });
    }

    if (this.rightGrid_vendorData.length > 0) {
      this.rightGrid_vendorData.forEach(element => {
        element['acceptedTermsAndCondition'] = this.termsAndConditions;
        element['commentNotInvited'] = this.commentNotInvited;
        const obj = {
          'id': element['id']
        };
        const obj1 = {
          'id': element['quotationId']
        };
        element['quotation'] = obj1;
        element['vendor'] = obj;
        if(this.ppoData.isCapex){
            element['quotation'] = null;
        }
        delete element.id;
        delete element.quotationId;
      });
    }

    const vendorList  = [...this.leftGrid_vendorData, ...this.rightGrid_vendorData];

    const emptyStartPriceItemsList = [];
    if (this.auctionCategory === 'rfq total wise' || this.auctionCategory === 'item wise') {
      if (this.auctionItemsList.length > 0) {
        this.auctionItemsList.forEach(element => {
          const obj = {
            id: element['id']
          };
          if(this.ppoData.isCapex){
            element['rfqitemid'] =  null;
            element['pritemId'] =  obj;
          }else{
            element['rfqitemid'] =  obj;
          }
          if (this.startPrice) {
            if (element['startpricevalue'] == null || element['startpricevalue'] === '' || element['startpricevalue'] === 0  ) {
              emptyStartPriceItemsList.push(element);
            }
          }
          delete element.id;
          itemsList.push(element);
        });
      } else {
        this.toastr.warning('No Items Available for Auction, Unable to create Auction', 'Warning');
        return;
      }
    }

   if (emptyStartPriceItemsList.length > 0 && this.auctionCategory === 'item wise') {
    this.toastr.warning('Please enter Start Price for all Items', 'Warning');
    return;
   }

    // if (this.auctionCategory === 'item wise') {
    //   if (this.selectedItems.length > 0) {
    //     this.selectedItems.forEach(element => {
    //       const obj = {
    //         id: element.id
    //       };
    //       element['rfqitemid'] =  obj;
    //       delete element.id;
    //       itemsList.push(element);
    //     });
    //   } else {
    //     this.toastr.warning('Please Select atleast one item for auction', 'Warning');
    //     return;
    //   }
    // }
    setTimeout(()=>{
        this.createAuctionForCPXandOPEX(itemsList, vendorList);
    }, 1000)


  }


  createAuctionForCPXandOPEX(itemsList, vendorList){
    const finalObj = {
        'auctionName': this.auctionName,
        'auctionCategory': this.auctionCategory,
        'auctionType': this.auctionType,
        'auctionStarttime': this.auctionStartDate,
        'auctionEndtime': this.auctionEndDate,
        'scrollingText': this.scrollingText,
        'pageRefrestInterval': this.pageRefreshInterval,
        'currencyType': this.currencyType,
        'conductAuctionForSingleOrWhole': this.conductAuctionForSingleOrWhole,
        'bidAgainstOn': this.bigAgainstOn,  // true -> Leading Price, false -> Own Price
        'minimumBidReduction': this.minimumBidReduction,
        'minimumBidReductionPrice': this.minimumBidReductionPrice,
        'termsAndConditions': this.termsAndConditions,
        'client': {
          'id': this.ppoData.prData.orgId
        },
        'categoryManager': {
          'id': localStorage.getItem('orgId')
        },
        'pr': {
          id: this.selectedPrId
        },
        'rfq': this.ppoData.isCapex ? null: {
          id: this.selectedRFQ
        },
        'auctionItems': itemsList,
        'auctionVendors': vendorList,

        'startPrice': this.startPrice,
        'startpricevalue': this.startpricevalue,
        'bigAgainstOn': this.bigAgainstOn ,
        'showLeadingPriceToVendor': this.showLeadingPriceToVendor,

        'providePostBidPrice': this.providePostBidPrice,
        'autoExtendforAuction': this.autoExtendforAuction,
        'auctionExtendBefore': this.auctionExtendBefore,
        'extendBefore': this.extendBefore,
        'bidsLimitForVendor': this.bidsLimitForVendor,
        'bidLimit': this.bidLimit,
        'bidExtendTime': this.bidExtendTime,
        'clientInvitation': this.clientInvitation,
        'attachments': this.attachments,
        'createdBy': localStorage.getItem('userFullName')
      };
      console.log('Lgrideft  data--'+  vendorList)

      vendorList.forEach(item=>{
        if (item.invited === true){
          item.commentNotInvited = ""
        }

      });
      console.log('json obj', finalObj);
      if(this.ppoData.isCapex){
          this.auctionService.createAuctionForCapex(finalObj).subscribe((response) => {
              if (response['status'] === 'Success'  || response['statusCode'] === '200') {
                this.toastr.success(response['message'], 'Success');
                this.modal.closeAll();
              } else {
                this.toastr.error('Auction Creation Failed', 'Failed');
              }
            });
      }else{
          this.auctionService.createAuction(finalObj).subscribe((response) => {
              if (response['status'] === 'Success'  || response['statusCode'] === '200') {
                this.toastr.success(response['message'], 'Success');
                this.modal.closeAll();
              } else {
                this.toastr.error('Auction Creation Failed', 'Failed');
              }
            });
      }

  }



  filesDropped(event) {
    const fileData = event;
    console.log('event', event);
    const file = event[0];
    this.convertSer.getBase64(file).then((data: string) => {
      const temp = {
        fileName: file.name,
        file: data.split(',')[1]
      };
      this.attachments.push(temp);
    });

  }

  fileUploadEvent(event, isDropped) {
    const fileData = event;
    console.log('event1', event);
    const file =  event.target.files[0];
    this.convertSer.getBase64(file).then((data: string) => {

      const temp = {
        fileName: file.name,
        file: data.split(',')[1]
      };

      // For Single files upload
      this.auctionFileData = data.split(',')[1];
      this.auctionFileType  = file.name;

      // For Muliple files upload
      this.attachments.push(temp);
    });
  }

  deleteAttachments(index) {
      this.attachments.splice(index, 1);
  }

  removeFile() {
    this.auctionFileData =  null;
    this.auctionFileType = null;
  }


  vendorAddEvents(btnType) {
    // console.log('leftSelected_vendorRows', this.leftSelected_vendorRows);
    switch (btnType) {
        case 'Add':
            const sourceList = this.leftSelected_vendorRows || [];
            if (sourceList.length > 0) {
                sourceList.forEach((element) => {
                    element['invited'] = true;
                    this.rightGrid_vendorData.push(element);
                });
                sourceList.forEach((element) => {
                    const ind = this.leftGrid_vendorData.findIndex(
                        (item) => item.id === element.id
                    );
                    this.leftGrid_vendorData.splice(ind, 1);
                });
                this.leftSelected_vendorRows = [];
                this.rightSelected_vendorRows = [];
            }
            break;
        case 'Add All':
            this.rightGrid_vendorData = [];
            this.templeftGrid_vendorData.forEach(element => {
              element['invited'] = true;
              this.rightGrid_vendorData.push(element);
            });
            // this.rightGrid_vendorData = this.templeftGrid_vendorData.slice(0);
            this.leftGrid_vendorData = [];
            this.leftSelected_vendorRows = [];
            this.rightSelected_vendorRows = [];
            break;
        case 'Remove':
            const rightGridList = this.rightSelected_vendorRows || [];
            if (rightGridList.length > 0) {
                rightGridList.forEach((element) => {
                  element['invited'] = false;
                    this.leftGrid_vendorData.push(element);
                });
                rightGridList.forEach((element) => {
                    const ind = this.rightGrid_vendorData.findIndex(
                        (item) => item.id === element.id
                    );
                    this.rightGrid_vendorData.splice(ind, 1);
                });
                this.leftSelected_vendorRows = [];
                this.rightSelected_vendorRows = [];
            }
            break;
        case 'Remove All':
            this.leftGrid_vendorData = [];
            this.rightGrid_vendorData = [];
            this.leftSelected_vendorRows = [];
            this.rightSelected_vendorRows = [];
            // this.leftGrid_vendorData = this.templeftGrid_vendorData.slice(0);
            this.templeftGrid_vendorData.forEach((element) => {
              element['invited'] = false;
              this.leftGrid_vendorData.push(element);
          });
            this.templeftGrid_vendorData = [];
            this.templeftGrid_vendorData = this.leftGrid_vendorData.slice(0);
            break;
        default:
    }
}

onAuctionTypeChange() {
 console.log('type', this.auctionType);
}

onCategoryChange() {
  console.log('category', this.auctionCategory, this.startPrice);
  if (this.auctionCategory === 'item wise') {
    const startPrice_index = this.itemHeader.map(function(o) { return o.field; }).indexOf('startpricevalue');
    const leadingPrice_index = this.itemHeader.map(function(o) { return o.field; }).indexOf('leadingPrice');

    if (this.startPrice && startPrice_index < 0) {
      this.itemHeader.push({ field: 'startpricevalue', header: 'Start Price'  , isLink: false, fieldType: 'text', width: '166px'});
    } else {
      if (!this.startPrice && startPrice_index > -1) {
        this.itemHeader.splice(startPrice_index, 1);
      }
    }

    // if (this.showLeadingPriceToVendor && leadingPrice_index < 0) {
    //   this.itemHeader.push({ field: 'leadingPrice', header: 'Leading Price'  , isLink: false, fieldType: 'text', width: '166px'});
    // } else {
    //   if (!this.showLeadingPriceToVendor && startPrice_index > -1) {
    //     this.itemHeader.splice(leadingPrice_index, 1);
    //   }
    // }

    const minBidReductionPrice_index = this.itemHeader.map(function(o) { return o.field; }).indexOf('minimumBidReductionPrice');
    if (this.minimumBidReduction && minBidReductionPrice_index < 0) {
      this.itemHeader.push({ field: 'minimumBidReductionPrice', header: 'Min. Bid Reduction Price'  , isLink: false, fieldType: 'text', width: '166px'});
    } else {
      if (!this.minimumBidReduction && minBidReductionPrice_index > -1) {
        this.itemHeader.splice(minBidReductionPrice_index, 1);
      }
    }
  } else {
      this.itemHeader = [];
      this.itemHeader = [
        { field: 'description', header: 'Description'  , isLink: false, fieldType: 'label'},
        { field: 'brand', header: 'Brand'  , isLink: false, fieldType: 'label'},
        { field: 'unitofMeasures', header: 'Unit Of Measure'  , isLink: false, fieldType: 'label'},
        { field: 'quantity', header: 'Quantity'  , isLink: false, fieldType: 'label'},
        { field: 'totalamount', header: 'Total Amount'  , isLink: false, fieldType: 'label'},
      ];
  }


}

onRFQChange() {
  this.auctionItemsList = [];
  this.leftGrid_vendorData = [];
  this.rightGrid_vendorData = [];
  this.auctionService.getItemsByRFQ({id: this.selectedRFQ}).subscribe((response) => {
    if (Array.isArray(response)) {
        this.auctionItemsList = response  || [];
    } else {
        this.auctionItemsList = [];
    }
  });

  this.auctionService.getQuoteVendorsByRFQ({id: this.selectedRFQ}).subscribe((response) => {
    let vendorsList = [];
    if (Array.isArray(response)) {
        vendorsList = response  || [];
        this.leftGrid_vendorData = vendorsList.filter((item, i, arr) => {
          return arr.indexOf(arr.find(t => t.id === item.id)) === i;
        }) || [];
        this.leftGrid_vendorData.forEach(element => {
          element['invited'] = false;
        });
        console.log('vendor list', this.leftGrid_vendorData);
    } else {
        this.leftGrid_vendorData = [];
    }
  });
}


}

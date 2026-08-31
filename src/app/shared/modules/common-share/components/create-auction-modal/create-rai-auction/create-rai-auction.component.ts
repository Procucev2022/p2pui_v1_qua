import { Component, OnInit, Input } from '@angular/core';
import { ConvertToBase64Service } from '../../../services/convert-to-base64.service';
import { CatProcuRequestsService } from 'src/app/layout/category-mgr/services';
import { ToastrService } from 'ngx-toastr';
import { MatDialog } from '@angular/material/dialog';
import { AppConfig } from 'src/app/app.config';
import { NgForm } from '@angular/forms';
import { AppApiConfig } from 'src/app/shared/constants/app-api.config';
import { EncryDecryService } from 'src/app/shared/services';
import { AuctionService } from 'src/app/layout/category-mgr/services/auction.service';

@Component({
  selector: 'app-create-rai-auction',
  templateUrl: './create-rai-auction.component.html',
  styleUrls: ['./create-rai-auction.component.scss']
})
export class CreateRaiAuctionComponent implements OnInit {
  pageRecordSize: any;
  pageOptions: any;
  templeftGrid_vendorData: any;
  rightSelected_vendorRows: any[];
  rfqList: any;
  leftGrid_itemsData: any[];
  commentNotInvited: any;
  auctionData: any;
  createdBy: any;
  isEditAuction: boolean;
  startpricevalue;
  loggedUserData: any;
  isStartDateExpired: boolean;
  isEndDateExpired: boolean;
  extendBefore;


  constructor(private convertSer: ConvertToBase64Service, private auctionService: AuctionService, private procService: CatProcuRequestsService, private toastr: ToastrService, private modal: MatDialog, private encryDecryService: EncryDecryService) { }
  @Input('rowData') rowData: any;

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
  bidAgainstOn = true;
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
  loggedUserPermissions;
  defaultPermissions;

  leftTable_vendorHeaders = [
    { header: 'ID', 'field': 'companyId', isLink: false },
    { header: 'Vendor Name', 'field': 'companyName', isLink: true },
    { header: 'Is Invited', 'field': 'invited', isLink: true }
  ];

  rightTable_vendorHeaders = [
    { header: 'ID', 'field': 'companyId', isLink: false },
    { header: 'Vendor Name', 'field': 'companyName', isLink: true }
  ];

  itemHeader: any = [
    { field: 'description', header: 'Description'  , isLink: false},
    { field: 'brand', header: 'Brand'  , isLink: false},
    { field: 'unitofMeasures', header: 'Unit Of Measure'  , isLink: false},
    { field: 'quantity', header: 'Quantity'  , isLink: false},
    { field: 'totalamount', header: 'Total Amount'  , isLink: false},

  ];

  auctionItemsList: any = [];

  paginatoryDetails: any;
  ppoItemspaginatoryDetails: any;
  public min = new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate(), new Date().getHours(), new Date().getMinutes());


  ngOnInit() {
    this.isEditAuction = false;
    this.isStartDateExpired = true;
    this.isEndDateExpired = true;
    this.defaultPermissions = AppApiConfig.DEFAULT_PERMISSIONS;
    const temp =  JSON.parse(this.encryDecryService.get(localStorage.getItem('logData')) );
    this.loggedUserData = temp;

    this.loggedUserPermissions = temp.details.listofPermission;
    this.auctionData = this.rowData.auctionData;
    this.pageRecordSize = AppConfig.GRID_PAGE_INFO.initpageSize;
    this.pageOptions = AppConfig.GRID_PAGE_INFO.pageOptions;
    this.bindJsonToView();
  }

  bindJsonToView() {
    console.log('isCapex..', this.auctionData)
    this.auctionName = this.auctionData.auctionName;
    this.selectedPrId = this.auctionData.pr.id;
    this.displaySelectedPrId = this.auctionData.pr.prId;
    this.selectedRFQ = this.auctionData.rfq.rfqId;
    this.auctionCategory = this.auctionData.auctionCategory;
    this.auctionType = this.auctionData.auctionType;
    this.scrollingText = this.auctionData.scrollingText;
    this.auctionStartDate = new Date(this.auctionData.auctionStarttime);
    this.extendBefore = new Date (this.auctionData.extendBefore);
    this.auctionEndDate = new Date(this.auctionData.auctionEndtime);
    this.pageRefreshInterval = this.auctionData.pageRefrestInterval;
    this.currencyType = this.auctionData.currencyType;
    this.commentNotInvited = this.auctionData.auctionVendors.length > 0 ? this.auctionData.auctionVendors[0].commentNotInvited : '' ;
    this.conductAuctionForSingleOrWhole = this.auctionData.conductAuctionForSingleOrWhole;
    this.startPrice = this.auctionData.startPrice;
    this.bidAgainstOn = this.auctionData.bidAgainstOn;
    this.showLeadingPriceToVendor = this.auctionData.showLeadingPriceToVendor;
    this.minimumBidReduction = this.auctionData.minimumBidReduction;
    this.minimumBidReductionPrice = this.auctionData.minimumBidReductionPrice ? Number(this.auctionData.minimumBidReductionPrice) : null;
    this.providePostBidPrice = this.auctionData.providePostBidPrice;
    this.autoExtendforAuction = this.auctionData.autoExtendforAuction;
    this.auctionExtendBefore = this.auctionData.auctionExtendBefore ? Number( this.auctionData.auctionExtendBefore) : null;
    this.bidsLimitForVendor = this.auctionData.bidsLimitForVendor;
    this.bidLimit = this.auctionData.bidLimit ? Number(this.auctionData.bidLimit) : null;
    this.bidExtendTime = this.auctionData.bidExtendTime ? Number(this.auctionData.bidExtendTime) : null;
    this.clientInvitation = this.auctionData.clientInvitation;
    this.attachments =  this.auctionData.attachments;
    this.createdBy = this.auctionData.createdBy;
    this.leftGrid_vendorData = this.auctionData.auctionVendors;
    this.auctionItemsList = this.auctionCategory === 'rfq total wise' ? this.auctionData.rfq.rfqItem :  this.auctionData.auctionItems;
    this.startpricevalue = this.auctionData.startpricevalue;
    this.startPrice = this.auctionData.startPrice;
    this.termsAndConditions = this.auctionData.auctionVendors.length > 0 ? this.auctionData.auctionVendors[0].acceptedTermsAndCondition : '' ;
    if (this.startPrice && this.auctionCategory === 'item wise') {
      this.itemHeader.push( { field: 'startpricevalue', header: 'Start Price'  , isLink: false, width: '130px', fieldType: 'label'});
    }


    if (this.minimumBidReduction && this.auctionCategory === 'item wise') {
      this.itemHeader.push( { field: 'minimumBidReductionPrice', header: 'Min. Bid Price'  , isLink: false, width: '130px', fieldType: 'label'});
    }






  }

  createAuction(auctionForm: NgForm) {
    console.log('auctionForm', auctionForm);
    if (auctionForm.valid) {
      this.buildAcutionData();
    } else {
      this.toastr.warning('Please enter the required fields', 'Warning');
    }





  }

  buildAcutionData() {
    const itemsList = [];

    // if (this.leftGrid_vendorData.length > 0) {
    //   this.leftGrid_vendorData.forEach(element => {
    //     element['acceptedTermsAndCondition'] = this.termsAndConditions;
    //     element['commentNotInvited'] = this.commentNotInvited;
    //     const obj = {
    //       'id': element['id']
    //     };
    //     const obj1 = {
    //       'id': element['quotationId']
    //     };
    //     element['quotation'] = obj1;
    //     element['vendor'] = obj;
    //     delete element.id;
    //     delete element.quotationId;
    //   });
    // }

    // if (this.rightGrid_vendorData.length > 0) {
    //   this.rightGrid_vendorData.forEach(element => {
    //     element['acceptedTermsAndCondition'] = this.termsAndConditions;
    //     element['commentNotInvited'] = this.commentNotInvited;
    //     const obj = {
    //       'id': element['id']
    //     };
    //     const obj1 = {
    //       'id': element['quotationId']
    //     };
    //     element['quotation'] = obj1;
    //     element['vendor'] = obj;
    //     delete element.id;
    //     delete element.quotationId;
    //   });
    // }

    // const vendorList  = [...this.leftGrid_vendorData, ...this.rightGrid_vendorData];


    // if (this.auctionCategory === 'rfq wise') {
    //   if (this.auctionItemsList.length > 0) {
    //     this.auctionItemsList.forEach(element => {
    //       const obj = {
    //         id: element.id
    //       };
    //       element['rfqitemid'] =  obj;
    //       delete element.id;
    //       itemsList.push(element);
    //     });
    //   } else {
    //     this.toastr.warning('No Items Available for Auction, Unable to create Auction', 'Warning');
    //     return;
    //   }
    // }

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
    let finalObj = Object.assign({}, this.auctionData);
    finalObj['auctionStarttime'] = this.auctionStartDate;
    finalObj['auctionEndtime'] = this.auctionEndDate;
    finalObj['scrollingText'] = this.scrollingText;
    finalObj['bidExtendTime'] = this.bidExtendTime;
    finalObj['auctionExtendBefore'] = this.auctionExtendBefore;
    finalObj['extendBefore'] = this.extendBefore;


    console.log('json obj---', finalObj);
    this.auctionService.editAuction(finalObj).subscribe((response) => {
      if (response['status'] === 'Success'  || response['statusCode'] === '200') {
        this.toastr.success(response['message'], 'Success');
        this.modal.closeAll();
      } else {
        this.toastr.error('Auction Creation Failed', 'Failed');
      }
    });

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
                    element['isInvited'] = true;
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
              element['isInvited'] = true;
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
                  element['isInvited'] = false;
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
              element['isInvited'] = false;
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
  console.log('category', this.auctionCategory);

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
          element['isInvited'] = false;
        });
        console.log('vendor list', this.leftGrid_vendorData);
    } else {
        this.leftGrid_vendorData = [];
    }
  });
}

cancelAuction() {
  this.isEditAuction = false;
}

editAcution(value) {

  const startDate = new Date(this.auctionData.auctionStarttime);
  const endDate = new Date(this.auctionData.auctionEndtime);
  const currentDate = new Date();
  console.log(
    'start Date', startDate, currentDate
  );
  this.isStartDateExpired = currentDate > startDate ? true : false;
  this.isEndDateExpired = currentDate > endDate ? true : false;

  if (currentDate > endDate) {
    this.toastr.warning('Sorry Unable to edit Auction, Its Expired', 'Warning');
    return;
  } else {
    this.isEditAuction = value;
  }

  if (currentDate !== startDate && currentDate < startDate) {
    this.isEditAuction = value;
  } else {
    // this.toastr.warning('Unable to edit auction, Either expired or Live auction is goining for it ', 'Warning');
  }


}


}

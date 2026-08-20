import { Component, OnInit, Inject, OnDestroy } from '@angular/core';
import { EncryDecryService } from 'src/app/shared/services';
import { AppApiConfig } from 'src/app/shared/constants/app-api.config';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { AuctionService } from 'src/app/layout/category-mgr/services/auction.service';
import { NgForm } from '@angular/forms';
import { ViewChild } from '@angular/core';
import { CountdownComponent } from 'ngx-countdown';
@Component({
  selector: 'app-live-auction-for-itemwise',
  templateUrl: './live-auction-for-itemwise.component.html',
  styleUrls: ['./live-auction-for-itemwise.component.scss']
})
export class LiveAuctionForItemwiseComponent implements OnInit, OnDestroy {
  @ViewChild('countdown') counter: CountdownComponent;
  auctionItemsHeaders  = [
    { field: 'rank', header: 'Rank'  , isLink: false, width: '166px', fieldType: 'label'},
    { field: 'description', header: 'Item Description'  , isLink: false, width: '255px', fieldType: 'label'},
    { field: 'itemcode', header: 'ItemCode'  , isLink: false, width: '65px', fieldType: 'label'},
    // { field: 'brand', header: 'Specifications'  , isLink: false, width: '165px', fieldType: 'label'},
    // { field: 'unitofMeasures', header: 'UOM'  , isLink: false, width: '100px', fieldType: 'label'},
    { field: 'quantity', header: 'Quantity'  , isLink: false, width: '130px', fieldType: 'label'},
    // { field: 'totalamount', header: 'Total amount'  , isLink: false, width: '160px', fieldType: 'label'},
    // { field: 'minBidPrice', header: 'Min Bid Price'  , isLink: false, width: '168px', fieldType: 'label'},
    // { field: 'startPrice', header: 'Start Price'  , isLink: false, width: '130px', fieldType: 'label'},
    // { field: 'bidAmount', header: 'Bid amount'  , isLink: false, width: '130px', fieldType: 'text'},
  ];

  pageRecordSize;
  pageOptions;
  defaultPermissions: any;
  loggedUserDetails: any;
  loggedUserPermissions: any;
  paginatoryDetails: any;
  bidTotalAmount = 0;
  starImageUrl = 'url(\'./../../../../../assets/images/star.png\')';
  auctionItemsList: any = [];
  auctionType: any;
  currentDateTime: Date;
  auctionEndsInSeconds: number;
  auctionExpired: any =  false;
  remainingBids: any  = null;
  auctionBidAndVendorData: any;
  bidEnteredAmount: any;
  currentRank: any;
  leadingPrice: any;
  lastBidAmount: any;
  isBidLimitsForVendor: any;
  scrollingText: any;
  lotName: any;
  auctionStartTime: any;
  auctionEndTime: any;
  isMinimumBidReduction: any;
  minimumBidReductionPrice: any;
  isstartPrice: any;
  startpricevalue: any;
  conductAuctionForSingleOrWhole: any;
  showLeadingPriceToVendor: any;
  auctionCategory: any;
  intervalTime: any;
  refreshPageInSeconds: any;
  selectedRow: any;
  acceptTermsand: any;
  timer: any = 0;
  timeOutIDs: number[] = [];
  isEditBidAmount: boolean;
  itemtimeoutinteval: any;

  constructor(private encryDecryService: EncryDecryService, @Inject(MAT_DIALOG_DATA) public data: any, private toastr: ToastrService, private auctionService: AuctionService, private modal: MatDialog) { }

  ngOnInit() {
    this.isEditBidAmount = false;

    this.defaultPermissions = AppApiConfig.DEFAULT_PERMISSIONS;
    const temp =  JSON.parse(this.encryDecryService.get('perm', localStorage.getItem('logData')) );
    this.loggedUserDetails = temp.details;


    this.loggedUserPermissions = this.loggedUserDetails.listofPermission;
    this.pageRecordSize = AppApiConfig.GRID_PAGE_INFO.initpageSize;
    this.pageOptions = AppApiConfig.GRID_PAGE_INFO.pageOptions;
    this.auctionBidAndVendorData = this.data.bidAuctionVendorData;
    this.selectedRow = this.data.selectData.acceptedTerms;
    this.currentDateTime = new Date();

    if (this.auctionBidAndVendorData) {
      this.setBidPanelData();
    }

    if (this.showLeadingPriceToVendor) {
      this.auctionItemsHeaders.push( { field: 'leadingPrice', header: 'Leading Price'  , isLink: false, width: '130px', fieldType: 'label'});
    }
    if (this.isstartPrice) {
      this.auctionItemsHeaders.push( { field: 'startpricevalue', header: 'Start Price'  , isLink: false, width: '130px', fieldType: 'label'});
    }
    if (this.isMinimumBidReduction) {
      this.auctionItemsHeaders.push( { field: 'minimumBidReductionPrice', header: 'Min. Bid Price'  , isLink: false, width: '130px', fieldType: 'label'});
    }
    this.auctionItemsHeaders.push( { field: 'previousBidAmount', header: 'Prev. Bid Amount'  , isLink: false, width: '150px', fieldType: 'label'});
    this.auctionItemsHeaders.push( { field: 'bidAmount', header: 'Bid amount'  , isLink: false, width: '130px', fieldType: 'text'});
    // this.itemsList();
    this.autoRefreshPage();
    this.refreshPageInSeconds = this.auctionBidAndVendorData['auction']['pageRefrestInterval'];
  }


  onAutoRefreshInterval() {
    if (!this.isEditBidAmount) {
      this.refresh();
    }
    console.log(' this.intervalTime',  this.intervalTime);
  }

  autoRefreshPage() {
    if (this.intervalTime) {
      clearInterval(this.intervalTime);
    }
    if (!this.auctionExpired ) {
      this.intervalTime = window.setInterval(
        this.onAutoRefreshInterval.bind(this),
        this.auctionBidAndVendorData['auction']['pageRefrestInterval'] * 1000
      );
    }

  }

  // itemsList(){
  //   this.bidTotalAmount = 0;
  //   this.auctionItemsList = [...this.auctionBidAndVendorData.bidItems];
  //   this.auctionItemsList.forEach(element => {
  //     element['previousBidAmount'] = element['bidAmount'];
  //     this.bidTotalAmount = this.bidTotalAmount + (element.quantity * element.bidAmount);

  //   });}
  setBidPanelData() {
    this.bidEnteredAmount = null;
    this.bidTotalAmount = 0;
    this.checkBidTime();
    this.auctionItemsList = [...this.auctionBidAndVendorData.bidItems];
    this.auctionItemsList.forEach(element => {
      element['previousBidAmount'] = element['bidAmount'];
      this.bidTotalAmount = this.bidTotalAmount + (element.quantity * element.bidAmount);
    });
    this.auctionCategory = this.auctionBidAndVendorData['bidType'],
    this.currentRank = this.auctionBidAndVendorData.currentRank;
    this.leadingPrice = this.auctionBidAndVendorData['auction']['rfqCurrentLeadingPrice'];
    this.lastBidAmount = this.auctionBidAndVendorData.bidAmount;
    this.isBidLimitsForVendor = this.auctionBidAndVendorData['auction']['bidsLimitForVendor'];
    // this.remainingBids = this.auctionBidAndVendorData['auction']['auctionVendors'][0]['remainingBid'];
    this.remainingBids = this.auctionBidAndVendorData.remainingBid;
    this.scrollingText = this.auctionBidAndVendorData['auction']['scrollingText'];
    this.lotName = this.auctionBidAndVendorData['auction']['auctionName'];
    this.auctionStartTime = this.auctionBidAndVendorData['auction']['auctionStarttime'];
    this.auctionEndTime = this.auctionBidAndVendorData['auction']['auctionEndtime'];
    this.isMinimumBidReduction = this.auctionBidAndVendorData['auction']['minimumBidReduction'];
    this.minimumBidReductionPrice = this.auctionBidAndVendorData['auction']['minimumBidReductionPrice'];
    this.isstartPrice = this.auctionBidAndVendorData['auction']['startPrice'];
    this.startpricevalue = this.auctionBidAndVendorData['auction']['startpricevalue'];
    this.conductAuctionForSingleOrWhole = this.auctionBidAndVendorData['auction']['conductAuctionForSingleOrWhole'];
    this.startpricevalue = this.auctionBidAndVendorData['auction']['startpricevalue'];
    this.auctionType = this.auctionBidAndVendorData['auction']['auctionType'];
    this.showLeadingPriceToVendor = this.auctionBidAndVendorData['auction']['showLeadingPriceToVendor'];
  }

  onPage(event) {
    this.paginatoryDetails = event;
  }

  ongetTotalBid(rowData) {
    this.isEditBidAmount = true;
    if (this.timer) {
      clearInterval(this.timer);
    }
    this.bidTotalAmount  = 0;
    this.auctionItemsList.forEach(element => {
      const elementBidAmount = element.bidAmount ? element.bidAmount :  0;
      const elementAmount = element.quantity * (elementBidAmount);
      this.bidTotalAmount =  this.bidTotalAmount + elementAmount;
    });
  }


  refresh() {
    if (!this.isEditBidAmount) {
      this.auctionService.getBidsByAuctionIdAndVendorId({auction: { id: this.auctionBidAndVendorData['auction']['id']}, vendor: { id: this.loggedUserDetails.org.id}}).subscribe((res) => {
        if (res['id']) {
          this.auctionBidAndVendorData = Object.assign({}, res);
          this.setBidPanelData();
        }
      });
    } else {
        this.isEditBidAmount = false;
        this.autoRefreshPage();
    }
  }

  onItemTimeoutRefresh() {
    this.isEditBidAmount = false;
    // this.auctionExpired =  (new Date())  > new Date(this.auctionBidAndVendorData['auction']['auctionEndtime']) ? false: true;
    this.auctionEndsInSeconds =  (new Date(this.auctionBidAndVendorData['auction']['auctionEndtime']).getTime() - (new Date()).getTime()) / 1000;
    this.refresh();
  }

  onBidTimeInterval() {
    if ( (new Date())  > new Date(this.auctionBidAndVendorData['auction']['auctionEndtime'])) {
      this.auctionExpired = true;

      this.itemtimeoutinteval = window.setTimeout(
        this.onItemTimeoutRefresh.bind(this),
        this.auctionBidAndVendorData['auction']['pageRefrestInterval'] * 1000
      );

      clearInterval(this.timer);
    } else {
      this.auctionExpired = false;
    }
  }

  checkBidTime() {
    this.auctionEndsInSeconds =   (new Date(this.auctionBidAndVendorData['auction']['auctionEndtime']).getTime() - (new Date()).getTime()) / 1000;
    // if (this.auctionEndsInSeconds > 0) {
    //   setInterval(() => {
    //     if (this.auctionEndsInSeconds > 0 &&  !this.auctionExpired) {
    //        this.auctionEndsInSeconds --;
    //     }
    //     console.log('a', this.auctionEndsInSeconds);
    //     if (this.auctionEndsInSeconds <= 0) {
    //       this.auctionExpired = true;
    //     }
    //   }, 1000);
    // }
    console.log('end in seconds', ((new Date(this.auctionBidAndVendorData['auction']['auctionEndtime']).getTime() - (new Date()).getTime()) / 1000) / 60);
    clearTimeout(this.timer);
    if (this.timer) {
      clearInterval(this.timer);
    }

    this.auctionExpired =  (new Date())  > new Date(this.auctionBidAndVendorData['auction']['auctionEndtime']) ? true : false;
    if (true) {
      this.timer = window.setInterval(this.onBidTimeInterval.bind(this), 2000);
    }

    if (this.auctionExpired) {
      clearInterval(this.timer);
      clearInterval(this.intervalTime);
    }


  }

  finishTest() {
    this.auctionEndsInSeconds = 0;
    if (this.counter) {
   window.setTimeout(() => this.counter.restart(), 10);
    }
  }
  onSubmitBid() {
    if (this.bidTotalAmount === 0 || this.bidTotalAmount == null) {
      this.toastr.warning('Please enter your bid amount for atleast one Item', 'Warning');
      return false;
    }


    this.auctionItemsList.forEach(element => {
      delete element['id'];
      if (element['lastBidamount'] !== element['bidAmount']) {
        element['bidCount'] = element['bidCount'] + 1;
      }
    });

    let finalObj:any = {
      auction : {
        id: this.auctionBidAndVendorData['auction']['id']
      },

      bidAmount: this.bidTotalAmount,
      vendor: {
        id: this.loggedUserDetails.org.id
      },
      bidItems: this.auctionItemsList,
      bidType: this.auctionBidAndVendorData['auction']['auctionCategory'],
      auctionType: this.auctionBidAndVendorData['auction']['auctionType'],
    };

    finalObj['rfq']= this.auctionBidAndVendorData['auction']['rfq'] && this.auctionBidAndVendorData['auction']['rfq']['id'] ?
    {  id:  this.auctionBidAndVendorData['auction']['rfq']['id'] }: null;

    this.auctionService.submitBidByVendorForRFQwiseOrItemwise(finalObj).subscribe((res) => {
      if (res['status'] === 'Success') {
        this.toastr.success(res['message'], 'Success');
        this.modal.closeAll();

      } else {
        if (res['status']  === 'Failure') {
          this.toastr.error(res['errorMessage'], 'Failed');
        }
        if (this.auctionType !== 'sealed bid') {
          if ((res['id'])) {
            this.auctionBidAndVendorData = Object.assign({}, res);
            this.isEditBidAmount = false;
            this.setBidPanelData();
            // this.itemsList();
           this.autoRefreshPage();
          } else {
            this.toastr.error(res['errorMessage'], 'Failed');
          }
        }
        // this.toastr.error(res['errorMessage'], 'Failed');
      }
    });
  }

  ngOnDestroy(): void {
    this.auctionExpired = true;
    this.auctionEndsInSeconds = 0;
    if (this.intervalTime) {
      clearInterval(this.intervalTime);
    }
    if (this.timer) {
      clearInterval(this.timer);
    }
    if (this.itemtimeoutinteval) {
      clearTimeout(this.itemtimeoutinteval);
    }
  }
  onSubmit(f: NgForm) {
    const reqObj = {
      'auction': {'id': this.data.selectData.id},
'vendor': {'id': this.loggedUserDetails.org.id}
    };
    this.auctionService.getAuctionAccept(reqObj).subscribe((data) => this.successCallBack(data));
  }
  successCallBack(data) {
    if (data.statusCode === '200') {
      this.selectedRow = true;
      this.toastr.success(data['message'], 'Success');
    } else {
      this.toastr.error(data['message'], 'Error');
    }
  }
}


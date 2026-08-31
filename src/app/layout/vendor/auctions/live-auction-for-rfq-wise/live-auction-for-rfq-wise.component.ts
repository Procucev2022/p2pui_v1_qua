import { Component, OnInit, Inject, OnDestroy } from '@angular/core';
import { AppApiConfig } from 'src/app/shared/constants/app-api.config';
import { EncryDecryService } from 'src/app/shared/services';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import swal from 'sweetalert2';
import { ToastrService } from 'ngx-toastr';
import { AuctionService } from 'src/app/layout/category-mgr/services/auction.service';
import { NgForm } from '@angular/forms';
import { ViewChild } from '@angular/core';
import { CountdownComponent } from 'ngx-countdown';
@Component({
  selector: 'app-live-auction-for-rfq-wise',
  templateUrl: './live-auction-for-rfq-wise.component.html',
  styleUrls: ['./live-auction-for-rfq-wise.component.scss']
})
export class LiveAuctionForRfqWiseComponent implements OnInit , OnDestroy {
  @ViewChild('countdown') counter: CountdownComponent;
  auctionItemsHeaders  = [
    { field: 'serialNo', header: 'S.No'  , isLink: false, width: '5%', fieldType: 'label'},
    { field: 'description', header: 'Item Description'  , isLink: false, width: '25%', fieldType: 'label'},
    { field: 'specification', header: 'Specifications'  , isLink: false, width: '20%', fieldType: 'label'},
    { field: 'itemcode', header: 'ItemCode'  , isLink: false, width: '10%', fieldType: 'label'},
    { field: 'unitofMeasures', header: 'UOM'  , isLink: false, width: '7%', fieldType: 'label'},
    { field: 'quantity', header: 'Quantity'  , isLink: false, width: '10%', fieldType: 'label'},

    // { field: 'bidAmount', header: 'Bid amount'  , isLink: false, width: '130px', fieldType: 'text'},
  ];
  auctionItemsList = [];
  pageRecordSize;
  pageOptions;
  defaultPermissions: any;
  loggedUserDetails: any;
  loggedUserPermissions: any;
  paginatoryDetails: any;
  bidTotalAmount = 0;
  currentDateTime: Date;
  auctionEndsInSeconds: number;
  auctionExpired: boolean;
  auctionType: any;
  bidEnteredAmount: any;
  currentRank: any = 0;
  lastBidAmount: any = 0;
  remainingBids = null;
  leadingPrice: any;
  dialog_width = 90;
  auctionBidAndVendorData: any;
  scrollingText: any;
  isBidLimitsForVendor: any;
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
  isEditBidAmount: boolean;
  timeoutinteval: any;

  constructor(private encryDecryService: EncryDecryService, @Inject(MAT_DIALOG_DATA) public data: any,
  private toastr: ToastrService, private auctionService: AuctionService, private modal: MatDialogRef<LiveAuctionForRfqWiseComponent>) { }

  ngOnInit() {
    this.isEditBidAmount = false;
    this.defaultPermissions = AppApiConfig.DEFAULT_PERMISSIONS;
    const temp =  JSON.parse(this.encryDecryService.get(localStorage.getItem('logData')) );
    this.loggedUserDetails = temp.details;
    this.selectedRow = this.data.selectData.acceptedTerms;
    this.auctionBidAndVendorData = this.data.bidAuctionVendorData;
    // this.bidEnteredAmount = 0;
    this.itemsList();
    this.currentDateTime = new Date();
    if (this.counter) {
      setTimeout(() => this.counter.begin(), 10);
       }

    if (this.auctionBidAndVendorData) {
      this.setBidPanelData();
    }
    this.loggedUserPermissions = this.loggedUserDetails.listofPermission;
    this.pageRecordSize = AppApiConfig.GRID_PAGE_INFO.initpageSize;
    this.pageOptions = AppApiConfig.GRID_PAGE_INFO.pageOptions;

    this.auctionItemsHeaders.push( { field: 'previousBidAmount', header: 'Prev.Bid Amount'  , isLink: false, width: '13%', fieldType: 'label'});
    this.auctionItemsHeaders.push( { field: 'bidAmount', header: 'Bid amount'  , isLink: false, width: '10%', fieldType: 'text'});
    this.autoRefreshPage();
    this.refreshPageInSeconds = this.auctionBidAndVendorData['auction']['pageRefrestInterval'];
  }

  itemsList() {
    this.bidEnteredAmount = 0;
    this.auctionItemsList = [...this.auctionBidAndVendorData.bidItems];
    this.auctionItemsList.forEach(element => {
        element['previousBidAmount'] = element['bidAmount'];
        this.bidEnteredAmount =  this.roundTo(this.bidEnteredAmount + (element.quantity * (element.bidAmount ? element.bidAmount :  0)), 2);
    });
  }

  roundTo(num: number, places: number) {
    const factor = 10 ** places;
    return Math.round(num * factor) / factor;
  }

  autoRefreshPage() {
    if (this.intervalTime) {
      clearInterval(this.intervalTime);
    }
    if (!this.auctionExpired ) {
     this.intervalTime = setInterval(() => {
       if (!this.isEditBidAmount) {
          this.refresh();
       }
      }, this.auctionBidAndVendorData['auction']['pageRefrestInterval'] * 1000);
    }
  }
  setBidPanelData() {
    // this.bidEnteredAmount = 0;
    this.checkBidTime();
    // this.auctionItemsList = [...this.auctionBidAndVendorData.bidItems];
    // this.auctionItemsList.forEach(element => {
    //   element['previousBidAmount'] = element['bidAmount'];
    //   this.bidEnteredAmount =  this.bidEnteredAmount + (element.quantity * (element.bidAmount ? element.bidAmount :  0));

    // });
    this.auctionCategory = this.auctionBidAndVendorData['bidType'],
    this.currentRank = this.auctionBidAndVendorData.currentRank;
    this.leadingPrice = this.auctionBidAndVendorData['auction']['rfqCurrentLeadingPrice'];
    this.lastBidAmount = this.auctionBidAndVendorData.lastBidamount;
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

  checkBidTime() {
    console.log('check bid-->');
    // const seconds = (this.auctionBidAndVendorData['auction']['timestamp'] - +new Date()) /1000;
    this.auctionEndsInSeconds = (new Date(this.auctionBidAndVendorData['auction']['auctionEndtime']).getTime() - (new Date()).getTime()) / 1000;
    // if (this.auctionEndsInSeconds > 0) {
    //   setInterval(() => {
    //     if (this.auctionEndsInSeconds > 0 &&  !this.auctionExpired) {
    //       this.auctionEndsInSeconds --;
    //     }
    //     if (this.auctionEndsInSeconds <= 0) {
    //       this.auctionExpired = true;
    //     }
    //   }, 1000);
    // }
    this.auctionExpired =  (new Date())  > new Date(this.auctionBidAndVendorData['auction']['auctionEndtime']) ? true : false;
    if (this.timer) {
      clearInterval(this.timer);
    }
    if (true) {
      console.log(' In True bid-->', this.timer);
      // console.log("" In True bid-->",new Date(this.auctionBidAndVendorData['auction']['auctionEndtime']));

      this.timer = setInterval(() => {
        if ( (new Date())  > new Date(this.auctionBidAndVendorData['auction']['auctionEndtime'])) {
         console.log('Enteres cond--->');
          this.auctionExpired = true;

            this.timeoutinteval = setTimeout(function() {
              this.isEditBidAmount = false;
              this.auctionExpired =  false;
              // this.auctionEndsInSeconds =  (new Date(this.auctionBidAndVendorData['auction']['auctionEndtime']).getTime() - (new Date()).getTime()) / 1000;
              this.refresh();
             }, this.auctionBidAndVendorData['auction']['pageRefrestInterval'] * 1000);


            // setTimeout(() => {
            //   this.refresh();
            // }, this.auctionBidAndVendorData['auction']['pageRefrestInterval'] * 1000);

          clearInterval(this.timer);
        } else {
          this.auctionExpired = false;
        }

      }, 2000);
    }

    if (this.auctionExpired) {
      clearInterval(this.timer);
      clearInterval(this.intervalTime);
    }

  }

  finishTest() {
    this.auctionEndsInSeconds = 0;
    if (this.counter) {
   setTimeout(() => this.counter.restart(), 10);
    }
  }
  onSubmitBid() {
    if (this.bidEnteredAmount === 0 || this.bidEnteredAmount == null || this.bidEnteredAmount === '') {
      this.toastr.warning('Please enter your bid amount', 'Warning');
      return false;
    }
    console.log(this.auctionBidAndVendorData['auction']['auctionType']);
    console.log(this.auctionBidAndVendorData['auction']['startpricevalue']);
    console.log(this.bidEnteredAmount);
    if (this.auctionBidAndVendorData['auction']['startPrice']) {
      if (this.auctionBidAndVendorData['auction']['auctionType'] !== 'Forward Auction' && Number(this.auctionBidAndVendorData['auction']['startpricevalue']) < this.bidEnteredAmount) {
        this.toastr.warning('Your Bid amount is greater than Start Price amount', 'Warning');
        return false;
      } else if (this.auctionBidAndVendorData['auction']['auctionType'] === 'Forward Auction' && Number(this.auctionBidAndVendorData['auction']['startpricevalue']) > this.bidEnteredAmount) {
        this.toastr.warning('Your Bid amount is lesser than Start Price amount', 'Warning');
        return false;
      }
    }
    this.auctionItemsList.forEach(element => {
      delete element['id'];
    });

    let finalObj:any = {
      auction : {
        id: this.auctionBidAndVendorData['auction']['id']
      },

      bidAmount: this.bidEnteredAmount,
      vendor: {
        id: this.loggedUserDetails.org.id
      },
      bidType: this.auctionBidAndVendorData['auction']['auctionCategory'],
      auctionType: this.auctionBidAndVendorData['auction']['auctionType'],
      bidItems: this.auctionItemsList
    };


    finalObj['rfq']= this.auctionBidAndVendorData['auction']['rfq'] && this.auctionBidAndVendorData['auction']['rfq']['id'] ?
    {  id:  this.auctionBidAndVendorData['auction']['rfq']['id'] }: null;

    this.auctionService.submitBidByVendorForRFQwiseOrItemwise(finalObj).subscribe((res) => {
      if (res['status'] === 'Success') {
        this.toastr.success(res['message'], 'Success');
        this.modal.close();

      } else {
        if (this.auctionBidAndVendorData['auction']['auctionType'] !== 'sealed bid') {
          if ((res['id'])) {
            this.auctionBidAndVendorData = null;
            this.auctionBidAndVendorData = Object.assign({}, res);
            this.isEditBidAmount = false;
            this.setBidPanelData();
            this.itemsList();
            this.autoRefreshPage();


          } else {
            this.toastr.error(res['errorMessage'], 'Failed');
          }
        }
        // this.toastr.error(res['errorMessage'], 'Failed');
      }
      // this.bidEnteredAmount = null;
    });
  }


  onPage(event) {
    this.paginatoryDetails = event;
  }


  ongetTotalBid(rowData) {
    // this.isEditBidAmount = true;
    if (this.timer) {
      clearInterval(this.timer);
    }
    this.bidEnteredAmount  = 0;
    this.auctionItemsList.forEach(element => {
      console.log('element', element);
      // this.bidEnteredAmount =  this.bidEnteredAmount + (element.bidAmount ? element.bidAmount :  0);
      const elementBidAmount = element.bidAmount ? element.bidAmount :  0;
      const elementAmount = element.quantity * (elementBidAmount);
      console.log('elementAmount', elementAmount);
      this.bidEnteredAmount =  this.roundTo(this.bidEnteredAmount + elementAmount, 2);

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
    if (this.timeoutinteval) {
      clearTimeout(this.timeoutinteval);
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

  zoomout() {
    if (this.dialog_width >= 70) {
        this.dialog_width = this.dialog_width - 5;
    }
    this.modal.updateSize(this.dialog_width + '%');
}

zoomin() {

    if (this.dialog_width <= 85) {
        this.dialog_width = this.dialog_width + 5;
    }
    this.modal.updateSize(this.dialog_width + '%');
    console.log(this.dialog_width);
}

}


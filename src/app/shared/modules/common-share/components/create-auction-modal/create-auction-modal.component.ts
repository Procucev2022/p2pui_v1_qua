import { Component, OnInit, Inject } from '@angular/core';
import { NgForm } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { AppConfig } from 'src/app/app.config';
import { AuctionService } from 'src/app/layout/category-mgr/services/auction.service';

@Component({
  selector: 'app-create-auction-modal',
  templateUrl: './create-auction-modal.component.html',
  styleUrls: ['./create-auction-modal.component.scss']
})
export class CreateAuctionModalComponent implements OnInit {

  selectedAuction;

  isShowLeadingPriceToVendor = false;
  isMinRevisedBidPriceToVendor = false;
  isBidsLimitForVendor = false;
  isAutoExtendedTimeForReverseBid = false;
  isHowManyTimesAutoExtendedTimeForReverseBid = false;
  minMaxValues = {
    min: 1,
    max: 10
  };

  bidExtendTime;
  minBidPrice;
  bidLimit;
  auctionExtendedLimit;
  prData: any;
  isclientInvitation;
  auctionDate;
  public min = new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate(), new Date().getHours(), new Date().getMinutes());

  vendorTableHeaders: any = [
    { field: 'vendorId', header: 'Vendor Id'  , isLink: false},
    { field: 'vendorName', header: 'Vendor Name'  , isLink: false},
  ];
  vendorTableData: any = [];

  selectedVendorsList: any = [];
  pageRecordSize: any;
  pageOptions: any;
  paginatoryDetails: any;
  vendorData: any;
  isAdd: any;
  currentDate: Date;
  refreshBtn = false;
  isForCapex :boolean = false;


  constructor(@Inject(MAT_DIALOG_DATA) public data: any, private auctionService: AuctionService,    private modalDialog: MatDialogRef<CreateAuctionModalComponent> ) { }

  ngOnInit() {
    this.currentDate = new Date();
    this.isAdd = this.data.isAdd;
    console.log('min', this.min);
    this.pageRecordSize = AppConfig.GRID_PAGE_INFO.initpageSize;
    this.pageOptions = AppConfig.GRID_PAGE_INFO.pageOptions;
    console.log('data', this.data);
    this.isForCapex = this.data && this.data.isForCapex ? this.isForCapex: false;
    if (this.isAdd) {
      this.prData = this.data.prData.length > 0 ? this.data.prData[0] : null;
      if (this.data.vendorsList && this.data.vendorsList.length > 0) {
        const resArr = [];
        this.data.vendorsList.forEach(function(item) {
          const i = resArr.findIndex(x => x.vendorId === item.vendorId);
          if (i <= -1) {
            resArr.push(item);
          }
        });
        this.vendorTableData = resArr;
      }

      this.vendorData = {
        headers: this.vendorTableHeaders,
        rowData : this.vendorTableData
      };
    }

    // if(this.getEndDate(this.data.auctionData.auctionEndtime) > this.currentDate && this.getStartDate(this.data.auctionData.auctionStarttime) <=  this.currentDate){
    //   console.log('hii');
    //   this.refreshBtn = true
    // }else {
    //   this.refreshBtn = false
    //   console.log('bye');
    // }

  }
  // refresh(){
  //   this.auctionService.getAuctionById({ id: this.data.auctionData.id }).subscribe((res:any) => {
  //     if (res['id']) {
  //       if (this.isAdd) {
  //         this.prData = res.prData.length > 0 ? res.prData[0] : null;
  //         if (res.vendorsList && res.vendorsList.length > 0) {
  //           const resArr = [];
  //           res.vendorsList.forEach(function(item) {
  //             const i = resArr.findIndex(x => x.vendorId === item.vendorId);
  //             if (i <= -1) {
  //               resArr.push(item);
  //             }
  //           });
  //           this.vendorTableData = resArr;
  //         }

  //         this.vendorData = {
  //           headers: this.vendorTableHeaders,
  //           rowData : this.vendorTableData
  //         };
  //       }
  //     }
  //   })
  // }

    getEndDate(endDate) {
        return new Date(endDate);
    }

    getStartDate(startDate) {
        return new Date(startDate);
    }
  formatLabel(value: number) {
    if (value >= 1) {
      return Math.round(value) + ' Times';
    }

    return value;
  }


  createAuction(f1: NgForm) {
    console.log('form', f1);
  }

  checkLimit(event) {
    console.log('event', event);
  }
  onPage(event) {
    this.paginatoryDetails = event;
  }

  onSelectAuctionType(auctionType) {
    console.log('selectAuctionType',  this.selectedAuction);
  }

  zoomout() {
    this.modalDialog.updateSize('70%');
  }

  zoomin() {
      this.modalDialog.updateSize('90%');
  }
}

import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { CountdownComponent } from 'ngx-countdown';
import { TimeInterval } from 'rxjs';
import { AppConfig } from 'src/app/app.config';
import { EncryDecryService } from 'src/app/shared/services';
import { AuctionService } from '../../services/auction.service';

@Component({
  selector: 'app-auction-bid-details',
  templateUrl: './auction-bid-details.component.html',
  styleUrls: ['./auction-bid-details.component.scss']
})
export class AuctionBidDetailsComponent implements OnInit {

  @ViewChild('countdown') counter: CountdownComponent;
  loggedUserType: string;
  viewAuctionResponseData: any[];
  auctionExpired: boolean;
  auctionEndsInSeconds: number;
  pageRefrestInterval: number;
  constructor(private auctionService: AuctionService,
    private encryDecryService: EncryDecryService, ) { }
  auctionBidsList = [];
  paginatoryDetails: any;
  pageRecordSize: any;
  pageOptions: any;
  @Input('bidsData') bidsData: any;
  @Input('auctionType') auctionType: any;
  @Input('selectedRowdata') selectedRowdata: any;
  auctionBidTableHeaders: any[] = [];
  myInterval: any;

  ngOnInit() {

    const temp = JSON.parse(this.encryDecryService.get(localStorage.getItem('logData')));
        console.log('lgo', temp.details);
        this.loggedUserType = temp.details.role.roleName;
    this.auctionBidsList = [];
    this.pageRecordSize = AppConfig.GRID_PAGE_INFO.initpageSize;
    this.pageOptions = AppConfig.GRID_PAGE_INFO.pageOptions;
    this.auctionBidsList = this.bidsData['bids'];
    this.auctionBidTableHeaders = [];
    this.auctionEndsInSeconds = (new Date(this.selectedRowdata.auctionEndtime).getTime() - (new Date()).getTime()) / 1000;
    this.pageRefrestInterval = this.selectedRowdata.pageRefrestInterval;

    // setTimeout(() => {
    //   this.auctionEndsInSeconds = (new Date(this.selectedRowdata.auctionEndtime).getTime() - (new Date()).getTime()) / 1000;
    //   if (this.counter) {
    //       setTimeout(() => this.counter.begin(), 10);
    //   }
    // }, 1000);

    this.auctionExpired =  (new Date())  > new Date(this.selectedRowdata.auctionEndtime) ? true : false;

    if (this.loggedUserType === 'CategoryManager') {
      this.auctionBidTableHeaders = [
        { field: 'vendorName', header: 'Vendor Name'  , isLink: false, width: '166px'},
        { field: 'bidAmount', header: 'Bid Amount'  , isLink: false, width: '165px'},
        { field: 'currentRank', header: 'Rank'  , isLink: false, width: '168px'},
        { field: 'acceptedTerms', header: 'Logged User'  , isLink: false, width: '168px'},
        { field: 'bidCount', header: 'Bid Count'  , isLink: false, width: '168px'}
    ];
    } else {
      this.auctionBidTableHeaders = [
        { field: 'vendorName', header: 'Vendor Name'  , isLink: false, width: '166px'},
        { field: 'bidAmount', header: 'Bid Amount'  , isLink: false, width: '165px'},
        { field: 'currentRank', header: 'Rank'  , isLink: false, width: '168px'}
    ];

    }
    if (!this.auctionExpired) {
    this.autoCheck();
    }


  }

  autoCheck() {
    this.myInterval =  setInterval(() => {
        this.getBidsByAuctionId();
    }, 90 * 1000);
  }


  getBidsByAuctionId() {
    if (this.myInterval != null) {
      const currentDate = new Date();
      const maxTime = new Date(this.selectedRowdata.auctionEndtime);
      if (currentDate > maxTime) {
        clearInterval(this.myInterval);
      }
    }
    const reqObj = {
      'id': this.selectedRowdata.id
    };
    this.auctionService.getBidsByAuctionId(reqObj).subscribe( data => {
      const d = JSON.parse(JSON.stringify(data));
      this.auctionEndsInSeconds = (new Date(d.auctionendtime).getTime() - new Date().getTime()) / 1000;
      this.pageRefrestInterval = d.pageRefrestInterval;
      this.bidsData.auctionEndtime = d.auctionEndtime;
      this.refresh(this.bidsData.description);
    });
   }

    refresh(itemType) {
       this.bidsData = [];
       this.auctionBidsList = [];
       console.log('selectedRowdata---', this.selectedRowdata);

        if (this.selectedRowdata['auctionCategory'] === 'item wise') {
            if (this.loggedUserType === 'CategoryManager') {
        this.auctionService.getBidItemsByAuction({'id': this.selectedRowdata.id}).subscribe((res) => {
           const bidItem = res.find(item => {
           return  (item.description === itemType);
          });
          console.log('Biditemm--', bidItem);
            this.bidsData = bidItem;
            this.auctionBidsList = bidItem['bids'];
           // this.auctionBidsList=  res['bids]'];
        });
      }
      } else {
          if (this.loggedUserType === 'CategoryManager') {
              this.auctionService.getBidsByAuction({'id': this.selectedRowdata.id}).subscribe((res) => {
                this.bidsData = res;
                this.auctionBidsList = res['bids'];
              // this.auctionBidsList=  res['bids]'];
              });
            }

      }
    }

   finishTest() {
    this.counter.stop();
    document.getElementById('countdowntimer').remove();
  }

    ngOnDestroy(): void {
        this.auctionEndsInSeconds = 0;
        if (this.myInterval != null) {
         clearInterval(this.myInterval);
        }

    }

    start() {
        if (this.counter) {
            setTimeout(() => this.counter.begin(), 10);
        }
    }


  }


import { Component, OnInit, Input } from '@angular/core';
import { AppConfig } from 'src/app/app.config';
import { AuctionService } from '../services/auction.service';
import { EncryDecryService } from 'src/app/shared/services';
import { ToastrService } from 'ngx-toastr';
@Component({
  selector: 'app-auction-bids',
  templateUrl: './auction-bids.component.html',
  styleUrls: ['./auction-bids.component.scss']
})
export class AuctionBidsComponent implements OnInit {

  @Input('auctionData') auctionData: any;
  @Input('auctionId') auctionId: any;

  auctionBidsList: any =  [];
  paginatoryDetails: any;
  pageRecordSize: any;
  pageOptions: any;
  selectedData = [];
  bidItemsList = [];
  bidId: any;
  loggedUserType: any;
  loggedUserDetails: any;
  constructor(private auctionService: AuctionService, private encryDecryService: EncryDecryService, private toastr: ToastrService) { }
  auctionBidHeaders: any = [
      { field: 'id', header: 'Bid Id'  , isLink: true, width: '196px'},
      { field: 'currentRank', header: 'Rank'  , isLink: false, width: '196px'},
      { field: 'bidType', header: 'Bid Type'  , isLink: false, width: '166px'},
      { field: 'auctionType', header: 'Bid Category'  , isLink: false, width: '165px'},
      { field: 'vendorName', header: 'Vendor Name'  , isLink: false, width: '165px'},
      { field: 'bidCount', header: 'Bid Count'  , isLink: false, width: '165px'},
      { field: 'auctionType', header: 'Bid Category'  , isLink: false, width: '165px'},
      { field: 'createdTS', header: 'Bid Submitted Time'  , isLink: false, width: '190px'},
  ];

  ngOnInit() {
    this.pageRecordSize = AppConfig.GRID_PAGE_INFO.initpageSize;
    this.pageOptions = AppConfig.GRID_PAGE_INFO.pageOptions;
    const temp =  JSON.parse(this.encryDecryService.get('perm', localStorage.getItem('logData')) );
    console.log('lgo', temp.details);
    this.loggedUserType = temp.details.role.roleName;
    this.loggedUserDetails = temp.details;
    this.getBidsByAuctionId();

  }

  getBidsByAuctionId() {
    const reqObj = {
      'id': this.auctionData.id
    };
    let bidsList = [];
    this.auctionService.getBidsByAuctionId(reqObj).subscribe( (data: any[] ) => {

        if (Array.isArray(data)) {
          bidsList = data || [];
        } else {
          bidsList = [];
        }

         this.selectedData  = [];
         if (this.loggedUserType === 'Vendor') {
            if (bidsList.length > 0) {
              this.auctionBidsList = bidsList.filter((element) => element['vendor']['id'] === this.loggedUserDetails.org.id);
            } else {
              this.auctionBidsList = [];
            }
         } else {
          this.auctionBidsList = [...bidsList];
         }
         if (this.auctionBidsList.length === 0) {
           this.toastr.warning('No Bids found for the selected auction', 'Warning');
         }

    });
   }


   ngOnChanges() {
     if (this.auctionId) {
      this.getBidsByAuctionId();
     }
  }

  onPage(event) {
    this.paginatoryDetails = event;
  }


  getItems(rowData, event) {
    console.log('rowda', rowData);
    this.selectedData = [rowData];
    this.bidId = rowData.id;
    this.bidItemsList = rowData.bidItems || [];
  }

}

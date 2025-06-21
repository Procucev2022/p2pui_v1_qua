import { Component, OnInit, Input } from '@angular/core';
import { AppConfig } from 'src/app/app.config';

@Component({
  selector: 'app-auction-bid-items',
  templateUrl: './auction-bid-items.component.html',
  styleUrls: ['./auction-bid-items.component.scss']
})
export class AuctionBidItemsComponent implements OnInit {

  @Input('auctionBIdItems') auctionBIdItems: any;
  @Input('bidId') bidId: any;

  bidItemsList: any =  [];
  paginatoryDetails: any;
  pageRecordSize: any;
  pageOptions: any;
  constructor() { }
  bidItemsHeaders: any = [

      { field: 'rank', header: 'Rank'  , isLink: false, width: '166px'},
      { field: 'serialNo', header: 'S.No', isLink: false, width:'70px' },
      { field: 'description', header: 'Item Description'  , isLink: false, width: '256px'},
      { field: 'brand', header: 'Specifications'  , isLink: false, width: '165px'},
      { field: 'unitofMeasures', header: 'UOM'  , isLink: false, width: '130px'},
      { field: 'quantity', header: 'Quantity'  , isLink: false, width: '130px'},
  ];

  ngOnInit() {
    this.pageRecordSize = AppConfig.GRID_PAGE_INFO.initpageSize;
    this.pageOptions = AppConfig.GRID_PAGE_INFO.pageOptions;
    this.getLineItems();
  }

  getLineItems() {
    this.bidItemsList = this.auctionBIdItems || [];
   }


   ngOnChanges() {
     if (this.bidId) {
      this.getLineItems();
     }
  }

  onPage(event) {
    this.paginatoryDetails = event;
  }

}

import { Component, OnInit, Input } from '@angular/core';
import { AppApiConfig } from 'src/app/shared/constants/app-api.config';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { LiveAuctionModalComponent } from '../live-auction-modal/live-auction-modal.component';

@Component({
  selector: 'app-scheduled-auctions',
  templateUrl: './scheduled-auctions.component.html',
  styleUrls: ['./scheduled-auctions.component.scss']
})
export class ScheduledAuctionsComponent implements OnInit {
  selectedData: any = [];
  pageRecordSize: any;
  pageOptions: any;
  @Input('isBidNow') isBidNow : any;
  scheduledAuctionHeaders: any = [
      { field: 'rank', header: 'Rank', isLink: false },
      { field: 'dop', header: 'Date Of Participation', isLink: false },
      { field: 'name', header: 'Auction Name', isLink: false },
      { field: 'quantity', header: 'Quantity', isLink: false },
      { field: 'bidPrice', header: 'My Bid Price', isLink: false }
  ];
  paginatoryDetails: any;
  scheduledAuctionTableData: any = [];

constructor( private modalDialog: MatDialog) {

 }

 getStaticAuctions(){
  this.scheduledAuctionTableData = [
    {
      rank: 1,
      dop: '10-Jul-2020 10.00AM',
      name: 'Electronic Goods',
      quantity: 10,
      bidPrice: 90000
    }, {
      rank: 1,
      dop: '11-Jul-2020 10.00AM',
      name: 'Electronic Goods',
      quantity: 10,
      bidPrice: 905000
    }, {
      rank: 1,
      dop: '13-Jul-2020 10.00AM',
      name: 'Electronic Goods',
      quantity: 10,
      bidPrice:110000
    }, {
      rank: 1,
      dop: '01-Jul-2020 10.00AM',
      name: 'Electronic Goods',
      quantity: 10,
      bidPrice:130000
    }, {
      rank: 1,
      dop: '02-Jul-2020 10.00AM',
      name: 'Electronic Goods',
      quantity: 10,
      bidPrice: 10000
    },
  ]
 }

ngOnInit() {
  console.log('isBidNow',this.isBidNow)
  this.getStaticAuctions();
  this.pageRecordSize = AppApiConfig.GRID_PAGE_INFO.initpageSize;
  this.pageOptions = AppApiConfig.GRID_PAGE_INFO.pageOptions;


}

bidNow(rowData) {
  const dialogConfig = new MatDialogConfig();

  // dialogConfig.disableClose = true;
  dialogConfig.autoFocus = true;
  dialogConfig.data = rowData;
  dialogConfig.width = '120%';
  dialogConfig.height = '100vh';

  const dialogRef = this.modalDialog.open(LiveAuctionModalComponent, dialogConfig).afterClosed()
  .subscribe(result => {
     
  });

}

}
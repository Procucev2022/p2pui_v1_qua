import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-create-sealed-bid-auction',
  templateUrl: './create-sealed-bid-auction.component.html',
  styleUrls: ['./create-sealed-bid-auction.component.scss']
})
export class CreateSealedBidAuctionComponent implements OnInit {

  auctionName;
  auctionCategory = 'Sealed Bid';
  auctionStartDate;
  auctionEndDate;
  min = new Date();
  auctionRunningTime;
  constructor() { }

  ngOnInit() {
  }

  onCreateBid() {

  }

}

import { Component, OnInit, Inject } from '@angular/core';
import { AppApiConfig } from 'src/app/shared/constants/app-api.config';
import { EncryDecryService } from 'src/app/shared/services';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
@Component({
  selector: 'app-live-auction-modal',
  templateUrl: './live-auction-modal.component.html',
  styleUrls: ['./live-auction-modal.component.scss']
})
export class LiveAuctionModalComponent implements OnInit {

  auctionItemsHeaders  = [
    { field: 'description', header: 'Item Description'  , isLink: false, width: '166px', fieldType: 'label'},
    { field: 'brand', header: 'Specifications'  , isLink: false, width: '165px', fieldType: 'label'},
    { field: 'unitofMeasures', header: 'UOM'  , isLink: false, width: '168px', fieldType: 'label'},
    { field: 'quantity', header: 'Quantity'  , isLink: false, width: '130px', fieldType: 'label'},
    { field: 'totalamount', header: 'Total amount'  , isLink: false, width: '130px', fieldType: 'label'},
    { field: 'bidAmount', header: 'Bid amount'  , isLink: false, width: '130px', fieldType: 'text'},
  ];
  auctionItemsList = [];
  pageRecordSize;
  pageOptions;
  defaultPermissions: any;
  loggedUserDetails: any;
  loggedUserPermissions: any;
  paginatoryDetails: any;
  bidTotalAmount = 0;

  constructor(private encryDecryService: EncryDecryService, @Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit() {
    this.defaultPermissions = AppApiConfig.DEFAULT_PERMISSIONS;
    const temp =  JSON.parse(this.encryDecryService.get('perm', localStorage.getItem('logData')) );
    this.loggedUserDetails = temp.details;

    this.loggedUserPermissions = this.loggedUserDetails.listofPermission;
    this.pageRecordSize = AppApiConfig.GRID_PAGE_INFO.initpageSize;
    this.pageOptions = AppApiConfig.GRID_PAGE_INFO.pageOptions;
    this.auctionItemsList = [...this.data.auctionItems];
    this.auctionItemsList.push({
         brand: 'Laptop mobile charger',
        category: 'IT',
        createdBy: null,
        createdTS: '2020-08-01T17:18:37.000+0000',
        description: 'HP or DELL',
        discountType: '1',
        discountValue: 3,
        gstPercentage: '34',
        gstValue: '3',
        id: '3060f6a3-6e81-4d7c-a948-29e1a4cac9337',
        itemcode: '8.4071451E7',
        lastModifiedBy: null,
        lastModifiedTS: '2020-08-01T17:18:37.000+0000',
        pritemId: '0e6146cb-7109-486f-b9ad-f3287c3e7e2a',
        quantity: 10,
        rfqitemId: '0edcaaae-0acb-4d3a-b4c6-17938023ee69',
        totalamount: 120,
        unitofMeasures: 'pcs',
        unitprice: 3,
        vendorId: '1334'
    });
    this.auctionItemsList.push({
      brand: 'Mobile charger',
     category: 'IT',
     createdBy: null,
     createdTS: '2020-08-01T17:18:37.000+0000',
     description: 'HP or DELL',
     discountType: '1',
     discountValue: 3,
     gstPercentage: '34',
     gstValue: '3',
     id: '3060f6a3-6e81-4d7c-a948-29e1a4cac9312',
     itemcode: '8.4071451E7',
     lastModifiedBy: null,
     lastModifiedTS: '2020-08-01T17:18:37.000+0000',
     pritemId: '0e6146cb-7109-486f-b9ad-f3287c3e7e2a',
     quantity: 10,
     rfqitemId: '0edcaaae-0acb-4d3a-b4c6-17938023ee69',
     totalamount: 120,
     unitofMeasures: 'pcs',
     unitprice: 3,
     vendorId: '1334'
 });
    this.auctionItemsList.forEach(element => {
      element['bidAmount'] = element.totalamount;
      this.bidTotalAmount = this.bidTotalAmount + (element.quantity * element.bidAmount);
    });

    console.log('itemslist', this.auctionItemsList);
  }

  onPage(event) {
    this.paginatoryDetails = event;
  }

  ongetTotalBid(rowData) {
    this.bidTotalAmount  = 0;
    this.auctionItemsList.forEach(element => {
      this.bidTotalAmount =  this.bidTotalAmount + (element.quantity * element.bidAmount);
    });
  }

}

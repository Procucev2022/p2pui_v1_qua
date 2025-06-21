import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { BfsItemsService } from '../bfs-items.service';

@Component({
  selector: 'app-seller-buyer-details-by-unique-id',
  templateUrl: './seller-buyer-details-by-unique-id.component.html',
  styleUrls: ['./seller-buyer-details-by-unique-id.component.scss']
})
export class SellerBuyerDetailsByUniqueIdComponent implements OnInit {
    buyersHeaders: any = [
        { field: 'specification', header: 'Specification ', isLink: false, width: '220px', fieldType: 'text', isExceedContent: true },
        // { field: 'buyerCompanyName', header: 'Buyer Company Name', isLink: false, width: '120px', fieldType: 'text', isExceedContent: true },
        { field: 'sellPrice', header: 'Seller Price(Per Unit)', isLink: false, width: '190px', fieldType: 'text', isExceedContent: true },
        { field: 'buyPrice', header: 'Buyer Price(Per Unit)', isLink: false, width: '130px', fieldType: 'text', isExceedContent: false },
        { field: 'unitofMeasures', header: 'UOM', isLink: false, width: '130px', fieldType: 'text', isExceedContent: false },
        { field: 'status', header: 'Status', isLink: false, width: '120px', fieldType: 'text', isExceedContent: false },
        // { field: 'buyerDiscount', header: 'Buyer Discount', isLink: false, width: '120px', fieldType: 'text', isExceedContent: false }
    ];
    paginatoryDetails: any;
    pageRecordSize: any;
    pageOptions: any;
    bfsBuyersList: any[];
    uniqueId: any = '';
    detailsSellerBuyer: any;
    isSearched: boolean;
  constructor(private toaster: ToastrService, private bfsService: BfsItemsService) { }

  ngOnInit() {
  }

  searchByUniqueId(){
    this.isSearched=false;
    if(!this.uniqueId){
        this.toaster.warning("Please Enter UniqueId", "Warning");
        return
    }

    this.bfsService.uniqueIdDetails({uniqueId: this.uniqueId}).subscribe((res:any)=>{
        if(res && res.id){
            this.detailsSellerBuyer= res;
        }else{
            this.toaster.error(res.errorMessage, "Error");
            this.detailsSellerBuyer= null;
        }
        this.isSearched=true;
    })

  }




}

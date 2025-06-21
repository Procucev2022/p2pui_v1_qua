import { Component, OnInit, Input } from '@angular/core';
import { CatProcuQuotationsService } from '../../services';
import { AppApiConfig } from 'src/app/shared/constants/app-api.config';

@Component({
  selector: 'app-cat-mgr-quot-sub-tab-line-items',
  templateUrl: './cat-mgr-quot-sub-tab-line-items.component.html',
  styleUrls: ['./cat-mgr-quot-sub-tab-line-items.component.scss']
})
export class CatMgrQuotSubTabLineItemsComponent implements OnInit {

    @Input('quotData') quotData: any;
    constructor(private quotService: CatProcuQuotationsService) { }
    lineItemsTableHeaders: any = [
        { field: 'description', header: 'Description', isLink: false, width:'256px' , isExceedContent: true},
        { field: 'brand', header: 'Specifications', isLink: false , width:'140px', isExceedContent: true},
        //{ field: 'category', header: 'Category', isLink: false , width:'130px', isExceedContent: false},
        //{ field: 'itemcode', header: 'Item Code', isLink: false , width:'130px', isExceedContent: false},
        { field: 'quantity', header: 'QTY', isLink: false , width:'80px', isExceedContent: false},
        { field: 'unitofMeasures', header: 'UOM', isLink: false , width:'80px', isExceedContent: false},
        { field: 'unitprice', header: 'Unit Price', isLink: false , width:'120px', isExceedContent: false},
        // { field: 'cgstPercentage', header: 'CGST %', isLink: false , isExceedContent: false},
        // { field: 'cgstValue', header: 'CGST Value', isLink: false },
        { field: 'gstPercentage', header: 'GST %', isLink: false , width:'100px', isExceedContent: false},
        { field: 'gstValue', header: 'GST Value', isLink: false , width:'120px', isExceedContent: false},
        //{ field: 'discountType', header: 'Discount Type', isLink: false , width:'150px', isExceedContent: false},
        //{ field: 'discountValue', header: 'Discount Value', isLink: false , width:'150px', isExceedContent: false},
        { field: 'totalamount', header: 'Total Amount', isLink: false , width:'140px', isExceedContent: false},
    ];
    lineItemsList: any  = [];
    paginatoryDetails: any;
    selectedPrData: any;
    pageRecordSize: any;
    pageOptions: any;
    ngOnInit() {
      this.pageRecordSize = AppApiConfig.GRID_PAGE_INFO.initpageSize;
      this.pageOptions = AppApiConfig.GRID_PAGE_INFO.pageOptions;
      this.getLineItems();
    }

    getLineItems(){
      let req = {'id': this.quotData.id}
      this.quotService.getLineItemsByQuot(req).subscribe((response)=>{
        // if(response.status == 'Success'){
            this.lineItemsList = Array.isArray(response) ? response : []
        // }
      })
    }

    ngOnChanges() {
      if(this.quotData.id)
      this.getLineItems();
    }

  }

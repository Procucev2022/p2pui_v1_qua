import { Component, Input, OnInit } from '@angular/core';
import { AppApiConfig } from 'src/app/shared/constants/app-api.config';
import { PoService } from 'src/app/shared/modules/common-share/services/po.service';

@Component({
  selector: 'app-po-items',
  templateUrl: './po-items.component.html',
  styleUrls: ['./po-items.component.scss']
})
export class PoItemsComponent implements OnInit {
  @Input('poData') poData: any;
  @Input('poId') poId:any;
  paginatoryDetails;
  pageRecordSize: number;
  pageOptions: number[];
  constructor(private  poService: PoService) { }
  poItemsHeaders: any = [
    { field: 'description', header: 'Description', isLink: false, width: '180px' },
    { field: 'brand', header: 'Specification', isLink: false, width: '180px' },
    { field: 'quantity', header: 'PO Quantity', isLink: false, width: '140px' },
    { field: 'unitofMeasures', header: 'UOM', isLink: false, width: '120px' },
    { field: 'excludetaxamount', header: 'Basic Amount', isLink: false, width: '140px' },
    { field: 'gstValue', header: 'GST Value', isLink: false, width: '120px' },
    { field: 'totalamount', header: 'Total Amount', isLink: false, width: '140px' },
];
  poLineItemsData = [];
  selectedData =[];
  ngOnInit() {
    this.pageRecordSize = AppApiConfig.GRID_PAGE_INFO.initpageSize;
    this.pageOptions = AppApiConfig.GRID_PAGE_INFO.pageOptions;
   this.getPOItemsData();
  }

  getPOItemsData(){
    this.poService.getItemsByPO({id: this.poData.id}).subscribe((res)=>{
      if(Array.isArray(res)){
        this.poLineItemsData = [...res]
      }else{
        this.poLineItemsData =[]
      }
    })
  }

  ngOnChanges() {
    if(this.poId){
      this.getPOItemsData();
    }
 }

}

import { Component, OnInit, OnChanges, Input } from '@angular/core';
import { CatProcuRequestsService } from '../../services/cat-procu-requests.service';
import { AppConfig } from 'src/app/app.config';

@Component({
  selector: 'app-cat-mgr-rfqs-line-items-sub-tab',
  templateUrl: './cat-mgr-rfqs-line-items-sub-tab.component.html',
  styleUrls: ['./cat-mgr-rfqs-line-items-sub-tab.component.scss']
})
export class CatMgrRfqsLineItemsSubTabComponent implements OnInit, OnChanges {


  @Input('rfqData') rfqData: any;
  @Input('rfqId') rfqId: any;
  rfqLineItemsList: any = [];
  selectedData: any;
  selecteLineItemData: any;
  paginatoryDetails: any;
  pageRecordSize: any;
  pageOptions: any;
  constructor(private procuReqService: CatProcuRequestsService) { }
  rfqLineItemTableHeaders: any = [
    { field: 'serialNo', header: 'S.No', isLink: false, width:'70px' },
    { field: 'description', header: 'Item Description'  , isLink: false,width:'206px'},
    { field: 'brand', header: 'Specifications'  , isLink: false, width:'100px'},
    { field: 'unitofMeasures', header: 'UOM'  , isLink: false, width:'80px'},
    { field: 'quantity', header: 'Quantity'  , isLink: false ,width:'80px'},
    // { field: 'createdTS', header: 'Creation Date.'  , isLink: false},
    // { field: 'createdBy', header: 'created By'  , isLink: false},
  ];

  ngOnInit() {
    this.pageRecordSize = AppConfig.GRID_PAGE_INFO.initpageSize;
    this.pageOptions = AppConfig.GRID_PAGE_INFO.pageOptions;
    this.getRfqLists();
  }

  getRfqLists() {
    console.log('this.rfqData.prId', this.rfqData.prId);
    let req = {
      'id': this.rfqData.id
    }
    this.procuReqService.getLineItemsByRfq(req).subscribe( (data: any[] ) => {
         if(Array.isArray(data)){
          this.rfqLineItemsList = data;
         }else{
           this.rfqLineItemsList = [];
         }
    });
   }

   ngOnChanges() {
     if(this.rfqId){
      this.getRfqLists();
    }
  }

  getRFQs(rowData) {
    this.selecteLineItemData = rowData;
    this.selectedData = [rowData];
  }

  onPage(event) {
    this.paginatoryDetails = event;
  }

}

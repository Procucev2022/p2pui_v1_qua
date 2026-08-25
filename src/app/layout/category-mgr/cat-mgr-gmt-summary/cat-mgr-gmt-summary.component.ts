import { CreateRfqService } from './../services/create-rfq.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-cat-mgr-gmt-summary',
  templateUrl: './cat-mgr-gmt-summary.component.html',
  styleUrls: ['./cat-mgr-gmt-summary.component.scss']
})
export class CatMgrGmtSummaryComponent implements OnInit {
    isLoaded: boolean = false;
    itemCartTableHeaders: any = [
        { field: 'fullName', header: 'Name', isLink: false, width: '120px', fieldType: 'text', isExceedContent: true },
        { field: 'rfqCount', header: 'RFQ Count', isLink: false, width: '120px', fieldType: 'text', isExceedContent: false },
        { field: 'client', header: 'Clients', isLink: false, width: '120px', fieldType: 'text', isExceedContent: false },
 ];

    itemGridData: { gridHeaders: Array<any>, gridValue: Array<any>, actionsList: Array<any>, isMultiSelectAllows: boolean, gridEmptyMsg: string } = {
        gridHeaders: this.itemCartTableHeaders,
        gridValue: [],
        actionsList: [
            { 'eventName': 'onEditItem', 'eventImg': 'quote-count', 'eventDesc': 'Quote Count', 'cssClass': 'quote-count-cls' }
            // , { 'eventName': 'onDeleteItem', 'eventImg': 'delete', 'eventDesc': 'Delete Item' }
        ],
        isMultiSelectAllows: false, gridEmptyMsg: 'No Data Available'
    }
  constructor(private createRfqService: CreateRfqService) { }

  ngOnInit() {
    this.itemGridData.gridValue =[];
    this.createRfqService.getGMTSummary().subscribe((res:any) =>{
        if(res && Array.isArray(res)){
            this.itemGridData.gridValue = res.map(ele =>{ return {...ele, isSummaryScreen: true, isSendRFQToVendorScreen: false}});

        }
        setTimeout(() => {
            this.isLoaded =true;
        }, 200);
    })
    this.isLoaded= true;
  }

  onGridAction(event:any){
    console.log(event)
  }

}

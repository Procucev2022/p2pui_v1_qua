import { Component, OnInit, Input, OnChanges } from '@angular/core';
import { CatProcuQuotationsService } from '../../services';
import { AppApiConfig } from 'src/app/shared/constants/app-api.config';

@Component({
  selector: 'app-cat-mgr-quot-sub-tab-pr-details',
  templateUrl: './cat-mgr-quot-sub-tab-pr-details.component.html',
  styleUrls: ['./cat-mgr-quot-sub-tab-pr-details.component.scss']
})
export class CatMgrQuotSubTabPrDetailsComponent implements OnInit, OnChanges{

    @Input('quotData') quotData: any;
    constructor(private quotService: CatProcuQuotationsService) { }
    prTableHeaders: any = [
      { field: 'prId', header: 'PR Id'  , isLink: false, width:'150px', fieldType: 'text'},
      { field: 'procucevStatus', header: 'Status'  , isLink: false , width:'130px', fieldType: 'text'},
      { field: 'priority', header: 'Priority' , isLink: false , width:'130px',fieldType: 'text'},
      { field: 'createdTS', header: 'Creation Date' , isLink: false  , width:'205px',fieldType: 'date'},
      { field: 'dueDate', header: 'Due Date' , isLink: false, width:'205px', fieldType: 'date'},
      { field: 'createdBy', header: 'Created By' , isLink: false , width:'135px', fieldType: 'text'},
    ];
    prTableData: any  = [];
    paginatoryDetails: any;
    selectedPrData: any;
    rfqsList: Object;
    pageRecordSize: any;
    pageOptions: any;
    ngOnInit() {
      this.pageRecordSize = AppApiConfig.GRID_PAGE_INFO.initpageSize;
      this.pageOptions = AppApiConfig.GRID_PAGE_INFO.pageOptions;
      this.getPRData();
    }

    getPRData() {
      let req = {'id': this.quotData.id}
      this.quotService.getPRByQuotation(req).subscribe((response)=> {
        // if(response.status == 'Success'){
          if(response.id) {
            this.prTableData = [response]
          }
        // }
      });
    }

    ngOnChanges() {
      if (this.quotData.id) {
      this.getPRData();
      }
    }

  }

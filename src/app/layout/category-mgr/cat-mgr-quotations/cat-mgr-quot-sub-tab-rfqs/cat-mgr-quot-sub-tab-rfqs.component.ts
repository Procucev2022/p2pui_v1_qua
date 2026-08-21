import { Component, OnInit, Input, OnChanges } from '@angular/core';
import { CatProcuQuotationsService } from '../../services';
import { AppApiConfig } from 'src/app/shared/constants/app-api.config';

@Component({
  selector: 'app-cat-mgr-quot-sub-tab-rfqs',
  templateUrl: './cat-mgr-quot-sub-tab-rfqs.component.html',
  styleUrls: ['./cat-mgr-quot-sub-tab-rfqs.component.scss']
})
export class CatMgrQuotSubTabRfqsComponent implements OnInit , OnChanges {

    @Input('quotData') quotData: any;
    constructor(private quotService: CatProcuQuotationsService) { }
    lineItemsTableHeaders: any = [
      { field: 'rfqId', header: 'RFQ ID'  , isLink: false, fieldType: 'text'},
      { field: 'numberOfItems', header: 'No. Of Items'  , isLink: false, fieldType: 'text'},
      { field: 'rfqStatus', header: 'Status'  , isLink: false, fieldType: 'text'},
      { field: 'createdTS', header: 'Creation Date.'  , isLink: false, fieldType: 'date'},
      { field: 'createdBy', header: 'created By'  , isLink: false, fieldType: 'text'}
    ];
    lineItemsList: any  = [];
    paginatoryDetails: any;
    selectedPrData: any;
    rfqsList: any = [];
    pageRecordSize: any;
    pageOptions: any;
    ngOnInit() {
      this.pageRecordSize = AppApiConfig.GRID_PAGE_INFO.initpageSize;
      this.pageOptions = AppApiConfig.GRID_PAGE_INFO.pageOptions;
      this.getRfqs();
    }

    getRfqs() {
      const req = {'id': this.quotData.id};
      this.quotService.getRFQsByQuot(req).subscribe((response) => {
        if (response.id) {
            this.lineItemsList =  [response];
        }
        // }
      });
    }

    ngOnChanges() {
      if (this.quotData.id) {
      this.getRfqs();
      }
    }

  }

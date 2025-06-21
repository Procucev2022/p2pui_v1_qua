import { Component, OnInit, Input, OnChanges } from '@angular/core';
import { CatProcuQuotationsService } from '../../services';
import { AppApiConfig } from 'src/app/shared/constants/app-api.config';

@Component({
  selector: 'app-cat-mgr-quot-sub-tab-vendors',
  templateUrl: './cat-mgr-quot-sub-tab-vendors.component.html',
  styleUrls: ['./cat-mgr-quot-sub-tab-vendors.component.scss']
})
export class CatMgrQuotSubTabVendorsComponent implements OnInit, OnChanges {

    @Input('quotData') quotData: any;
    constructor(private quotService: CatProcuQuotationsService) { }
    prTableHeaders: any = [
      { field: 'companyId', header: 'Vendor Id'  , isLink: false, fieldType: 'text', width: '230px', isExceedContent: false},
      { field: 'companyName', header: 'Company Name'  , isLink: false, fieldType: 'text', width: '160px', isExceedContent: true},
      { field: 'address1', header: 'Address' , isLink: false, fieldType: 'text', width: '160px', isExceedContent: false},
      { field: 'city', header: 'City' , isLink: false, fieldType: 'text', width: '160px', isExceedContent: false},
      { field: 'licenseValidDate', header: 'License Validity' , isLink: false, fieldType: 'date', width: '160px', isExceedContent: false},
      { field: 'createdBy', header: 'Created By' , isLink: false, fieldType: 'text', width: '160px', isExceedContent: false}
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
      const req = {'id': this.quotData.id};
      this.quotService.getVendorsByQuot(req).subscribe((response) => {
        // if(response.status == 'Success'){
          if (response.id) {
            this.prTableData = [response];
          }
        // }
      });
    }

    ngOnChanges() {
      if (this.quotData) {
        this.getPRData();
      }
    }
  }

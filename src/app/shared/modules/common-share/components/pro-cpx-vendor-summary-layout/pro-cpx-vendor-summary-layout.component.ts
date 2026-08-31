import { Component, OnInit } from '@angular/core';
import { AppConfig } from 'src/app/app.config';
import { CatProcuQuotationsService, CatProcuRequestsService } from 'src/app/layout/category-mgr/services';
import { EncryDecryService } from 'src/app/shared/services';

@Component({
  selector: 'app-pro-cpx-vendor-summary-layout',
  templateUrl: './pro-cpx-vendor-summary-layout.component.html',
  styleUrls: ['./pro-cpx-vendor-summary-layout.component.scss']
})
export class ProCpxVendorSummaryLayoutComponent implements OnInit {
    loggedUserDetails: any;
    pageRecordSize: any;
    pageOptions: any;
    isCM = false;

    constructor( private procuReqService: CatProcuRequestsService,
        private quotsService: CatProcuQuotationsService,
        private encryDecryService: EncryDecryService) { }

  ngOnInit() {
    const temp = JSON.parse(this.encryDecryService.get(localStorage.getItem('logData')));
        this.loggedUserDetails = temp.details;
        this.pageRecordSize = AppConfig.GRID_PAGE_INFO.initpageSize;
        this.pageOptions = AppConfig.GRID_PAGE_INFO.pageOptions;
        if (!(this.loggedUserDetails.role.roleName === "ClientApprover" || this.loggedUserDetails.role.roleName === "ClientInitiator")) { //CM Role
            this.isCM= true;
        }
  }
    getAllClients() {
        throw new Error('Method not implemented.');
    }

}

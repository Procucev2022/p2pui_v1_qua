import { Component, OnInit } from '@angular/core';
import { AppConfig } from 'src/app/app.config';
import { CatProcuQuotationsService, CatProcuRequestsService } from 'src/app/layout/category-mgr/services';
import { EncryDecryService } from 'src/app/shared/services';

@Component({
    selector: 'app-pro-cpx-vendor-summary-clients',
    templateUrl: './pro-cpx-vendor-summary-clients.component.html',
    styleUrls: ['./pro-cpx-vendor-summary-clients.component.scss']
})
export class ProCpxVendorSummaryClientsComponent implements OnInit {
    loggedUserDetails: any;
    pageRecordSize: any;
    pageOptions: any;
    clientsList: any[];
    expandedRows: {} = {};
    clientTableHeaders: any = [
        { field: 'companyId', header: 'Client Id', isLink: true, width: '240px', fieldType: 'text', isExceedContent: false },
        { field: 'companyName', header: 'Client Name', isLink: false, width: '150px', fieldType: 'text', isExceedContent: true },
        { field: 'clientCategory', header: 'Category', isLink: false, width: '150px', fieldType: 'text', isExceedContent: true },
        { field: 'city', header: 'City', isLink: false, width: '150px', fieldType: 'text', isExceedContent: false },
        { field: 'clientVertical', header: 'Client Vertical', isLink: false, width: '205px', fieldType: 'text', isExceedContent: false }
    ];
    selectedClientData: any;
    selectedClient: any[];
    constructor(private procuReqService: CatProcuRequestsService,
        private quotsService: CatProcuQuotationsService,
        private encryDecryService: EncryDecryService) { }

    ngOnInit() {
        const temp = JSON.parse(this.encryDecryService.get(localStorage.getItem('logData')));
        this.loggedUserDetails = temp.details;
        this.pageRecordSize = AppConfig.GRID_PAGE_INFO.initpageSize;
        this.pageOptions = AppConfig.GRID_PAGE_INFO.pageOptions;
        if (!(this.loggedUserDetails.role.roleName === "ClientApprover" || this.loggedUserDetails.role.roleName === "ClientInitiator")) { //CM Role
            this.getAllClients();
        }
    }
    getAllClients() {
        this.procuReqService
            .getClientsForVendorSummaryCM()
            .subscribe(data => {
                this.clientsList = Array.isArray(data) ? [...data] : [];
                console.log('this.pre', this.clientsList);
            });
    }

      // getRFQs list
      getLinkedVendors(selectedClient) {
        this.expandedRows = {};
        const thisRef = this;
        thisRef.expandedRows[selectedClient.id] = 1;

        this.selectedClient = [selectedClient];
        this.selectedClientData = Object.assign({}, selectedClient);
        // this.getPPOsByVendorId(selectedClient);
        // this.h1.nativeElement.scrollIntoView({behavior: 'smooth'});

    }



    getCloseLinkedVendors(selectedRowData, event) {
        this.expandedRows = {};
    }

}

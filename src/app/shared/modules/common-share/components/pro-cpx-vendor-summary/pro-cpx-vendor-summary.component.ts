import { EncryDecryService } from 'src/app/shared/services';
import { Component, ElementRef, Input, OnChanges, OnInit, ViewChild, SimpleChanges } from '@angular/core';
 
import { AppConfig } from 'src/app/app.config';
import { CatProcuQuotationsService, CatProcuRequestsService } from 'src/app/layout/category-mgr/services';
import { MatDialog } from '@angular/material/dialog';

@Component({
    selector: 'app-pro-cpx-vendor-summary',
    templateUrl: './pro-cpx-vendor-summary.component.html',
    styleUrls: ['./pro-cpx-vendor-summary.component.scss']
})
export class ProCpxVendorSummaryComponent implements OnInit, OnChanges {
    @Input('clientData') clientData: any;
    @Input('screenTitle') screenTitle: string = 'Vendors'
    vendorList: any = [];
    selectedVendorsList: any;
    @ViewChild('h1') h1: ElementRef;
    quotTableHeaders: any = [
        { field: 'companyId', header: 'Vendor Id', isLink: true, width: '240px', fieldType: 'text', isExceedContent: false },
        { field: 'vendorName', header: 'Vendor Name', isLink: false, width: '150px', fieldType: 'text', isExceedContent: true },
        { field: 'subCategory', header: 'Category', isLink: false, width: '150px', fieldType: 'text', isExceedContent: true },
        { field: 'city', header: 'Location', isLink: false, width: '150px', fieldType: 'text', isExceedContent: false },
        { field: 'phone', header: 'Mobile', isLink: false, width: '150px', fieldType: 'text', isExceedContent: false },
        { field: 'vendorRank', header: 'Class', isLink: false, width: '205px', fieldType: 'text', isExceedContent: false }
    ];

    paginatoryDetails: any;


    selectedVendorData: any;
    rfqsList: Object;
    pageRecordSize: any;
    pageOptions: any;
    expandedRows: {} = {};
    loggedUserDetails: any;


    constructor(
        private procuReqService: CatProcuRequestsService,
        private quotsService: CatProcuQuotationsService,
        private modalDialog: MatDialog,
        private encryDecryService: EncryDecryService) { }

    ngOnInit() {

        if ((this.loggedUserDetails.role.roleName === "ClientApprover" || this.loggedUserDetails.role.roleName === "ClientInitiator")) { //CM Role
        this.getVendorListByClient();
        }

    }

    ngOnChanges(changes: SimpleChanges): void {
        const temp = JSON.parse(this.encryDecryService.get('perm', localStorage.getItem('logData')));
        this.loggedUserDetails = temp.details;
        this.pageRecordSize = AppConfig.GRID_PAGE_INFO.initpageSize;
        this.pageOptions = AppConfig.GRID_PAGE_INFO.pageOptions;
            if (changes && changes.clientData &&  !!changes.clientData.currentValue) {
                this.getVendorListByClient();
            }
    }

    getVendorListByClient() {
        let reqObj: any;
        if (!((this.loggedUserDetails && this.loggedUserDetails.role )&& this.loggedUserDetails.role.roleName === "ClientApprover" || this.loggedUserDetails.role.roleName === "ClientInitiator")) { //CM Role
            reqObj = {"id":  this.clientData.id} ;
        } else {
            reqObj = { id: this.loggedUserDetails.org.id }
        }
        this.quotsService
            .getVendorsByClientId(reqObj)
            .subscribe(data => {
                this.vendorList = Array.isArray(data) ? data.map((ele:any)=>{
                    return {...ele, id: ele.vendorId}
                }) : [];
                console.log('this.pre', this.vendorList);

            });
    }

    // getRFQs list
    getRFQs(selectedVendor) {
        this.expandedRows = {};
        const thisRef = this;
        thisRef.expandedRows[selectedVendor.id] = 1;

        this.selectedVendorsList = [selectedVendor];
        this.selectedVendorData = Object.assign({}, selectedVendor);
        // this.h1.nativeElement.scrollIntoView({behavior: 'smooth'});
    }



    getCloseRFQs(selectedRowData, event) {
        this.expandedRows = {};
    }

    getLineItems(event) {
        // alert('helel');
        console.log('clicked tab lienitmes', event);

    }

    onPage(event) {
        this.paginatoryDetails = event;
    }


    viewQuotDetails(rowData) {
        //   const quotModalDialog = this.modalDialog.open(QuotViewDetailsComponent,  {data: rowData, width: '80%'});
    }


}

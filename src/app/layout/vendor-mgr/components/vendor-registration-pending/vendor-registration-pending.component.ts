import { Component, OnInit, ViewChild } from '@angular/core';
import { AppConfig } from 'src/app/app.config';
import { VendorMgrService } from '../../services/vendor-mgr.service';
import { ToastrService } from 'ngx-toastr';
import { MatDialog } from '@angular/material/dialog';

@Component({
    selector: 'vendor-reg-pending',
    templateUrl: './vendor-registration-pending.component.html',
    styleUrls: ['./vendor-registration-pending.component.scss']
})
export class VendorRegistrationPendingComponent implements OnInit {

    vendorRegPendingList: any = [];

    vendorRegPendingHeaders: any = [
        { field: 'vendorName', header: 'Name', isLink: false, width: '215px' },
        { field: 'companyId', header: 'Vendor ID', width: '135px' },
        { field: 'vendorEmail', header: 'Email', isLink: false, width: '165px' },
        { field: 'vendorPhone', header: 'Mobile No', isLink: false, width: '115px' },
        { field: 'vendorStatus', header: 'Status', isLink: false, width: '135px', fieldType: 'text' }
    ];
    selectedData: any;
    paginatoryDetails: any;
    pageRecordSize: any;
    pageOptions: any;

    constructor(private vendMgrSer: VendorMgrService, private toaster: ToastrService,
        private dialog: MatDialog,) { }

    ngOnInit() {
        this.pageRecordSize = AppConfig.GRID_PAGE_INFO.initpageSize;
        this.pageOptions = AppConfig.GRID_PAGE_INFO.pageOptions;
        this.getVendorPendingRegistrationData();
    }

    getVendorPendingRegistrationData() {
        this.vendorRegPendingList = [];
        this.vendMgrSer.getAllVendorsByVendorRegistrationPending().subscribe((res: any) => {
            if (res) {
                res.forEach(element => {
                    element['status'] = element['status']['uiDisplay'];
                    element['vendorStatus'] = element['vendorStatus']['uiDisplay'];
                    element['isChecked'] = false;
                });
                this.vendorRegPendingList = res;
            } else {
                //this.toaster.error(res.message, 'Failure')
            }
        })
    }


    onPage(event) {
        this.paginatoryDetails = event;
    }

}

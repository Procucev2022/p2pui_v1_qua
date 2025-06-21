import { Component, OnInit } from '@angular/core';
import { VendorReqService } from '../../services/vendor-req.service';
import { AppApiConfig } from 'src/app/shared/constants/app-api.config';
import { VendorReqModalComponent } from '../vendor-req-modal/vendor-req-modal.component';
import { MatDialog } from '@angular/material/dialog';
import { VenReqViewModalComponent } from '../ven-req-view-modal/ven-req-view-modal.component';
import { ToastrService } from 'ngx-toastr';
import { ReqCompletedModalComponent } from '../req-completed-modal/req-completed-modal.component';
import { EncryDecryService } from 'src/app/shared/services';

@Component({
    selector: 'app-vendor-request',
    templateUrl: './vendor-request.component.html',
    styleUrls: ['./vendor-request.component.scss']
})
export class VendorRequestComponent implements OnInit {
    pageRecordSize: any;
    pageOptions: any;
    paginatoryDetails: any;
    defaultPermissions: any;
    loggedUserPermissions: any;
    loggedUserData: any;

    constructor(private vendorReqSer: VendorReqService,
        private modalDialog: MatDialog,
        private toaster: ToastrService,
        private encryDecryService: EncryDecryService) { }
    selectedData: any = [];
    vendorReqData: any = [];
    vendorReqHeaders: any = [
        // { field: 'id', header: 'Id', isLink: false },
        { field: 'type', header: 'Type', isLink: false , width:'170px' },
        { field: 'description', header: 'Description', isLink: false , width:'210px' },
        { field: 'code', header: 'HSN/SAC code', isLink: false, width:'170px'  },
        { field: 'priority', header: 'Priority', isLink: false, width:'170px'  },
        { field: 'procucevStatus', header: 'Status', isLink: false, width:'170px'  },

    ];

    ngOnInit() {
        this.pageRecordSize = AppApiConfig.GRID_PAGE_INFO.initpageSize;
        this.pageOptions = AppApiConfig.GRID_PAGE_INFO.pageOptions;
        this.defaultPermissions = AppApiConfig.DEFAULT_PERMISSIONS;
        const temp =  JSON.parse(this.encryDecryService.get('perm', localStorage.getItem('logData')) );
        this.loggedUserData = temp;
        this.loggedUserPermissions = temp.details.listofPermission;
        this.getAllReqVendors();
    }

    getAllReqVendors() {
        this.vendorReqSer.getAllReqVendors().subscribe((res: any) => {
            if (Array.isArray(res)) {
                this.vendorReqData = res;
            }
        });
    }

    createVendorReq() {
        const dialog =  this.modalDialog.open(VendorReqModalComponent, {
            width: '920px',
          });

       dialog.afterClosed().subscribe(result => {
        if (result.event === 'submit') {
            this.getAllReqVendors();
        }
        });
    }

    view(rowData) {
        const dialog =  this.modalDialog.open(VenReqViewModalComponent, {
            width: '920px',
            data: rowData
          }, );

       dialog.afterClosed().subscribe(result => {

        });
    }

    inProgress() {
        let check = false;
        this.selectedData.forEach(data => {
            if (data.procucevStatus.uiDisplay !== 'New') {
                check = true;
                return;
            }
        });

        if (check) {
            this.toaster.error('The selected requests may contain inprogress or completed. Please sect only new requests', 'Failure');
            return;
        }
        if (this.hasSelectedData()) {
            this.vendorReqSer.inProgress(this.selectedData).subscribe((res: any) => {
                this.showToaster(res);

            });
        }
    }

    closeReq() {
        if (this.hasSelectedData()) {
            this.vendorReqSer.closeRequest(this.selectedData).subscribe((res: any) => {
               this.showToaster(res);
            });
        }
    }

    reqCompleted() {
        if (this.hasSelectedData()) {
            const dialog =  this.modalDialog.open(ReqCompletedModalComponent, {
                width: '920px',
                data: this.selectedData
              });

           dialog.afterClosed().subscribe(result => {
            if (result.event === 'submit') {
                this.getAllReqVendors();
                this.selectedData = [];
            }
            });

        }
    }

    showToaster(res) {
        if (res.statusCode === 'Success') {
            this.toaster.success(res.errorMessage, 'Success');
            this.getAllReqVendors();
            this.selectedData = [];
        } else {
            this.toaster.error(res.errorMessage, 'Failure');
        }
    }

    hasSelectedData() {
        if (this.selectedData.length) {
            return true;
        } else {
            this.toaster.error('Please select atleast one record!', 'Failure');
            return false;
        }
    }
}

import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { AppApiConfig } from 'src/app/shared/constants/app-api.config';
import { EncryDecryService } from 'src/app/shared/services';
import { VendorReqService } from '../../vendor-request/services/vendor-req.service';
import {VendorRegistrationService} from '../../../vendor-registration/services/vendor-registration.service';
import { ToastrService } from 'ngx-toastr';
import { VendorViewModelService } from '../services/vendor-view-model.service';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { VendorViewModelComponent } from '../../../shared/modules/common-share/components/vendor-view-model/vendor-view-model.component';


@Component({
  selector: 'app-forwarded-vendor',
  templateUrl: './forwarded-vendor.component.html',
  styleUrls: ['./forwarded-vendor.component.scss']
})
export class ForwardedVendorComponent implements OnInit {

  forwardVendorsData: any[] = [];
  selectedData: any[] = [];
  pageRecordSize: any;
  pageOptions: any;
  paginatoryDetails: any;
  defaultPermissions: any;
  expandedRows: {} = {};
  selectedVendorContacts: any[] = [];

  forwardVendorReqHeaders: any = [
    // { field: 'id', header: 'Id', isLink: false },
    { field: 'companyName', header: 'Company Name', isLink: false, width: '200px' },
    { field: 'email', header: 'Email', isLink: false, width: '180px' },
    { field: 'organizationPhonenumber', header: 'Mobile No', isLink: false, width: '160px' },
    { field: 'details', header: 'Product/Service details', isLink: false, width: '200px' },
    { field: 'createdTS', header: 'Submission Date', isLink: false, width: '170px' },

  ];

  forwardVendorContactColumns: any = [
    // { field: 'id', header: 'Id', isLink: false },
    { field: 'firstName', header: 'Name', isLink: false, width: '180px' },
    { field: 'email', header: 'Email', isLink: false, width: '240px' },
    { field: 'phone', header: 'Mobile No', isLink: false, width: '160px' },
    { field: 'designation', header: 'Designation', isLink: false, width: '240px' }
  ];

  constructor(private vendorReqSer: VendorReqService, private encryDecryService: EncryDecryService,  private toaster: ToastrService, private vendorRegSer: VendorRegistrationService, private vendorViewService: VendorViewModelService,
    private dialog: MatDialog) { }

  ngOnInit() {
    this.defaultPermissions = AppApiConfig.DEFAULT_PERMISSIONS;
    const temp = JSON.parse(
      this.encryDecryService.get('perm', localStorage.getItem('logData'))
    );
    this.pageRecordSize = AppApiConfig.GRID_PAGE_INFO.initpageSize;
    this.pageOptions = AppApiConfig.GRID_PAGE_INFO.pageOptions;
    this.defaultPermissions = AppApiConfig.DEFAULT_PERMISSIONS;

    this.fetchForwardedVendors();
  }


  fetchForwardedVendors() {
    this.vendorReqSer.getForwardedVendorsByVE().subscribe((res: any) => {
      if (Array.isArray(res)) {
        this.forwardVendorsData = res;
      }
    });
  }

  approveVendor() {
    if (this.selectedData.length > 0) {
      this.vendorReqSer.approveForwardedVendor(this.selectedData).subscribe(res => {
        this.showToaster(res);
      });
    } else {
      this.toaster.error('Please select vendors', 'Error');
    }
  }

  showToaster(res) {
    if (res.status === 'Success') {
      this.toaster.success(res.errorMessage, 'Success');
      this.fetchForwardedVendors();
      this.selectedData = [];
    } else {
      this.toaster.error(res.errorMessage, 'Failure');
    }
  }

  viewForwardedvendorDetails(data) {

  }


  getCloseContacts(row, event) {
    this.expandedRows = {};
  }

  getContacts(selectedRowData, event) {
    this.expandedRows = {};
    const thisRef = this;
    thisRef.expandedRows[selectedRowData.id] = 1;

    this.selectedData = [selectedRowData];

    this.vendorRegSer.getVendorById({id: this.selectedData[0].id}).subscribe((response) => {
      this.selectedVendorContacts = response;
      console.log('response', response);
    }, (error) => {
    });
  }


  viewVendor(data) {
    const temp = {
        id: data.id
      };
      this.vendorViewService.getVendorById(temp).subscribe((res: any) => {

        if (res) {
          const vendorRegData = res || {};
          this.viewVendorModal(vendorRegData);
        } else {
          this.toaster.error('Failed to Fetch data', 'Failure');
        }
      });
}

viewVendorModal(data) {
  const dialogConfig = new MatDialogConfig();

  dialogConfig.autoFocus = false;
  dialogConfig.data = data;
  dialogConfig.minHeight = 500;
  dialogConfig.width = '80%';
  dialogConfig.maxWidth = 'none';
  const dialogRef = this.dialog.open(VendorViewModelComponent, dialogConfig);

  dialogRef.afterClosed().subscribe(result => {
    console.log(result);
  });
}
}

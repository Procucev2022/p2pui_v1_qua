import { Component, OnInit } from '@angular/core';
import { VendorMgrService } from '../../services/vendor-mgr.service';
import { ToastrService } from 'ngx-toastr';
import { EncryDecryService } from 'src/app/shared/services';
import { AppConfig } from 'src/app/app.config';
import { VendorReqService } from '../../../vendor-request/services/vendor-req.service';
import { VendorViewModelService } from '../../services/vendor-view-model.service';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { VendorViewModelComponent } from '../../../../shared/modules/common-share/components/vendor-view-model/vendor-view-model.component';

@Component({
  selector: 'app-forwarded-vendors-tab',
  templateUrl: './forwarded-vendors-tab.component.html',
  styleUrls: ['./forwarded-vendors-tab.component.scss']
})
export class ForwardedVendorsTabComponent implements OnInit {

  forwardVendorsList: any = [];

  forwardVendorReqHeaders: any = [
    // { field: 'id', header: 'Id', isLink: false },
    { field: 'companyName', header: 'Company Name', isLink: false, width: '200px' },
    { field: 'email', header: 'Email', isLink: false, width: '200px' },
    { field: 'organizationPhonenumber', header: 'Mobile No', isLink: false, width: '160px' },
    { field: 'details', header: 'Product/Service details', isLink: false, width: '200px' },
    { field: 'createdTS', header: 'Submission Date', isLink: false, width: '170px' },

  ];

  paginatoryDetails: any;
  pageRecordSize: any;
  pageOptions: any;

  selectedData: any[] = [];
  loggedUserDetails: any;
  loggedUserPermissions: any;

  constructor(private vendMgrSer: VendorMgrService, private toaster: ToastrService, private encryDecryService: EncryDecryService, private vendorReqSer: VendorReqService,
    private vendorViewService: VendorViewModelService, private dialog: MatDialog, ) { }

  ngOnInit() {

    this.pageRecordSize = AppConfig.GRID_PAGE_INFO.initpageSize;
    this.pageOptions = AppConfig.GRID_PAGE_INFO.pageOptions;
    const temp =  JSON.parse(this.encryDecryService.get(localStorage.getItem('logData')) );
    this.loggedUserDetails = temp.details;

    this.loggedUserPermissions = this.loggedUserDetails.listofPermission;

    this.getAllForwardedVendorsByVendorApproved();
  }


  getAllForwardedVendorsByVendorApproved() {

      this.vendMgrSer.getAllForwardedVendors().subscribe(res => {
        if (Array.isArray(res)) {
          this.forwardVendorsList = res;
        } else {
          this.forwardVendorsList = [];
        }

      });

  }

  acceptVendor() {
    if (this.selectedData.length !== 0) {
      const payload: any = [];
      this.selectedData.forEach(element => {
        const obj = {
          'email': element.email,
          'orgName': element.companyName,
          'phone': element.organizationPhonenumber,
          tempapproval: true
        };
          payload.push(obj);
      });
      this.vendorReqSer.registerVendor(payload).subscribe((res: any) => {
        if (res.statusCode === 'Success') {
          this.toaster.success(res.errorMessage, 'Success');
          this.getAllForwardedVendorsByVendorApproved();
          this.selectedData = [];
        } else {
          this.toaster.error(res.errorMessage, 'Failure');
        }
      });
    } else {
      this.toaster.error('Please select Vendor', 'Error');
    }
  }


  viewVendor(data) {
    const temp = {
        id: data.id
      };
      this.vendorViewService.getVendorById(temp).subscribe((res: any) => {

        if (res) {
          const vendorRegData = res;
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


  showToaster(res) {

  }

}

import { Component, OnInit } from '@angular/core';
import { AppConfig } from 'src/app/app.config';
import { VendorApprovalModalComponent } from '../vendor-approval-modal/vendor-approval-modal.component';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { VendorViewModelComponent } from '../../../../shared/modules/common-share/components/vendor-view-model/vendor-view-model.component';
import { VendorMgrService } from '../../services/vendor-mgr.service';
import { ToastrService } from 'ngx-toastr';
import { VendorViewModelService } from '../../services/vendor-view-model.service';
import * as Swal from 'sweetalert2';
import { AppApiConfig } from 'src/app/shared/constants/app-api.config';
import { EncryDecryService } from 'src/app/shared/services';

@Component({
  selector: 'app-approvalpending-tab',
  templateUrl: './approvalpending-tab.component.html',
  styleUrls: ['./approvalpending-tab.component.scss']
})
export class ApprovalpendingTabComponent implements OnInit {

  approvalPendingList: any;
  selectedData: any[] = [];
  popoverTitle = 'Popover title';
  popoverMessage = 'Popover description';
  confirmClicked = false;
  cancelClicked = false;
  minDate: Date = new Date();

  approvalTableHeaders: any = [
    { field: 'vendorName', header: 'Vendor Name', isLink: false, fieldType: 'text', width:'225px'  },
    { field: 'companyId', header: 'Vendor ID', isLink: false, fieldType: 'text' , width:'165px' },
    { field: 'createdTS', header: 'Submission Date', isLink: false, fieldType: 'date', width:'165px'  }
  ];
  paginatoryDetails: any;
  pageRecordSize: any;
  pageOptions: any;
  vendorRegData: any;
  defaultPermissions: any;
  loggedUserDetails: any;
  loggedUserPermissions: any;
  constructor(public dialog: MatDialog,
    private vendMgrSer: VendorMgrService,
    private toaster: ToastrService,
    private vendorViewService: VendorViewModelService,
    private encryDecryService: EncryDecryService) { }

  ngOnInit() {
    this.pageRecordSize = AppConfig.GRID_PAGE_INFO.initpageSize;
    this.pageOptions = AppConfig.GRID_PAGE_INFO.pageOptions;
    this.getAllVendorsByVendorApprovalPending();
    this.defaultPermissions = AppApiConfig.DEFAULT_PERMISSIONS;
    const temp =  JSON.parse(this.encryDecryService.get(localStorage.getItem('logData')) );
    this.loggedUserDetails = temp.details;

    this.loggedUserPermissions = this.loggedUserDetails.listofPermission;
    console.log('permissions', this.loggedUserPermissions);
  }


  approval(data) {


           this.openDialog(data);


  }



  openDialog(data) {
    const dialogRef = this.dialog.open(VendorApprovalModalComponent, {
      width: '80%',
      // height: '400px',
      data: data
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result.event === 'submit') {
        this.getAllVendorsByVendorApprovalPending();
      }
    });
  }
  approvalModelList(e) {
    console.log('Hai');
  }

  viewVendor(data) {
    const temp = {
      id: data.id
    };
    this.vendorViewService.getVendorById(temp).subscribe((res: any) => {

      if (res) {
        this.vendorRegData = res;
        this.viewVendorModal();
      } else {
        this.toaster.error('Failed to Fetch data', 'Failure');
      }
    });

  }

  viewVendorModal() {
    const dialogConfig = new MatDialogConfig();

    dialogConfig.autoFocus = false;
    dialogConfig.data = this.vendorRegData;
    dialogConfig.maxWidth = 'none';
    dialogConfig.width = '80%';

    const dialogRef = this.dialog.open(VendorViewModelComponent, dialogConfig);

    dialogRef.afterClosed().subscribe(result => {
      console.log(result);
    });
  }


  onPage(event) {
    this.paginatoryDetails = event;
  }

  getAllVendorsByVendorApprovalPending() {
    this.approvalPendingList = [];
    this.vendMgrSer.getAllVendorsByVendorApprovalPending().subscribe(res => {
      if (Array.isArray(res)) {
        // this.approvalPendingList = res;
        // this.getAllVendorsByVendorApprovalPending();
        res.forEach(element => {
          element['status'] = element['status']['uiDisplay'];
        });
        this.approvalPendingList = res;
      }
    });
  }
  handleRejectConfirm(temp: any[]) {
    this.vendMgrSer.rejectRegistration(temp).subscribe((res: any) => {
      if (res.status === 'Success' || res.status === 'success') {
        this.toaster.success(res.message, 'Success');
        this.getAllVendorsByVendorApprovalPending();
      } else if (res.status === 'Failure' || res.status === 'failure') {
        this.toaster.error(res.message, 'Failure');
      }
    });
  }

  handleRejectCancel() {
    (Swal as any).default('Cancelled', 'OK', 'error');
  }

  promptRejectConfirm(): any {
    return (Swal as any).default({
      title: '<h5>Please Confirm!!<h5>',
      html: '<h3>Are you sure you want to reject?</h3>',
      confirmButtonText: 'Yes',
      confirmButtonColor: '#006dd5',
      cancelButtonColor: '#d63636',
      showCancelButton: true,
      reverseButtons: true
    });
  }

  onRejectDialogResult(result: any, temp: any[]) {
    if (result?.value) {
      this.handleRejectConfirm(temp);
    } else if (result?.dismiss === ((Swal as any).default?.DismissReason?.cancel ?? 'cancel')) {
      this.handleRejectCancel();
    }
  }

  rejectRegistration(selectedData) {
    if (selectedData.length) {

        const temp = [];
        selectedData.forEach(data => {
          const obj = {
            id: data.id
          };
          temp.push(obj);
        });

        this.promptRejectConfirm().then((result) => this.onRejectDialogResult(result, temp));
    } else {
      this.toaster.error('Please select at lease one record', 'Failure');
    }

  }



}





import { Component, Inject, OnChanges, OnInit, Optional } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { PpoViewModalComponent } from 'src/app/shared/modules/common-share/components/ppo-view-modal/ppo-view-modal.component';
import { PoService } from 'src/app/shared/modules/common-share/services/po.service';
import { EncryDecryService } from 'src/app/shared/services';
import swal from 'sweetalert2';
import { AcceptPosComponent } from '../accept-pos/accept-pos.component';
import { CancelPoComponent } from '../cancel-po/cancel-po.component';

@Component({
  selector: 'app-view-pos',
  templateUrl: './view-pos.component.html',
  styleUrls: ['./view-pos.component.scss']
})
export class ViewPosComponent implements OnInit {
  poData: any;
  loggedUserDetails: any;
  loggedUserPermissions: any;

  paginatoryDetails: any;
  pageRecordSize: any;
  pageOptions: any;
  selectedData: any;
  poItemsHeaders: any = [
    { field: 'description', header: 'Description', isLink: false, width: '300px' },
    { field: 'brand', header: 'Specification', isLink: false, width: '140px' },
    { field: 'quantity', header: 'PO Quantity', isLink: false, width: '140px' },
    { field: 'unitofMeasures', header: 'UOM', isLink: false, width: '120px' },
    { field: 'excludetaxamount', header: 'Basic Amount', isLink: false, width: '140px' },
    { field: 'gstValue', header: 'GST Value', isLink: false, width: '140px' },
    { field: 'totalamount', header: 'Total Amount', isLink: false, width: '140px' },
];
  poLineItemsData = [];
  isLoaded: boolean;
  roleName: any;
  constructor(public dialogRef: MatDialogRef<ViewPosComponent>,
    @Optional() @Inject(MAT_DIALOG_DATA) public data,
    private encryDecryService: EncryDecryService,
    private toaster: ToastrService,
    private modalDialog: MatDialog,
    private  poService: PoService, ) { }

  ngOnInit() {
    const temp =  JSON.parse(this.encryDecryService.get('perm', localStorage.getItem('logData')) );
    this.loggedUserDetails = temp.details;
    this.roleName = this.loggedUserDetails['role']['roleName'];
    console.log('userDetails', this.loggedUserDetails);

    console.log('view data', this.data);
    this.poData = this.data;
    this.poLineItemsData = [...this.poData.poitems];
    this.isLoaded = true;

  }

  promptPoAction(html: string): any {
    return swal({
      title: `<h4>Are you sure?</h4>`,
      html,
      type: 'warning',
      confirmButtonText: 'Yes',
      confirmButtonColor: '#006dd5',
      cancelButtonColor: '#d63636',
      showCancelButton: true,
      reverseButtons: true,
    });
  }

  onCancelPoDialogResult(result: any) {
    if (result?.value) {
      const dialog = this.modalDialog.open(CancelPoComponent, {
        width: '40%',
        minHeight: '300px',
        data: this.poData,
      });
      dialog.afterClosed().subscribe((closeResult) => {
        if (closeResult && closeResult.event === 'close') {
          this.dialogRef.close({ event: 'close' });
        }
      });
    }
  }

  cancelPo() {
    this.promptPoAction(
      `<h6 style="font-size:13px">You want to cancel the PO: <b>${this.poData.poId}</b> </h6>`
    ).then((result) => this.onCancelPoDialogResult(result));
  }

  onAcceptPoDialogResult(result: any) {
    if (result?.value) {
      const dialog = this.modalDialog.open(AcceptPosComponent, {
        width: '80%',
        minHeight: '400px',
        data: this.poData,
      });
      dialog.afterClosed().subscribe((closeResult) => {
        if (closeResult && closeResult.event === 'close') {
          this.dialogRef.close({ event: 'close' });
        }
      });
    }
  }

  acceptPo() {
    this.promptPoAction(
      `<h6 style="font-size:13px">You want to Approve the PO: <b>${this.poData.poId}</b> </h6>`
    ).then((result) => this.onAcceptPoDialogResult(result));
  }

  onApprovePoDialogResult(result: any) {
    if (result?.value) {
      this.poService
        .poApprovedByClientApproved({
          id: this.poData.id,
          approver: { id: localStorage.getItem('loggedId') },
        })
        .subscribe((res) => {
          if (!!res && (res['statusCode'] === '200' || res['statusCode'] === 200)) {
            this.dialogRef.close({ event: 'close' });
          }
        });
    }
  }

  approvePo() {
    this.promptPoAction(
      `<h6 style="font-size:13px">You want to Approve the PO: <b>${this.poData.poId}</b> </h6>`
    ).then((result) => this.onApprovePoDialogResult(result));
  }

  onRejectPoDialogResult(result: any) {
    if (result?.value) {
      this.poService.rejectPoById({ id: this.data.id }).subscribe((response) => {
        if (response['status'] === 'Success') {
          this.toaster.success(response['message'], 'Success');
          this.dialogRef.close({ event: 'close' });
        }
      });
    }
  }

  rejectPo() {
    this.promptPoAction(
      `<h6 style="font-size:13px">You want to Reject the PO : <b>${this.poData.poId}</b> </h6>`
    ).then((result) => this.onRejectPoDialogResult(result));
  }

  zoomout() {
    this.dialogRef.updateSize('70%');
  }

  zoomin() {
      this.dialogRef.updateSize('90%');
  }

}

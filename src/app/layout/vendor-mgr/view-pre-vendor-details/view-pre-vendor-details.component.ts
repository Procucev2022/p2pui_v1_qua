import { Component, Inject, OnInit, Optional } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AddOrEditVendorModalComponent } from '../../../shared/modules/common-share/components/add-or-edit-vendor-modal/add-or-edit-vendor-modal.component';

@Component({
  selector: 'app-view-pre-vendor-details',
  templateUrl: './view-pre-vendor-details.component.html',
  styleUrls: ['./view-pre-vendor-details.component.scss']
})
export class ViewPreVendorDetailsComponent implements OnInit {

  vendorData: any;
  constructor(public dialogRef: MatDialogRef<AddOrEditVendorModalComponent>,
    @Optional() @Inject(MAT_DIALOG_DATA) public data) { }

  ngOnInit() {
    this.vendorData = {...this.data};
  }

  getVendorStatus(status) {
    return status === 'Invitation Sent' ? 'blue-text' : status === 'Submitted' ? 'green-text' : status === 'Registration pending' ? 'yellow-text' : 'grey-text';
  }
}

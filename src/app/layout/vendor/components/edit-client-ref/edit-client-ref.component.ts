import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Optional } from 'ag-grid-community';
import { NgForm } from '@angular/forms';
import { VendorRegistrationService } from 'src/app/vendor-registration/services/vendor-registration.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-edit-client-ref',
  templateUrl: './edit-client-ref.component.html',
  styleUrls: ['./edit-client-ref.component.scss']
})
export class EditClientRefComponent implements OnInit {

    clientRefrenceDate: any;
    vendorData: any;

    constructor(private dialogRef: MatDialogRef<EditClientRefComponent>,
      @Optional() @Inject(MAT_DIALOG_DATA) public data,
      private vendorRegSer: VendorRegistrationService,
      private toastrService: ToastrService) {
          this.vendorData = data;
          this.clientRefrenceDate = data.rowData;
       }

    ngOnInit() {
    }

    onEditClientRef(editForm: NgForm) {
      if (editForm.invalid) {
          return;
        }

      this.vendorData.vendorRegData.clientReference.forEach(element => {
        if (element.id === this.clientRefrenceDate.id) {
          element = Object.assign({}, this.clientRefrenceDate);
        }
      });


      this.vendorRegSer.editVendor(this.vendorData.vendorRegData).subscribe((response) => {
        this.dialogRef.close({event: 'submit', data: editForm.value});
        if (response['status'] === 'Success') {
          this.toastrService.success(response['message'], 'Success');
        } else {
          this.toastrService.error('Failed to update vendor details', 'Failed');
        }
      });
      // this.dialogRef.close({event: 'submit', data: editForm.value});
    }

    closeDialog() {
      this.dialogRef.close({event: 'Cancel'});
    }
}

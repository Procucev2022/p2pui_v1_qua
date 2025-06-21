import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Optional } from 'ag-grid-community';
import { NgForm } from '@angular/forms';
import { VendorRegistrationService } from 'src/app/vendor-registration/services/vendor-registration.service';
import { ToastrService } from 'ngx-toastr';


@Component({
  selector: 'app-service-edit',
  templateUrl: './service-edit.component.html',
  styleUrls: ['./service-edit.component.scss']
})
export class ServiceEditComponent implements OnInit {
    vendorServiceData: any;
  vendorRegData: any;

    constructor(private dialogRef: MatDialogRef<ServiceEditComponent>, private vendorRegSer: VendorRegistrationService,
        @Optional() @Inject(MAT_DIALOG_DATA) public data, private toastrService: ToastrService) {
            this.vendorServiceData = data['rowData'];
            this.vendorRegData = data;
         }

  ngOnInit() {
  }

  onEditService(form: NgForm) {
    if (form.invalid) {
        return;
      }
      this.vendorRegData.vendorRegData.vendorService.forEach(element => {
        if (element.id === this.vendorServiceData.id) {
          element = Object.assign({}, this.vendorServiceData);
        }
      });
      this.vendorRegSer.editVendor(this.vendorRegData.vendorRegData).subscribe((response) => {
        this.dialogRef.close({event: 'submit', data: form.value});
        if (response['status'] === 'Success') {
          this.toastrService.success(response['message'], 'Success');
        } else {
          this.toastrService.error('Failed to update vendor details', 'Failed');
        }
      });
  }

  closeDialog() {
    this.dialogRef.close({event: 'Cancel'});
  }

}

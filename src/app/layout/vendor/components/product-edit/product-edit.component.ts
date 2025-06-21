import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Optional } from 'ag-grid-community';
import { NgForm } from '@angular/forms';
import { VendorRegistrationService } from 'src/app/vendor-registration/services/vendor-registration.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-product-edit',
  templateUrl: './product-edit.component.html',
  styleUrls: ['./product-edit.component.scss']
})
export class ProductEditComponent implements OnInit {

  vendorProductData: any;
  vendorData: any;

  constructor(private dialogRef: MatDialogRef<ProductEditComponent>,
    @Optional() @Inject(MAT_DIALOG_DATA) public data,
    private vendorRegSer: VendorRegistrationService,
    private toastrService: ToastrService) {
        this.vendorData = data;
        this.vendorProductData = data.rowData;
     }

  ngOnInit() {
  }

  onEditProduct(editForm: NgForm) {
    if (editForm.invalid) {
        return;
      }

    this.vendorData.vendorRegData.vendorProduct.forEach(element => {
      if (element.id === this.vendorProductData.id) {
        element = Object.assign({}, this.vendorProductData);
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

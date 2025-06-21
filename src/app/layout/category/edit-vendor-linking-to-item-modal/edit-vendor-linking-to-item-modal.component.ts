import { Component, Inject, OnInit, Optional } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { EncryDecryService } from 'src/app/shared/services';
import { CategoryService } from '../services/category.service';
import { AddOrEditVendorModalComponent } from '../../../shared/modules/common-share/components/add-or-edit-vendor-modal/add-or-edit-vendor-modal.component';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';

@Component({
  selector: 'app-edit-vendor-linking-to-item-modal',
  templateUrl: './edit-vendor-linking-to-item-modal.component.html',
  styleUrls: ['./edit-vendor-linking-to-item-modal.component.scss']
})
export class EditVendorLinkingToItemModalComponent implements OnInit {

  createForm: FormGroup;
  constructor(public dialogRef: MatDialogRef<AddOrEditVendorModalComponent>,
    @Optional() @Inject(MAT_DIALOG_DATA) public data,
    private encryDecryService: EncryDecryService,
    private toaster: ToastrService, private fb: FormBuilder,  private catService: CategoryService) { }


  uomList = [];
  ngOnInit() {
    this.createForm = this.fb.group({
          'vendorItemCode': [''],
          'description': [this.data.itemDescription ? this.data.itemDescription : '' , Validators.required],
          'minQuantity': ['', Validators.required],
          'monthlyMfCapability': [''],
          'leadTimeDay': [''],
          'pricePerUnit': ['', Validators.required],
          'upcCode': [''],
          'uom': [''],
    });

    if (!!this.data['linkedVendorItemDetails']) {
      this.bindData();
    }

    this.getAllUoms();
  }

  getAllUoms() {
    this.catService.getAllUOM().subscribe((res) => {
      if (Array.isArray(res)) {
        res.forEach(ele => {
          this.uomList.push({label: ele.description, id: ele.id});
        });
      }
    });
  }

  bindData() {
    Object.keys(this.createForm.controls).forEach(control => {
      this.createForm.controls[control].setValue(this.data['linkedVendorItemDetails'][control]);
    });
  }

  submitForm() {
    if (this.createForm.valid) {
      this.data['linkedVendorItemDetails'] = Object.assign({}, this.createForm.getRawValue());
      this.data['isLinked'] = true;
      this.data['isEdit'] = true;
      this.dialogRef.close({
        type: 'linked',
        data: this.data
      });
    } else {
      this.toaster.warning('Please Enter Required Fields', 'Warning');
    }
  }

  reset() {
    this.createForm.reset();
  }

}

import { Component, Inject, OnInit, Optional } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { EncryDecryService } from 'src/app/shared/services';

@Component({
  selector: 'app-edit-client-linking-to-item-modal',
  templateUrl: './edit-client-linking-to-item-modal.component.html',
  styleUrls: ['./edit-client-linking-to-item-modal.component.scss']
})
export class EditClientLinkingToItemModalComponent implements OnInit {

  createForm: FormGroup;
  constructor(public dialogRef: MatDialogRef<EditClientLinkingToItemModalComponent>,
    @Optional() @Inject(MAT_DIALOG_DATA) public data,
    private encryDecryService: EncryDecryService,
    private toaster: ToastrService, private fb: FormBuilder) { }

  uomList = [{id: 1, description: 'pcs'}, {description: 'kgs', id: 2}];
  ngOnInit() {
    this.createForm = this.fb.group({
          'clientAnualConsum': ['', Validators.required],
          'monthlyConsumpution': ['', Validators.required],
          'clientItemCode': [''],
          'projectCategory': [''],
          'projectSubCategory': [''],
          'projectItemNumber': ['']
    });

    if (!!this.data['linkedClientItemDetails']) {
      this.bindData();
    }
  }

  bindData() {
    Object.keys(this.createForm.controls).forEach(control => {
      this.createForm.controls[control].setValue(this.data['linkedClientItemDetails'][control]);
    });
  }

  submitForm() {
    if (this.createForm.valid) {
      this.data['linkedClientItemDetails'] = Object.assign({}, this.createForm.getRawValue());
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

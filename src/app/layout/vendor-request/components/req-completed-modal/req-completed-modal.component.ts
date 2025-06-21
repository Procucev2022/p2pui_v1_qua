import { Component, OnInit, Inject } from '@angular/core';
import { Optional } from 'ag-grid-community';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { VendorReqService } from '../../services/vendor-req.service';
import { ToastrService } from 'ngx-toastr';

@Component({
    selector: 'app-req-completed-modal',
    templateUrl: './req-completed-modal.component.html',
    styleUrls: ['./req-completed-modal.component.scss']
})
export class ReqCompletedModalComponent implements OnInit {

    vendorsFrom: FormGroup;
    vendors: FormArray;

    constructor(@Optional() @Inject(MAT_DIALOG_DATA) public data,
        private dialogRef: MatDialogRef<ReqCompletedModalComponent>,
        private _fb: FormBuilder,
        private vendorReqSer: VendorReqService,
        private toaster: ToastrService) { }


    ngOnInit() {
        console.log(this.data);

        this.vendorsFrom = this._fb.group({
            'vendors': this._fb.array([this.createVendor()])

        });
    }

    createVendor() {
        var group = this._fb.group({
            vendorId: ['', Validators.required],
            vendorName: ['', Validators.required]
        })


        return group
    }

    addVendor() {
        this.vendors = this.vendorsFrom.get('vendors') as FormArray;
        this.vendors.push(this.createVendor());
    }

    removeVendor(index) {
        this.vendors.removeAt(index + 1);
    }

    closeDialog() {
        this.dialogRef.close({ event: 'Cancel' });
    }

    onSubmit() {
        if (this.vendorsFrom.valid) {
            var req = []
            this.data.forEach(row => {
                this.vendorsFrom.value.vendors.forEach(vendor => {
                    row.requestVendorDetails.push(vendor)
                });
                var temp = {
                    'id': row.id,
                    "requestVendorDetails": row.requestVendorDetails
                }
                req.push(temp)
            });

            this.vendorReqSer.requestCompleted(req).subscribe((res: any) => {
                if (res.statusCode == 'Success') {
                    this.toaster.success(res.errorMessage, 'Success');
                    this.dialogRef.close({ event: 'submit' });
                } else {
                    this.toaster.error(res.errorMessage, 'Failure')
                }

            })
        } else {
            this.toaster.error('Please file the required(*) fields', 'Failure')
        }

    }
}

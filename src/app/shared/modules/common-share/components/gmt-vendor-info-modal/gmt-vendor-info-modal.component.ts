import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { CreateRfqService } from 'src/app/layout/category-mgr/services/create-rfq.service';

@Component({
    selector: 'app-gmt-vendor-info-modal',
    templateUrl: './gmt-vendor-info-modal.component.html',
    styleUrls: ['./gmt-vendor-info-modal.component.scss']
})
export class GmtVendorInfoModalComponent implements OnInit {

    @Input('vendorInfo') vendorInfo: any;
    @Input('selectedVendor') selectedVendor: any;
    @Input('isVendor') isVendor: boolean = true;
    @Output() vendorUpdated = new EventEmitter<any>();

    isEditing: boolean = false;
    isSaving: boolean = false;
    editForm: FormGroup;

    constructor(
        private fb: FormBuilder,
        private createRfqService: CreateRfqService,
        private toastr: ToastrService
    ) { }

    ngOnInit() {
        this.initForm();
    }

    initForm() {
        const companyName = this.vendorInfo?.companyName || this.selectedVendor?.vendorName || this.selectedVendor?.companyName || '';
        this.editForm = this.fb.group({
            companyName: [companyName, [Validators.required]],
            email: [this.vendorInfo?.email || '', [Validators.required, Validators.email]],
            organizationPhonenumber: [this.vendorInfo?.organizationPhonenumber || ''],
            zipCode: [this.vendorInfo?.zipCode || ''],
            city: [this.vendorInfo?.city || '']
        });
    }

    startEdit() {
        this.initForm();
        this.isEditing = true;
    }

    cancelEdit() {
        this.isEditing = false;
    }

    saveVendorInfo() {
        if (this.editForm.invalid) {
            this.toastr.error('Please enter valid details', 'Error');
            return;
        }

        const orgId = this.vendorInfo?.id || this.selectedVendor?.companyId || this.selectedVendor?.vendorUuid || this.selectedVendor?.id;
        if (!orgId) {
            this.toastr.error(`Unable to find ${this.isVendor ? 'vendor' : 'buyer'} ID`, 'Error');
            return;
        }

        const formVal = this.editForm.value;
        const payload: any = {
            id: orgId,
            companyName: formVal.companyName ? formVal.companyName.trim() : '',
            email: formVal.email ? formVal.email.trim() : '',
            organizationPhonenumber: formVal.organizationPhonenumber ? formVal.organizationPhonenumber.trim() : '',
            zipCode: formVal.zipCode ? formVal.zipCode.trim() : '',
            city: formVal.city ? formVal.city.trim() : ''
        };

        this.isSaving = true;
        const updateCall$ = this.isVendor
            ? this.createRfqService.updateSellerData(payload)
            : this.createRfqService.updateBuyerData(payload);

        updateCall$.subscribe(
            (res: any) => {
                this.isSaving = false;
                this.toastr.success(`${this.isVendor ? 'Seller' : 'Buyer'} details updated successfully`, 'Success');

                // Update local references
                if (this.vendorInfo) {
                    this.vendorInfo.companyName = payload.companyName;
                    this.vendorInfo.email = payload.email;
                    this.vendorInfo.organizationPhonenumber = payload.organizationPhonenumber;
                    this.vendorInfo.zipCode = payload.zipCode;
                    this.vendorInfo.city = payload.city;
                }
                if (this.selectedVendor) {
                    if (this.selectedVendor.vendorName !== undefined) {
                        this.selectedVendor.vendorName = payload.companyName;
                    }
                    if (this.selectedVendor.companyName !== undefined) {
                        this.selectedVendor.companyName = payload.companyName;
                    }
                }

                this.vendorUpdated.emit({
                    id: orgId,
                    ...payload
                });

                this.isEditing = false;
            },
            (error) => {
                this.isSaving = false;
                this.toastr.error(`Failed to update ${this.isVendor ? 'seller' : 'buyer'} details`, 'Error');
            }
        );
    }

}

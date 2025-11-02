import { CatProcuRequestsService } from 'src/app/layout/category-mgr/services';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { CreateRfqService } from '../services/create-rfq.service';
import { AppApiConfig } from 'src/app/shared/constants/app-api.config';
import { EncryDecryService } from 'src/app/shared/services';
import { ToastrService } from 'ngx-toastr';
import { PATTERNS, SystemViewConfig } from 'src/app/app.config';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import swal from 'sweetalert2';
import { FormValidatationsService } from 'src/app/shared/services/form-validatations.service';
@Component({
    selector: 'app-cat-mgr-vendor-catalogue',
    templateUrl: './cat-mgr-vendor-catalogue.component.html',
    styleUrls: ['./cat-mgr-vendor-catalogue.component.scss']
})
export class CatMgrVendorCatalogueComponent implements OnInit {
    isLoaded: boolean = false;
    formErrorsArray: any = [];
    clientTableHeaders: any = [
        { field: 'materialDescription', header: 'Material Description', isLink: true, isExceedContent: true, width: '155px' },
        { field: 'uom', header: 'UOM', isLink: false, isExceedContent: false, width: '105px' },
        { field: 'minOrderQuantity', header: 'Min Order Qty.', isLink: false, isExceedContent: false, width: '125px' },
        { field: 'pricePerUom', header: 'Price Per UOM', isLink: false, isExceedContent: false, width: '125px' },
        { field: 'gstPercentage', header: 'GST Percentage(%)', isLink: false, isExceedContent: false, width: '165px' },
        { field: 'leadTimeForMoq', header: 'Lead Time for MOQ(Days)', isLink: false, isExceedContent: true, width: '215px' },
        { field: 'availableQuantity', header: 'Available Qty.', isLink: false, isExceedContent: false, width: '135px' },
    ];
    usersList = [];
    cataloguesList = [];
    selectedClientData: any;
    pageRecordSize: number;
    pageOptions: number[];
    defaultPermissions: any;
    loggedUserPermissions: any;
    loggedUserDetails: any;
    loggedUserName: any;
    selectedData: any;
    expandedRows = {};
    isShowChildGrid: boolean;
    roleName: any;
    currentView: any;
    isGMTView: boolean;
    @ViewChild('onAddCatlogTemplateRef') onAddCatlogTemplateRef: any;
    @ViewChild('editUserTemplateRef') editUserTemplateRef: any;
    catalogueForm: FormGroup;
    sectors = [
        "Steel", "Cement", "Sugar", "Retail", "Pharma", "Chemical",
        "Other Manufacturing", "Other Services", "Others"
    ];
    selectedUserData: any;
    isViewMode: boolean;
    constructor(private createRfqService: CreateRfqService, private encryDecryService: EncryDecryService,
        private catProcService: CatProcuRequestsService, private toaster: ToastrService,
        private dialog: MatDialog, private formValidationService: FormValidatationsService
        , private formValidatorService: FormValidatationsService) {
        this.formValidationService = new FormValidatationsService();

    }

    ngOnInit() {
        this.pageRecordSize = AppApiConfig.GRID_PAGE_INFO.initpageSize;
        this.pageOptions = AppApiConfig.GRID_PAGE_INFO.pageOptions;
        this.defaultPermissions = AppApiConfig.DEFAULT_PERMISSIONS;
        const temp = JSON.parse(this.encryDecryService.get('perm', localStorage.getItem('logData')));
        this.loggedUserPermissions = temp.details.listofPermission;
        this.loggedUserDetails = temp.details;
        this.loggedUserName = this.loggedUserDetails.username;
        this.roleName = this.loggedUserDetails.role.roleName;
        this.getVendorCatalogues();
        this.currentView = !localStorage.getItem('system-view') ? JSON.parse(localStorage.getItem('system-view')) : localStorage.getItem('system-view');

        this.isGMTView = [SystemViewConfig.GMT_BASIC, SystemViewConfig.GMT_BASIC_PLUS].includes(this.currentView) ? true : false;
        //    { field: 'minOrderQuantity', header: 'Min Order Qty.', isLink: false, isExceedContent: false, width: '125px' },
        //     { field: 'pricePerUom', header: 'Price Per UOM', isLink: false, isExceedContent: false, width: '125px' },
        //     { field: 'gstPercentage', header: 'GST Percentage(%)', isLink: false, isExceedContent: false, width: '165px' },
        //     { field: 'leadTimeForMoq', header: 'Lead Time for MOQ', isLink: false,isExceedContent: true, width: '215px' },
        //     { field: 'availableQuantity', header: 'Available Qty.', isLink: false, isExceedContent: false, width: '135px' },
        this.catalogueForm = new FormGroup({
            materialDescription: new FormControl('', [Validators.required, this.formValidatorService.alphaNumericNotNumericOnly]),
            uom: new FormControl('', [Validators.required, this.formValidatorService.alphabetValidator]),
            minOrderQuantity: new FormControl('', [Validators.required]),
            pricePerUom: new FormControl('', [Validators.required]),
            leadTimeForMoq: new FormControl('', [Validators.required]),
            availableQuantity: new FormControl('', [Validators.required]),
            gstPercentage: new FormControl('', [Validators.required]),
            otherTerms: new FormControl('', [Validators.required]),
            paymentTerms: new FormControl('', [Validators.required]),
            freight: new FormControl('', [Validators.required]),
            packingAndForwarding: new FormControl('', [Validators.required]),

        });
        this.getFormValidationStatus();
    }


    getFormValidationStatus() {
        this.catalogueForm.valueChanges.subscribe((data) => {

            const formControls = this.catalogueForm.controls;
            this.formErrorsArray = [];
            for (const key in formControls) {
                if (formControls[key].invalid) {
                    const invalidControl = this.catalogueForm.get(key).invalid ? { key: key, errors: formControls[key].errors } : null;
                    if (invalidControl)
                        this.formErrorsArray.push(invalidControl);
                }
            }
            console.log(this.formErrorsArray);
        });
    }



    getVendorCatalogues() {
        this.createRfqService.getVendorCatalogues({ id: this.loggedUserDetails.org.id }).subscribe((res: any) => {
            if (res && res.data && Array.isArray(res.data.catalogues)) {
                this.cataloguesList = Array.isArray(res.data.catalogues) ? res.data.catalogues.map(ele => { return { ...ele } }) : [];
                this.isLoaded = true;
            }
        })
    }

    onGridAction(event: any) {
        console.log(event)
    }

    onAddCatlogue(isEdit?: boolean) {
        this.resetForm();
        if (isEdit) {
            this.catalogueForm.disable();
            this.catalogueForm.patchValue(this.selectedData);
        } else {
            this.isViewMode = false;
            this.selectedData = null;
            this.catalogueForm.enable();

        }
        this.catalogueForm.patchValue(this.selectedData);

        const dialogConfig = new MatDialogConfig();

        // dialogConfig.disableClose = true;
        dialogConfig.autoFocus = true;
        dialogConfig.minHeight = '80vh';
        dialogConfig.maxWidth = 'none';
        dialogConfig.width = '50%';
        const dialogRef = this.dialog.open(this.onAddCatlogTemplateRef, dialogConfig).afterClosed().subscribe(result => { console.log(result); });


    }


    resetForm() {
        this.catalogueForm.reset();
    }

    onAddUpdateCatalogueDetails() {

        if (this.isInvalidDescription(this.catalogueForm, 'materialDescription')) {
            this.toaster.warning("Material Description cannot have special characters", "Warning");
            return;
        }

        if (this.catalogueForm.valid) {
            const obj: any = {
                org: { id: this.loggedUserDetails.org.id },
                user: this.loggedUserDetails.id,
                ...this.catalogueForm.value,
            };

            this.createRfqService.addVendorCatalogue(obj).subscribe((res: any) => {
                if (res.status == 'Success') {
                    this.toaster.success(res.message, 'Success');
                    this.dialog.closeAll();
                    this.getVendorCatalogues();
                } else {
                    this.toaster.error(res.message, 'Failed')
                }
            });

            // this.createRfqService.onAddUpdateCatalogueDetails(obj).subscribe((res:any)=>{
            //     if (res.status == 'Success') {
            //         this.toaster.success(res.message, 'Success');
            //         this.dialog.closeAll();
            //         this.getVendorCatalogues();
            //     } else {
            //         this.toaster.error(res.message, 'Failed')
            //     }
            // })
        } else {
            this.toaster.warning("Please fill the all the details", "Warning")
        }
    }


    isInvalidDescription(formName: FormGroup, controlName: string) {
        let description = formName.controls[controlName].value?.trim();
        if (description && description.split(' ').length > 1) {
            description = description.replace(/\s+/g, '');
        }
        return (formName.controls[controlName].dirty) &&
            (this.isOnlySpecialCharacters(description) ||
                this.startsWithSpecialChar(description));
    }

    isEmptyControl(formName: FormGroup, controlName: string) {
        return formName.controls[controlName].dirty && formName.controls[controlName].value.trim() == '';
    }
    isEmptySpecification(formName: FormGroup, controlName: string) {
        return this.isEmptyControl(formName, controlName);
    }


    isOnlySpecialCharacters(controlValue: string): boolean {
        const regex = /^[^a-zA-Z0-9\s]+$/;

        return regex.test(controlValue);
    }

    startsWithSpecialChar(controlValue: string): boolean {
        const regex = /^[^a-zA-Z0-9]/;
        return regex.test(controlValue);
    }


    //For View RFQ Details - ReadOnly

    onViewCatalogue(rowData: any) {
        this.isViewMode = true;
        this.selectedData = rowData;
        this.onAddCatlogue(true);

    }

    hasAnyErrors(): boolean {
        const controls = this.catalogueForm.controls;
        const hasErrors = Object.keys(controls).some(key => {
            const control = controls[key];
            return control && control.invalid;
        });
        return hasErrors;
    }

    
    numberOnly(event): boolean {
        const charCode = event.which ? event.which : event.keyCode;
        if (charCode > 31 && (charCode < 48 || charCode > 57)) {
            return false;
        }
        return true;
    }
}
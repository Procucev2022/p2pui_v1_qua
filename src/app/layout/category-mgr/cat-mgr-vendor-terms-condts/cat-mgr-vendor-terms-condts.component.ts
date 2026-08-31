import { Component } from '@angular/core';
import { CreateRfqService } from '../services/create-rfq.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { SystemViewConfig } from 'src/app/app.config';
import { AppApiConfig } from 'src/app/shared/constants/app-api.config';
import { EncryDecryService } from 'src/app/shared/services';
import { FormValidatationsService } from 'src/app/shared/services/form-validatations.service';
import { CatProcuRequestsService } from '../services';

@Component({
  selector: 'app-cat-mgr-vendor-terms-condts',
  templateUrl: './cat-mgr-vendor-terms-condts.component.html',
  styleUrls: ['./cat-mgr-vendor-terms-condts.component.scss']
})
export class CatMgrVendorTermsCondtsComponent {
  pageRecordSize: any;
  pageOptions: any;
  defaultPermissions: any;
  loggedUserPermissions: any;
  loggedUserDetails: any;
  loggedUserName: any;
  roleName: any;
  currentView: any;
  isGMTView: boolean;
  catalogueForm: any;
  formErrorsArray: any;
  selectedData: null;
  catalogueData: any;

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
    const temp = JSON.parse(this.encryDecryService.get(localStorage.getItem('logData')));
    this.loggedUserPermissions = temp.details.listofPermission;
    this.loggedUserDetails = temp.details;
    this.loggedUserName = this.loggedUserDetails.username;
    this.roleName = this.loggedUserDetails.role.roleName;
    this.getVendorCatalogues();
    this.currentView = !localStorage.getItem('system-view') ? JSON.parse(localStorage.getItem('system-view')) : localStorage.getItem('system-view');

    this.isGMTView = [SystemViewConfig.GMT_BASIC, SystemViewConfig.GMT_BASIC_PLUS].includes(this.currentView) ? true : false;
    this.catalogueForm = new FormGroup({
      otherTerms: new FormControl('', [Validators.required, this.formValidatorService.alphaNumericNotNumericOnly]),
      paymentTerms: new FormControl('', [Validators.required, this.formValidatorService.alphaNumericNotNumericOnly]),
      freight: new FormControl('', [Validators.required, this.formValidatorService.alphaNumericNotNumericOnly]),
      packingAndForwarding: new FormControl('', [Validators.required, this.formValidatorService.alphaNumericNotNumericOnly]),

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



  isViewMode: boolean;
 
 

 



  getVendorCatalogues() {
    this.createRfqService.getVendorCatalogues({ id: this.loggedUserDetails.org.id }).subscribe((res: any) => {
      if (res && res.data && Array.isArray(res.data.catalogues)) {
        this.catalogueData = Array.isArray(res.data.catalogues)  && res.data.catalogues.length > 0 ? res.data.catalogues[0] : null;
        // this.isLoaded = true;
      }
      if (this.catalogueData) {
        this.isViewMode = true;
        this.catalogueForm.patchValue({
          otherTerms: this.catalogueData.otherTerms,
          paymentTerms: this.catalogueData.paymentTerms,
          freight: this.catalogueData.freight,
          packingAndForwarding: this.catalogueData.packingAndForwarding,
        })
      }
    })
  }

  onGridAction(event: any) {
    console.log(event)
  }

  

  resetForm() {
    this.catalogueForm.reset();
    if (this.catalogueData) {
      this.catalogueForm.patchValue({
        otherTerms: this.catalogueData.otherTerms,
        paymentTerms: this.catalogueData.paymentTerms,
        freight: this.catalogueData.freight,
        packingAndForwarding: this.catalogueData.packingAndForwarding,
      })
    }
  }

  onAddUpdateCatalogueDetails() {
 

    if (this.catalogueForm.valid) {
      const obj: any = {
        ...this.catalogueData,
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

import { Component } from '@angular/core';
import { EncryDecryService } from 'src/app/shared/services';
import { VendorRegistrationService } from 'src/app/vendor-registration/services/vendor-registration.service';
import { CreateRfqService } from '../services/create-rfq.service';
import { ToastrService } from 'ngx-toastr';
import { RfqService } from '../../vendor/services/rfq.service';
import { MatDialog } from '@angular/material/dialog';
import { AbstractControl, FormArray, FormBuilder, FormControl, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';

@Component({
  selector: 'app-vendor-profile',
  templateUrl: './vendor-profile.component.html',
  styleUrls: ['./vendor-profile.component.scss']
})
export class VendorProfileComponent {
  vendorRegObj: any = {
    division: '',
    category: ''
  }
  cards = [
    { title: 'Card 1', text: 'This is the first card.', img: 'https://via.placeholder.com/150',
      subscriptionContent:[

      ]
     },
    { title: 'Card 2', text: 'This is the second card.', img: 'https://via.placeholder.com/150' },
    { title: 'Card 3', text: 'This is the third card.', img: 'https://via.placeholder.com/150' }
  ];
  vendorForm: FormGroup;
  generalModel: {
    companyName: any; pan: any; gstin: any; msme: any;
    // 'msme':this.vendorRegObj.msme ? this.vendorRegObj.msme : 'no',
    address1: any;
    // 'address2':this.vendorRegObj.address2,
    city: any; state: any; zipCode: any;
  };
  loggedUserRole: any;
  loggedUserDetails: any; 
  selectedSubscription: any;
  selectedData: any[];
  rfqDataList: any[];
  cache_rfqDataList: any[];
   categoryList: any = [];
   divisionsList: any =[];
    filtered_divisionsList =[];
    filtered_categoryList: any = [];
    subscriptionPlansList= [
{
"id": "2001",
"createdBy": "Harshitha",
"lastModifiedBy": null,
"createdTS": null,
"lastModifiedTS": null,
"planName": "Connect",
"rfqClarification": true,
"rfqExpiryAlert": true,
"accumulatedRfqStatus": true,
"analyticsLevel": "Basic",
"automatedQuotation": false,
"buyerVisibility": "72 hours",
"catalogueCreation": false,
"dedicatedSupport": false,
"negotiationSupport": false,
"industryInsights": false,
"perRfqPrice": 100.0
},
{
"id": "2002",
"createdBy": "Harshitha",
"lastModifiedBy": null,
"createdTS": null,
"lastModifiedTS": null,
"planName": "Select",
"rfqClarification": true,
"rfqExpiryAlert": true,
"accumulatedRfqStatus": true,
"analyticsLevel": "Regular",
"automatedQuotation": true,
"buyerVisibility": "24 hours",
"catalogueCreation": true,
"dedicatedSupport": false,
"negotiationSupport": true,
"industryInsights": true,
"perRfqPrice": 150.0
},
{
"id": "2002",
"createdBy": "Harshitha",
"lastModifiedBy": null,
"createdTS": null,
"lastModifiedTS": null,
"planName": "Select",
"rfqClarification": true,
"rfqExpiryAlert": true,
"accumulatedRfqStatus": true,
"analyticsLevel": "Premium",
"automatedQuotation": true,
"buyerVisibility": "24 hours",
"catalogueCreation": true,
"dedicatedSupport": true,
"negotiationSupport": true,
"industryInsights": true,
"perRfqPrice":300.0
}];
  constructor(private vendorRegSer: VendorRegistrationService,  private encryDecryService: EncryDecryService,
    private dialog: MatDialog, 
            private rfqservice: RfqService,
            private toastrService: ToastrService,
            private createRfqService: CreateRfqService,
            private fb: FormBuilder
  ) {
        const temp = JSON.parse(this.encryDecryService.get('perm', localStorage.getItem('logData'))); 
        this.loggedUserDetails = temp.details; 
        if(this.loggedUserDetails){
          this.getVendorById(this.loggedUserDetails.id)
        }
        this.buildVendorForm();
          this.createRfqService.getGMTDivisions().subscribe((res: any) => {
            this.divisionsList = res || [];
        });

  }

  buildVendorForm(){
     this.vendorForm = this.fb.group({
              name: new FormControl('', [Validators.required,]), 
              organizationPhonenumber: new FormControl({value: '',  disabled: true}, [Validators.required]),
              mail: new FormControl({value: '',  disabled: true}, [Validators.required, Validators.email ]),
              gstin: new FormControl('', [gstinValidator()]), 
              products: new FormControl('', [Validators.required]), 
              pinCode: new FormControl('', [Validators.required]),
              categoryDivisions: this.fb.array(this.createCategoryDivisionGroups(5)),
              branches: this.fb.array([this.createBranch()])

            });

  }

  // for Branches creation
  get branches(): FormArray {
    return this.vendorForm.get('branches') as FormArray;
  }

  createBranch(): FormGroup {
    return this.fb.group({
      location: ['', Validators.required],
      city: ['', Validators.required],
      contactName: ['', Validators.required],
      mobileNumber: ['', Validators.required],
      EmailId: ['', Validators.required], 
    });
  }

  addBranch(): void {
    this.branches.push(this.createBranch());
  }

  removeBranch(index: number): void {
    this.branches.removeAt(index);
  }


  createCategoryDivisionGroup():FormGroup {
    return this.fb.group({
      category: ['', Validators.required], 
      division: ['', Validators.required]
    });
  }

   // Generate an array of FormGroups
  createCategoryDivisionGroups(count: number): FormGroup[] {
    return Array.from({ length: count }, () => this.createCategoryDivisionGroup());
  }

  // Getter for easy access in template
  get items(): FormArray {
    return this.vendorForm.get('categoryDivisions') as FormArray;
  }


  

  initialCalls(){
    this.selectedData = [];
        const req = { "id": this.loggedUserDetails.org.id };
        this.rfqservice.getAllCategoryRFQByGMTVendors(req).subscribe(data => { 
            this.categoryList = [];
            if (Array.isArray(data)) {
                this.rfqDataList = data.map((ele: any) => {
                    const desc = ele.query ? ele.query.split('|').join(" ") : '';
                    const status_display = ele['status'] && ele['status']['uiDisplay'] ? ele.status.uiDisplay : ele.status;
                    return { ...ele, status_ui_display: status_display, queryContent: desc }
                }) || [];
            } else {
                this.rfqDataList = [];
            }
            this.cache_rfqDataList = [...this.rfqDataList];
        });
  }

  
    filterRFQsBYDivision() {
        if (this.vendorRegObj.division) {
            this.onChangeDivision();
        } else {
            this.rfqDataList = [...this.cache_rfqDataList]
        }
    }

    onChangeDivision() {
        const obj = { "division": this.vendorRegObj.division };
        this.createRfqService.getGMTCategoriesByDivision(obj).subscribe((res: any) => {
            this.categoryList = res || [];
        });

        this.vendorRegObj.category = ''; 
    }
  getVendorById(id) {
    this.vendorRegObj = null;
    this.vendorRegSer.getVendorById({ id: id }).subscribe((response) => {
      this.vendorRegObj = response;
      console.log('response', response)
      // setTimeout(() => {
      this.bindData()
      // }, 500);

      // this.bindBranches();
    }, (error) => {

    });
  }

  bindData() {
    this.bindGeneralModelData();
  }

  bindGeneralModelData() {
    this.generalModel = {
      'companyName': this.vendorRegObj.companyName,
      'pan': this.vendorRegObj.pan,
      'gstin': this.vendorRegObj.gstin,
      'msme': this.vendorRegObj.msme,
      // 'msme':this.vendorRegObj.msme ? this.vendorRegObj.msme : 'no',
      'address1': this.vendorRegObj.address1,
      // 'address2':this.vendorRegObj.address2,
      'city': this.vendorRegObj.city,
      'state': this.vendorRegObj.state,
      'zipCode': this.vendorRegObj.zipCode
    };
  }


  updateVendorForm(){

  }

   filterAutoCompleteData(event, inputArrayName, outputArrayName, isStringType) {
         this[outputArrayName] = [];
        const query = isStringType ? event.query.toLowerCase() : event.query;

        this[outputArrayName] = this[inputArrayName].filter(ele => ele != null && (ele.toLowerCase().includes(query)));
    }

    getClassName(subData: any){
      return subData.analyticsLevel.toLowerCase() == 'basic' ?
      'yellowClass' : subData.analyticsLevel.toLowerCase() == 'regular'? 'blueClass' : 'purpleClass';

    }

    updateSubscription(subScription:string){
      this.selectedSubscription = subScription;
    }
}


export function gstinValidator(): ValidatorFn {
  const GSTIN_REGEX = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/;
  
  return (control: AbstractControl): ValidationErrors | null => {
    const value = control.value;
    if (!value) {
      return null; // Don't validate empty value here
    }
    return GSTIN_REGEX.test(value.toUpperCase()) ? null : { invalidGstin: true };
  };
}
import { Component } from '@angular/core';
import { EncryDecryService } from 'src/app/shared/services';
import { VendorRegistrationService } from 'src/app/vendor-registration/services/vendor-registration.service';
import { CreateRfqService } from '../services/create-rfq.service';
import { ToastrService } from 'ngx-toastr';
import { RfqService } from '../../vendor/services/rfq.service';
import { MatDialog } from '@angular/material/dialog';
import { AbstractControl, FormArray, FormBuilder, FormControl, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { filter } from 'rxjs';

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
    {
      title: 'Card 1', text: 'This is the first card.', img: 'https://via.placeholder.com/150',
      subscriptionContent: [

      ]
    },
    { title: 'Card 2', text: 'This is the second card.', img: 'https://via.placeholder.com/150' },
    { title: 'Card 3', text: 'This is the third card.', img: 'https://via.placeholder.com/150' }
  ];
  vendorForm: FormGroup;
  isFirstScreen: boolean = true;
  generalModel: {
    companyName: any; pan: any; gstin: any; msme: any;
    // 'msme':this.vendorRegObj.msme ? this.vendorRegObj.msme : 'no',
    address1: any;
    // 'address2':this.vendorRegObj.address2,
    city: any; state: any; zipCode: any;
  };
  loggedUserRole: any;
  loggedUserDetails: any;
  selectedSubscriptions: any = [];
  selectedData: any[];
  rfqDataList: any[];
  cache_rfqDataList: any[];
  categoryList: any = [];
  divisionsList: any = [];
  filtered_divisionsList = [];
  filtered_categoryList: any = [];
  subscriptionPlansList = [];
  isEdit: boolean = false;
  // [

  //   {
  //     "id": "2001",
  //     "createdBy": "Harshitha",
  //     "lastModifiedBy": null,
  //     "createdTS": null,
  //     "lastModifiedTS": null,
  //     "planName": "Connect",
  //     "rfqClarification": true,
  //     "rfqExpiryAlert": true,
  //     "accumulatedRfqStatus": true,
  //     "analyticsLevel": "Basic",
  //     "automatedQuotation": false,
  //     "buyerVisibility": "72 hours",
  //     "catalogueCreation": false,
  //     "dedicatedSupport": false,
  //     "negotiationSupport": false,
  //     "industryInsights": false,
  //     "perRfqPrice": 100.0
  //   },
  //   {
  //     "id": "2002",
  //     "createdBy": "Harshitha",
  //     "lastModifiedBy": null,
  //     "createdTS": null,
  //     "lastModifiedTS": null,
  //     "planName": "Select",
  //     "rfqClarification": true,
  //     "rfqExpiryAlert": true,
  //     "accumulatedRfqStatus": true,
  //     "analyticsLevel": "Regular",
  //     "automatedQuotation": true,
  //     "buyerVisibility": "24 hours",
  //     "catalogueCreation": true,
  //     "dedicatedSupport": false,
  //     "negotiationSupport": true,
  //     "industryInsights": true,
  //     "perRfqPrice": 150.0
  //   },
  //   {
  //     "id": "2003",
  //     "createdBy": "Harshitha",
  //     "lastModifiedBy": null,
  //     "createdTS": null,
  //     "lastModifiedTS": null,
  //     "planName": "Select",
  //     "rfqClarification": true,
  //     "rfqExpiryAlert": true,
  //     "accumulatedRfqStatus": true,
  //     "analyticsLevel": "Premium",
  //     "automatedQuotation": true,
  //     "buyerVisibility": "24 hours",
  //     "catalogueCreation": true,
  //     "dedicatedSupport": true,
  //     "negotiationSupport": true,
  //     "industryInsights": true,
  //     "perRfqPrice": 300.0
  //   }];
  divisionFormList:any =[]
  constructor(private vendorRegSer: VendorRegistrationService, private encryDecryService: EncryDecryService,
    private dialog: MatDialog,
    private rfqservice: RfqService,
    private toastrService: ToastrService,
    private createRfqService: CreateRfqService,
    private fb: FormBuilder
  ) {
    const temp = JSON.parse(this.encryDecryService.get('perm', localStorage.getItem('logData')));
    this.loggedUserDetails = temp.details;
    if (this.loggedUserDetails) {
      this.getVendorById(this.loggedUserDetails.org.id)
    }
    this.buildVendorForm();
   
    this.createRfqService.getSubscriptionsList().subscribe((res: any) => {
      this.subscriptionPlansList = res.data && res.data.plans ? res.data.plans : []
    });

    for(let i=0; i< 5; i++){
      this.divisionFormList.push({
        selectedCategory: '',
        selectedDivision: '',
        divisionList: [],
        categoryList: [],
        filtered_divisionList: [],
        filtered_categoryList: []
      });
    } 


    this.createRfqService.getGMTDivisions().subscribe((res: any) => {
      this.divisionsList = res || [];
      if( this.divisionsList.length > 0){
        this.filtered_divisionsList = this.divisionsList;
        this.divisionFormList.forEach((ele:any, index)=>{
          ele.divisionList = this.divisionsList;
          ele.categoryList = [];
        })
      } 
      
    });


    //     this.divisionsList = [
    //     {
    //         "divisionName": "Electrical",
    //         "id": 1,
    //         "categoryList": [
    //             "Cables & Wires",
    //             "Circuit Breakers",
    //             "Transformers"
    //         ]
    //     },
    //     {
    //         "divisionName": "Mechanical",
    //         "id": 2,
    //         "categoryList": [
    //             "Pumps",
    //             "Valves",
    //             "Compressors"
    //         ]
    //     },
    //     {
    //         "divisionName": "Civil",
    //         "id": 3,
    //         "categoryList": [
    //             "Cement",
    //             "Steel",
    //             "Bricks"
    //         ]
    //     }
    // ]


    // this.divisionsList = [
    //   "CAPEX - Equipment & Machinery",
    //   "Civil Works",
    //   "Engineering Spares - Electrical",
    //   "Engineering spares - Mechanical",
    //   "IT",
    //   "Logistics",
    //   "Occupational Health and Safety",
    //   "Packing Material",
    //   "Professional Services",
    //   "Raw Material"
    // ]

  }

  buildDivisionCategoryList(index, division) {

  }


  getCategoryByDivision(division) {
    const obj = { "division": division };
    // this.createRfqService.getGMTCategoriesByDivision(obj).subscribe((res: any) => {
    //   this.categoryList = res || [];
    // });
  }
  buildVendorForm() {
    this.vendorForm = this.fb.group({
      companyName: new FormControl('', [Validators.required,]),
      organizationPhonenumber: new FormControl({ value: '', disabled: true }, [Validators.required]),
      email: new FormControl({ value: '', disabled: true }, [Validators.required, Validators.email]),
      pan: new FormControl(''),
      address1: new FormControl(''),
      address2: new FormControl(''),
      city: new FormControl(''),
      zipCode: new FormControl(''),
      contactPerson: new FormControl(''),
      website: new FormControl(''),
      gstin: new FormControl('', [gstinValidator()]),
      products: new FormControl('', [Validators.required]),
      pinCode: new FormControl('', [Validators.required]),
      divisionCategories: this.fb.array(this.createCategoryDivisionGroups(5)),
      branches: this.fb.array([this.createBranch()])

    });

  }

  // for Branches creation
  get branches(): FormArray {
    return this.vendorForm.get('branches') as FormArray;
  }


  onItemSelected(event, index) {
    const obj = { "division": event.target.value };
    this.createRfqService.getGMTCategoriesByDivision(obj).subscribe((res: any) => {
      this.categoryList = res || [];
      if(this.categoryList.length > 0) {
        this.filtered_categoryList = this.categoryList;
        this.divisionFormList[index].filtered_categoryList = this.categoryList;
        this.divisionFormList[index].selectedDivision = event.value;
        this.divisionFormList[index].selectedCategory = '';
        this.divisionFormList[index].categoryList = this.categoryList;
      }
    });
    this.categoryList = [
      "Agriculture Equipments",
      "Conveyors",
      "Diesel Gensets",
      "Dumpers",
      "Excavators",
      "Fork Lifts",
      "Hydraulic Press",
      "Loaders",
      "Material Handling Equipments",
      "Panels",
      "Plastic Moulding Machine",
      "Tipper"
    ]
    const formArray = this.vendorForm.get('divisionCategories') as FormArray;
    formArray.at(index).get('category')?.setValue('');


  }

  createBranch(): FormGroup {
    return this.fb.group({
      branchName: ['', Validators.required],
      contactPerson: ['', Validators.required],
      email: ['', Validators.required],
      address: ['', Validators.required],
    });
  }

  addBranch(): void {
    this.branches.push(this.createBranch());
  }

  removeBranch(index: number): void {
    this.branches.removeAt(index);
  }


  createCategoryDivisionGroup(): FormGroup {
    return this.fb.group({
      category: ['' ],
      division: ['']
    });
  }

  // Generate an array of FormGroups
  createCategoryDivisionGroups(count: number): FormGroup[] {
    return Array.from({ length: count }, () => this.createCategoryDivisionGroup());
  }

  // Getter for easy access in template
  get items(): FormArray {
    return this.vendorForm.get('divisionCategories') as FormArray;
  }




  // initialCalls(){
  //   this.selectedData = [];
  //       const req = { "id": this.loggedUserDetails.org.id };
  //       this.rfqservice.getAllCategoryRFQByGMTVendors(req).subscribe(data => { 
  //           this.categoryList = [];
  //           if (Array.isArray(data)) {
  //               this.rfqDataList = data.map((ele: any) => {
  //                   const desc = ele.query ? ele.query.split('|').join(" ") : '';
  //                   const status_display = ele['status'] && ele['status']['uiDisplay'] ? ele.status.uiDisplay : ele.status;
  //                   return { ...ele, status_ui_display: status_display, queryContent: desc }
  //               }) || [];
  //           } else {
  //               this.rfqDataList = [];
  //           }
  //           this.cache_rfqDataList = [...this.rfqDataList];
  //       });
  // }


  filterRFQsBYDivision() {
    if (this.vendorRegObj.division) {
      this.onChangeDivision();
    } else {
      this.rfqDataList = [...this.cache_rfqDataList]
    }
  }

  onChangeDivision() {

  }
  getVendorById(id) {
    this.vendorRegObj = null;
    this.vendorRegSer.getGMTSellerById({ id: id }).subscribe((response) => {
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
    // companyName: new FormControl('', [Validators.required,]),
    // organizationPhonenumber: new FormControl({ value: '', disabled: true }, [Validators.required]),
    // email: new FormControl({ value: '', disabled: true }, [Validators.required, Validators.email]),
    // pan: new FormControl(''),
    // address1: new FormControl(''),
    // address2: new FormControl(''),
    // city: new FormControl(''),
    // zipCode: new FormControl(''),
    // contactPerson: new FormControl(''),
    // website: new FormControl(''),
    // gstin: new FormControl('', [gstinValidator()]),
    // products: new FormControl('', [Validators.required]),
    // pinCode: new FormControl('', [Validators.required]),
    // divisionCategories: this.fb.array(this.createCategoryDivisionGroups(5)),
    // branch
    this.vendorForm.patchValue(this.vendorRegObj);
    if (this.vendorRegObj.branches) {
      const skillsArray = this.vendorForm.get('branches') as FormArray;
      skillsArray.clear(); // Clear existing controls if any

      this.vendorRegObj.branches.forEach(skill => {
        skillsArray.push(
          this.fb.group({
            branchName: [skill.branchName],
            contactPerson: [skill.contactPerson],
            email: [skill.email],
            address: [skill.address]
          })
        );
      });

    }
    const skillsArrays = this.vendorForm.get('branches') as FormArray;
    skillsArrays.clear();
    skillsArrays.push(this.createBranch());


    if (this.vendorRegObj.branches) {
      const divisionCategories = [{ category: 'Fire Extinguishers', division: 'Occupational Health and Safety', email: 'abc@gmail.com', address: 'HMT' },
      { branchName: 'bng', category: 'Fire Extinguishers', division: 'Occupational Health and Safety', address: 'HMT' }
      ]
      this.vendorRegObj.divisionCategories = divisionCategories;
      const divisionArray = this.vendorForm.get('divisionCategories') as FormArray;
      divisionArray.clear(); // Clear existing controls if any
      //  category: ['', Validators.required],
      //       division: 
      this.vendorRegObj.divisionCategories.forEach((skill: any) => {
        divisionArray.push(
          this.fb.group({
            category: [{ value: skill.category, disabled: true }],
            division: [{ value: skill.division, disabled: true }],
          })
        );
      });
      if (this.vendorRegObj.divisionCategories.length < 5) {
        const remaining = 5 - this.vendorRegObj.divisionCategories.length;
        for (let i = 0; i < remaining; i++) {
          divisionArray.push(this.createCategoryDivisionGroup());
        }
      }

    }

    // this.bindGeneralModelData();
  }

  onEditCategory() {
    this.isEdit = !this.isEdit;
    if (this.isEdit) {
      const divisionArray = this.vendorForm.get('divisionCategories') as FormArray;
      divisionArray.controls.forEach(control => {
        control.get('category').enable();
        control.get('division').enable();
      });
      const skillsArrays = this.vendorForm.get('branches') as FormArray;
      skillsArrays.controls.forEach(control => {
        control.get('branchName').enable();
        control.get('contactPerson').enable();
        control.get('email').enable();
        control.get('address').enable();
      }); 
    } else {
      const divisionArray = this.vendorForm.get('divisionCategories') as FormArray;
      divisionArray.controls.forEach(control => {
        control.get('category').disable();
        control.get('division').disable();
      });
      const skillsArrays = this.vendorForm.get('branches') as FormArray;
      skillsArrays.controls.forEach(control => {
        control.get('branchName').disable();
        control.get('contactPerson').disable();
        control.get('email').disable();
        control.get('address').disable();
      });
    }
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



  filterAutoCompleteData(event, inputArrayName, isStringType, index) { 
    const query = isStringType ? event.query.toLowerCase() : event.query;

  
    if(inputArrayName == 'divisionsList'){
        const filtered_divisionList = this.divisionFormList[index].divisionList.filter(ele => ele != null && (ele.toLowerCase().includes(query)));

      this.divisionFormList[index].filtered_divisionList = filtered_divisionList;
    }
  }

  filterCategoryListByDivision(event, index) {
    const obj = { "division": event.target.value };
    this.createRfqService.getGMTCategoriesByDivision(obj).subscribe((res: any) => {
      this.categoryList = res || [];
      if(this.categoryList.length > 0) {
        this.filtered_categoryList = this.categoryList;
        this.divisionFormList[index].filtered_categoryList = this.categoryList;
        this.divisionFormList[index].selectedDivision = event.value;
        this.divisionFormList[index].selectedCategory = '';
        this.divisionFormList[index].categoryList = this.categoryList;
      }
    });
  }

  getClassName(subData: any) {
    return subData.analyticsLevel.toLowerCase() == 'basic' ?
      'yellowClass' : subData.analyticsLevel.toLowerCase() == 'regular' ? 'blueClass' : 'purpleClass';

  }

  goToNextScreen() {
    this.isFirstScreen = false;
  } 

  goToPreviousScreen() {
    this.isFirstScreen = true;
  }

  updateSubscription(selectedPlan: any, index: number) {
    const findIndex = this.selectedSubscriptions.map(plan => plan.id).findIndex((planId: any) => planId == selectedPlan.id);
    if (findIndex < 0) {
      this.selectedSubscriptions.push(selectedPlan);
    } else {
      this.selectedSubscriptions = this.selectedSubscriptions.filter((plan: any) => plan.id != selectedPlan.id)
    }

  }


  isMatchedPlan(id: string) {
    const findIndex = this.selectedSubscriptions.map(plan => plan.id).findIndex((planId: any) => planId == id);
    return findIndex < 0 ? false : true;
  }

  resetToOriginalState() {
    this.vendorForm.reset();

  }


  updateVendorForm() {
    // if (this.vendorForm.valid) {
      const obj = this.vendorForm.getRawValue();
      obj.id = this.vendorRegObj.id;
      obj.subscriptionPlans = this.selectedSubscriptions;
      console.log('obj', obj)
      this.createRfqService.updateSellerData(obj).subscribe((res: any) => {
        this.toastrService.success('Vendor Updated Successfully', 'Success');
        this.getVendorById(this.loggedUserDetails.org.id)
        this.isEdit = false;
      }, (error) => {
        this.toastrService.error('Error while updating vendor', 'Error');
      })
    // } else {
    //   this.toastrService.error('Please fill all required fields', 'Error');
    // }

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
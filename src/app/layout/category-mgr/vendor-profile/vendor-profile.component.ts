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
  selectedSubscription: any;
  selectedData: any[];
  rfqDataList: any[];
  cache_rfqDataList: any[];
  categoryList: any = [];
  divisionsList: any = [];
  filtered_divisionsList = [];
  filtered_categoryList: any = [];
  subscriptionPlansList = [];
  isEdit: boolean = false;
  stepsList = [
    { label: 'Basic Details' },
    { label: 'Subscription Plan Details' },
  ];

  currentStep = 1;
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
  divisionFormList: any = []
  isShowDivisions: boolean;
  roleName: any;
  loggedUserName: any;
  isBuyer: boolean = false;
  constructor(private vendorRegSer: VendorRegistrationService, private encryDecryService: EncryDecryService,
    private dialog: MatDialog,
    private rfqservice: RfqService,
    private toastrService: ToastrService,
    private createRfqService: CreateRfqService,
    private fb: FormBuilder
  ) {

    const temp = JSON.parse(this.encryDecryService.get('perm', localStorage.getItem('logData')));
    this.loggedUserDetails = temp.details;
    this.loggedUserName = this.loggedUserDetails.username;
    this.roleName = this.loggedUserDetails.role.roleName === 'Registration' ? 'Vendor' : this.loggedUserDetails.role.roleName;
    this.isBuyer = this.loggedUserDetails.role.roleName === 'ClientInitiator';
    if (this.loggedUserDetails) {
      if (this.isBuyer) {
        this.getBuyerDataById(this.loggedUserDetails.id)
      }else{
        this.getVendorById(this.loggedUserDetails.org.id)
      } 
    }
    this.buildVendorForm();

    this.createRfqService.getSubscriptionsList().subscribe((res: any) => {
      this.subscriptionPlansList = res.data && res.data.plans ? res.data.plans : []
    });

    for (let i = 0; i < 5; i++) {
      this.divisionFormList.push({
        selectedCategory: [],
        selectedDivision: '',
        divisionList: [],
        categoryList: [],
        filtered_divisionList: [],
        filtered_categoryList: []
      });
    }


    this.createRfqService.getGMTDivisions().subscribe((res: any) => {
      this.divisionsList = res || [];
      if (this.divisionsList.length > 0) {
        this.filtered_divisionsList = this.divisionsList;
        this.divisionFormList.forEach((ele: any, index) => {
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



  getCategoryByDivision(division) {
    const obj = { "division": division };
    // this.createRfqService.getGMTCategoriesByDivision(obj).subscribe((res: any) => {
    //   this.categoryList = res || [];
    // });
  }
  buildVendorForm() {
    this.vendorForm = this.fb.group({
      companyName: new FormControl({ value: '', disabled: true }, [Validators.required,]),
      organizationPhonenumber: new FormControl({ value: '', disabled: true }, [Validators.required]),
      email: new FormControl({ value: '', disabled: true }, [Validators.required, Validators.email]),
      pan: new FormControl(''),
      address1: new FormControl(''),
      address2: new FormControl(''),
      city: new FormControl('', [Validators.required]),
      website: new FormControl(''),
      gstin: new FormControl('', [gstinValidator()]),
      details: new FormControl('', []),
      zipCode: new FormControl('', [Validators.required]),
      divisionCategories: this.fb.array(this.createCategoryDivisionGroups(5))

    });

    if(!this.isBuyer){
      this.vendorForm.addControl('branches', this.fb.array([this.createBranch()]) );
    }



    console.log('vendorForm', this.vendorForm)

  }

  // for Branches creation
  get branches(): FormArray {
    return this.vendorForm.get('branches') as FormArray;
  }


  numberOnly(event): boolean {
    const charCode = event.which ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;
  }

  onItemSelected(event, index) {
    const obj = { "division": event.target.value };
    this.createRfqService.getGMTCategoriesByDivision(obj).subscribe((res: any) => {
      this.categoryList = res || [];
      if (this.categoryList.length > 0) {
        this.filtered_categoryList = this.categoryList;
        this.divisionFormList[index].filtered_categoryList = this.categoryList;
        this.divisionFormList[index].selectedDivision = event.value;
        this.divisionFormList[index].selectedCategory = [];
        this.divisionFormList[index].categoryList = this.categoryList;
      }
    });
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
      category: [''],
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

  getBuyerDataById(id) {
    this.vendorRegObj = null;
    this.createRfqService.getBuyerDataById({ id: id }).subscribe((response) => {
      this.vendorRegObj = response;
      console.log('response', response) 
      this.bindData() 
    }, (error) => {

    });
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
    this.isShowDivisions = false;
    this.vendorForm.patchValue(this.vendorRegObj);
    if (this.vendorRegObj.branches && !this.isBuyer) {
      const skillsArray = this.vendorForm.get('branches') as FormArray;
      skillsArray.clear(); // Clear existing controls if any

      this.vendorRegObj.branches.forEach((skill: any) => {
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



    // const divisionCategories = [{ category: 'Fire Extinguishers', division: 'Occupational Health and Safety', email: 'abc@gmail.com', address: 'HMT' },
    // { branchName: 'bng', category: 'Fire Extinguishers', division: 'Occupational Health and Safety', address: 'HMT' }
    // ]
    // this.vendorRegObj.divisionCategories = divisionCategories;
    if (this.vendorRegObj.divisionCategories) {

      const divisionArray = this.vendorForm.get('divisionCategories') as FormArray;


      divisionArray.clear();
      const grouped = this.vendorRegObj.divisionCategories.reduce((acc, item) => {
        const key = item.division;
        if (!acc[key]) {
          acc[key] = [];
        }
        acc[key].push(item.category);
        return acc;
      }, {});

      // Convert to array format if needed
      const finalDivisionCategories = Object.entries(grouped).map(([division, categories]) => ({
        division,
        categories
      }));

      finalDivisionCategories.forEach((skill: any, index: any) => {
        this.divisionFormList[index].selectedDivision = skill.division;
        this.getCategoryListAndBindForInitialValue(skill.division, index, skill.categories);
        divisionArray.push(
          this.fb.group({
            category: [skill.categories],
            division: [skill.division],
          })
        );
      });
      if (finalDivisionCategories.length < 5) {
        const remaining = 5 - finalDivisionCategories.length;
        for (let i = 0; i < remaining; i++) {
          divisionArray.push(this.createCategoryDivisionGroup());
        }
      }

    }
    this.selectedSubscription = this.vendorRegObj.subscriptionPlan;

    setTimeout(() => {
      this.isShowDivisions = true;
    }, 500);

      if(!this.isBuyer){
         this.addBranch();
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


    if (inputArrayName == 'divisionsList') {
      const filtered_divisionList = this.divisionFormList[index].divisionList.filter(ele => ele != null && (ele.toLowerCase().includes(query)));

      this.divisionFormList[index].filtered_divisionList = filtered_divisionList;
    }
  }

  filterCategoryListByDivision(event, index) {
    const value = event.target.value;
    const divisionArray = this.vendorForm.get('divisionCategories') as FormArray;
    if(value && this.divisionFormList.filter(ele => ele.selectedDivision === value).length > 0){
      this.toastrService.error('This division is already selected. Please choose a different division.', 'Error');
      divisionArray.at(index).get('division')?.setValue('');
      this.divisionFormList[index].selectedDivision = '';
      this.divisionFormList[index].categoryList = [];
      this.divisionFormList[index].selectedCategory = [];
      this.divisionFormList[index].filtered_categoryList = [];
      return;
    }
      const obj = { "division": event.target.value };
      this.divisionFormList[index].selectedDivision =event.target.value;
      this.createRfqService.getGMTCategoriesByDivision(obj).subscribe((res: any) => {
        this.categoryList = res || [];
        if (this.categoryList.length > 0) {
        this.filtered_categoryList = this.categoryList;
        this.divisionFormList[index].filtered_categoryList = this.categoryList;
        this.divisionFormList[index].selectedDivision = event.target.value;
        this.divisionFormList[index].selectedCategory = [];
        this.divisionFormList[index].categoryList = this.categoryList;
      }
    });
  }

  getCategoryListAndBindForInitialValue(division, index, category) {
    const obj = { "division": division };
    this.createRfqService.getGMTCategoriesByDivision(obj).subscribe((res: any) => {
      this.categoryList = res || [];
      if (this.categoryList.length > 0) {
        this.filtered_categoryList = this.categoryList;
        this.divisionFormList[index].filtered_categoryList = this.categoryList;
        this.divisionFormList[index].categoryList = this.categoryList;
        this.divisionFormList[index].selectedCategory = category;
      }
    });
  }

  getClassName(subData: any) {
    return subData.analyticsLevel.toLowerCase() == 'basic' ?
      'yellowClass' : subData.analyticsLevel.toLowerCase() == 'regular' ? 'blueClass' : 'purpleClass';

  }

  goToNextScreen() {
    this.isFirstScreen = false;
    this.currentStep = 2;
  }

  goToPreviousScreen() {
    this.isFirstScreen = true;
    this.currentStep = 1;
  }

  updateSubscription(selectedPlan: any) {
    if (this.selectedSubscription && selectedPlan.id == this.selectedSubscription.id) {
      this.selectedSubscription = '';
      return;
    }
    this.selectedSubscription = selectedPlan;
  }

  isMatchedCategory(index, val: string) {
    return this.divisionFormList[index].selectedCategory && this.divisionFormList[index].selectedCategory.indexOf(val) > -1;
  }

  isMatchedPlan(id: string) {
    return this.selectedSubscription && this.selectedSubscription.id === id ? true : false;
  }

  resetToOriginalState() {
    this.vendorForm.reset();
    this.bindData();
    this.isEdit = false;
    this.isFirstScreen = true;
    this.currentStep = 1;

  }


  updateVendorForm() {
    // if (this.vendorForm.valid) { 
    if(this.vendorForm.controls.zipCode?.errors){
      this.toastrService.error('Please enter valid Pincode', 'Error');
      return;
    }
    if(this.vendorForm?.controls?.gstin?.errors?.invalidGstin){
      this.toastrService.error('Please enter valid GSTIN', 'Error');
      return;
    } 
    
    const obj = this.vendorForm.getRawValue();
    obj.id = this.vendorRegObj.id;
    obj.subscriptionPlan = this.selectedSubscription ? { id: this.selectedSubscription.id } : '';
    console.log('obj', obj)
    if(!this.isBuyer){
      obj.branches = obj.branches.filter(ele => ele.branchName && ele.contactPerson && ele.email && ele.address);
      
    }
    let divisionCategoriesList= [];
    if(this.divisionFormList.length>0){
      this.divisionFormList.forEach((element, index) => {
        if(element.selectedDivision && element.selectedCategory && element.selectedCategory.length>0){
          element.selectedCategory.forEach(catEle => {
            divisionCategoriesList.push({division: element.selectedDivision, category: catEle})
          });
        }
        if( element.selectedCategory.length < 1){
          this.divisionFormList[index].selectedDivision = '';
          this.divisionFormList[index].categoryList = [];
        }
      });
    }
    obj.divisionCategories = divisionCategoriesList;
    if (this.isBuyer) {
      obj.id = this.vendorRegObj.id;
      obj.userId = this.vendorRegObj.userId;
      delete obj.subscriptionPlan;
      this.createRfqService.updateBuyerData(obj).subscribe((res: any) => {
        this.toastrService.success('Buyer Updated Successfully', 'Success');
        this.getBuyerDataById(this.loggedUserDetails.id)
        this.isEdit = false;
        this.isFirstScreen = true;
      }, (error) => {
        this.toastrService.error('Error while updating buyer', 'Error');
      });
    } else {
     
      
    // obj.branches = obj.branches.filter(ele => ele.branch
    this.createRfqService.updateSellerData(obj).subscribe((res: any) => {
      this.toastrService.success('Vendor Updated Successfully', 'Success');
      this.getVendorById(this.loggedUserDetails.org.id)
      this.isEdit = false;
      this.isFirstScreen = true;
    }, (error) => {
      this.toastrService.error('Error while updating vendor', 'Error');
    })
    // } else {
    //   this.toastrService.error('Please fill all required fields', 'Error');
    // }
  }
}

isCategorySelected(i, val){
  return false //this.divisionFormList[i].selectedCategory && this.divisionFormList[i].selectedCategory.indexOf(val) > -1;
}

onCategoryChange(event, divisionIndex, categoryIndex){
  const value = event.target.value;
  const categoryList = this.divisionFormList[divisionIndex].categoryList;
  this.divisionFormList[divisionIndex].categoryList = []
  if (event.target.checked) {
    const allSelectedCategories = this.divisionFormList.flatMap(item => item.selectedCategory);
  console.log("All selected categories:", allSelectedCategories);
  console.log("Total count:", allSelectedCategories.length);
  if (allSelectedCategories.length >= 5) {
    this.toastrService.warning('You can select a maximum of 5 categories across all divisions.', 'Warning');
    // Revert the checkbox state
    event.target.checked = false;
    this.divisionFormList[divisionIndex].categoryList = categoryList;
    return;
  }

    const index = this.divisionFormList[divisionIndex].selectedCategory ? this.divisionFormList[divisionIndex].selectedCategory.indexOf(value) : -1;
    if (index > -1) {
      this.divisionFormList[divisionIndex].selectedCategory.splice(index, 1);
    } else {
      this.divisionFormList[divisionIndex].selectedCategory.push(value);
    }
  } else {
    const index = this.divisionFormList[divisionIndex].selectedCategory ? this.divisionFormList[divisionIndex].selectedCategory.indexOf(value) : -1;
    if (index > -1) {
      this.divisionFormList[divisionIndex].selectedCategory.splice(index, 1);
    }
  }
  setTimeout(() => {
    this.divisionFormList[divisionIndex].categoryList = categoryList;
  }, 10);
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
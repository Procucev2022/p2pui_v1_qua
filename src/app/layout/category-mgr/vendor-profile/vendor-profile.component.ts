import { Component, Optional } from '@angular/core';
import { EncryDecryService } from 'src/app/shared/services';
import { AuthenticationService } from 'src/app/shared/services/authentication.service';
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
  activeTabIndex: number = 0;
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
  isValidPincode: boolean = false;

  // Demo buyer verification properties
  isDemoBuyer: boolean = false;
  isMobileOTPSent: boolean = false;
  isMobileOTPVerified: boolean = false;
  mobileOtpValue: string = '';
  isSendingOtp: boolean = false;
  isVerifyingOtp: boolean = false;
  enableResendOtpBtn: boolean = false;
  resendCountdown: number = 30;
  resendInterval: any = null;

  isEmailOTPSent: boolean = false;
  isEmailOTPVerified: boolean = false;
  emailOtpValue: string = '';
  isSendingEmailOtp: boolean = false;
  isVerifyingEmailOtp: boolean = false;
  enableResendEmailOtpBtn: boolean = false;
  resendEmailCountdown: number = 30;
  resendEmailInterval: any = null;

  pendingRfqsCount: number = 0;

  // Demo buyer password change properties
  needsPasswordChange: boolean = false;
  changePwdObj = {
    oldPassword: '',
    newPassword: '',
    confirmPassword: ''
  };
  isUpdatingPassword: boolean = false;
  passwordChangedSuccess: boolean = false;

  constructor(private vendorRegSer: VendorRegistrationService, private encryDecryService: EncryDecryService,
    private dialog: MatDialog,
    private rfqservice: RfqService,
    private toastrService: ToastrService,
    private createRfqService: CreateRfqService,
    private fb: FormBuilder,
    @Optional() private authService?: AuthenticationService
  ) {

    const temp = JSON.parse(this.encryDecryService.get(localStorage.getItem('logData')));
    this.loggedUserDetails = temp.details;
    this.loggedUserName = this.loggedUserDetails.username;
    this.roleName = this.loggedUserDetails.role.roleName === 'Registration' ? 'Vendor' : this.loggedUserDetails.role.roleName;
    this.isBuyer = this.loggedUserDetails.role.roleName === 'ClientInitiator';
    this.buildVendorForm();
    if (this.loggedUserDetails) {
      if (this.isBuyer) {
        this.getBuyerDataById(this.loggedUserDetails.id);
        this.checkDemoBuyerStatus();
      } else {
        this.getVendorById(this.loggedUserDetails.org.id);
      }
    }

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
      zipCode: new FormControl('', [Validators.required, Validators.pattern('^[1-9][0-9]{5}$')]),
      divisionCategories: this.fb.array(this.createCategoryDivisionGroups(5))

    });

    if (!this.isBuyer) {
      this.vendorForm.addControl('branches', this.fb.array([this.createBranch()]));
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

  checkDemoBuyerStatus() {
    const email = this.loggedUserName;
    if (this.loggedUserDetails?.resetPassword === true) {
      this.needsPasswordChange = true;
    }
    if (email) {
      this.createRfqService.getBuyerProfileStatus(email).subscribe((res: any) => {
        if (res && res.data) {
          const data = res.data;
          this.pendingRfqsCount = data.pendingRfqsCount || 0;
          if (data.resetPassword === true) {
            this.needsPasswordChange = true;
          }
          if ((data.isDemoBuyer === true || data.verificationStatus === 'DEMO_BUYER' || data.isDemoPhone === true)
              && data.verificationStatus !== 'PROFILE_COMPLETED') {
            this.isDemoBuyer = true;
            this.isMobileOTPVerified = false;
            this.vendorForm.get('organizationPhonenumber')?.enable();
            this.vendorForm.get('companyName')?.enable();
            const currentPhone = this.vendorForm.get('organizationPhonenumber')?.value;
            if (currentPhone && (currentPhone.includes('9999999991') || currentPhone.includes('0000000000'))) {
              this.vendorForm.get('organizationPhonenumber')?.setValue('');
            }
          }
        }
      }, () => {
        if ((this.loggedUserDetails?.verificationStatus === 'DEMO_BUYER' || this.loggedUserDetails?.sourceType === 'EMAIL')
            && this.loggedUserDetails?.verificationStatus !== 'PROFILE_COMPLETED') {
          this.isDemoBuyer = true;
          this.vendorForm.get('organizationPhonenumber')?.enable();
          this.vendorForm.get('companyName')?.enable();
        }
      });
    }
  }

  submitPasswordChange() {
    if (!this.changePwdObj.oldPassword) {
      this.toastrService.error('Please enter your current temporary password.', 'Current Password Required');
      return;
    }
    if (!this.changePwdObj.newPassword || this.changePwdObj.newPassword.length < 8) {
      this.toastrService.error('New password must be at least 8 characters long.', 'Password Too Short');
      return;
    }
    if (this.changePwdObj.newPassword !== this.changePwdObj.confirmPassword) {
      this.toastrService.error('New password and confirm password do not match.', 'Mismatch');
      return;
    }
    if (!this.authService) {
      this.toastrService.error('Authentication service not available.', 'Error');
      return;
    }
    const phone = this.vendorForm.get('organizationPhonenumber')?.value || this.loggedUserDetails?.phone || '';
    const rawPhone = phone ? phone.toString().replace(/[^0-9]/g, '') : '';
    const obj = {
      userName: this.loggedUserName,
      phone: rawPhone,
      password: this.changePwdObj.oldPassword,
      newpassword: this.changePwdObj.newPassword
    };
    this.isUpdatingPassword = true;
    this.authService.updatePassword(obj).subscribe((res: any) => {
      this.isUpdatingPassword = false;
      if (res && (res.status === 'Success' || res.status === 'SUCCESS' || res.statusCode === 200)) {
        this.toastrService.success('Password updated successfully! Your account is now secured.', 'Success');
        this.needsPasswordChange = false;
        this.passwordChangedSuccess = true;
        this.changePwdObj = { oldPassword: '', newPassword: '', confirmPassword: '' };
        if (this.loggedUserDetails) {
          this.loggedUserDetails.resetPassword = false;
          const k = this.encryDecryService.set(JSON.stringify({ 'details': this.loggedUserDetails }));
          localStorage.setItem('logData', k);
        }
      } else {
        this.toastrService.error(res?.message || 'Failed to update password.', 'Error');
      }
    }, (err: any) => {
      this.isUpdatingPassword = false;
      const msg = err?.error?.message || err?.message || 'Failed to update password. Please check your current password.';
      this.toastrService.error(msg, 'Error');
    });
  }

  sendMobileOtp() {
    const rawPhone = this.vendorForm.get('organizationPhonenumber')?.value;
    const phone = rawPhone ? rawPhone.toString().replace(/[^0-9]/g, '') : '';
    if (!phone || phone.length !== 10) {
      this.toastrService.error('Please enter a valid 10-digit mobile number.', 'Invalid Mobile');
      return;
    }
    if (phone === '9999999991' || phone === '0000000000') {
      this.toastrService.error('Please enter your actual mobile number, not the placeholder.', 'Invalid Mobile');
      return;
    }
    this.isSendingOtp = true;
    const email = this.loggedUserName;
    this.createRfqService.sendBuyerPhoneOtp(email, phone).subscribe((res: any) => {
      this.isSendingOtp = false;
      this.isMobileOTPSent = true;
      this.toastrService.success(res.message || 'OTP sent to mobile number.', 'Success');
      this.startResendTimer();
    }, (err) => {
      this.isSendingOtp = false;
      const msg = err?.error?.message || err?.message || 'Failed to send OTP to mobile.';
      this.toastrService.error(msg, 'Error');
    });
  }

  verifyMobileOtp() {
    const rawPhone = this.vendorForm.get('organizationPhonenumber')?.value;
    const phone = rawPhone ? rawPhone.toString().replace(/[^0-9]/g, '') : '';
    const otp = this.mobileOtpValue ? this.mobileOtpValue.trim() : '';
    if (!otp || otp.length < 4) {
      this.toastrService.error('Please enter a valid OTP.', 'Invalid OTP');
      return;
    }
    this.isVerifyingOtp = true;
    const email = this.loggedUserName;
    this.createRfqService.verifyBuyerPhoneOtp(email, phone, otp).subscribe((res: any) => {
      this.isVerifyingOtp = false;
      this.isMobileOTPVerified = true;
      this.vendorForm.get('organizationPhonenumber')?.disable();
      this.toastrService.success('Mobile number verified successfully!', 'Verified');
    }, (err) => {
      this.isVerifyingOtp = false;
      const msg = err?.error?.message || err?.message || 'Invalid or expired OTP.';
      this.toastrService.error(msg, 'Verification Failed');
    });
  }

  startResendTimer() {
    this.enableResendOtpBtn = false;
    this.resendCountdown = 30;
    if (this.resendInterval) {
      clearInterval(this.resendInterval);
    }
    this.resendInterval = setInterval(() => {
      this.resendCountdown--;
      if (this.resendCountdown <= 0) {
        clearInterval(this.resendInterval);
        this.enableResendOtpBtn = true;
      }
    }, 1000);
  }

  sendEmailOtp() {
    const email = this.loggedUserName;
    if (!email) {
      this.toastrService.error('User email not found.', 'Error');
      return;
    }
    this.isSendingEmailOtp = true;
    this.createRfqService.sendBuyerEmailOtp(email).subscribe((res: any) => {
      this.isSendingEmailOtp = false;
      this.isEmailOTPSent = true;
      this.toastrService.success(res.message || 'OTP sent to your email address.', 'Success');
      this.startResendEmailTimer();
    }, (err) => {
      this.isSendingEmailOtp = false;
      const msg = err?.error?.message || err?.message || 'Failed to send OTP to email.';
      this.toastrService.error(msg, 'Error');
    });
  }

  verifyEmailOtp() {
    const email = this.loggedUserName;
    const otp = this.emailOtpValue ? this.emailOtpValue.trim() : '';
    if (!otp || otp.length < 4) {
      this.toastrService.error('Please enter a valid OTP.', 'Invalid OTP');
      return;
    }
    this.isVerifyingEmailOtp = true;
    this.createRfqService.verifyBuyerEmailOtp(email, otp).subscribe((res: any) => {
      this.isVerifyingEmailOtp = false;
      this.isEmailOTPVerified = true;
      this.toastrService.success('Email verified successfully!', 'Verified');
    }, (err) => {
      this.isVerifyingEmailOtp = false;
      const msg = err?.error?.message || err?.message || 'Invalid or expired OTP.';
      this.toastrService.error(msg, 'Verification Failed');
    });
  }

  startResendEmailTimer() {
    this.enableResendEmailOtpBtn = false;
    this.resendEmailCountdown = 30;
    if (this.resendEmailInterval) {
      clearInterval(this.resendEmailInterval);
    }
    this.resendEmailInterval = setInterval(() => {
      this.resendEmailCountdown--;
      if (this.resendEmailCountdown <= 0) {
        clearInterval(this.resendEmailInterval);
        this.enableResendEmailOtpBtn = true;
      }
    }, 1000);
  }

  ngOnDestroy() {
    if (this.resendInterval) {
      clearInterval(this.resendInterval);
    }
    if (this.resendEmailInterval) {
      clearInterval(this.resendEmailInterval);
    }
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
    if (!this.vendorForm) return;
    this.vendorForm.patchValue(this.vendorRegObj);
    if (this.isDemoBuyer) {
      this.vendorForm.get('companyName')?.enable();
      if (this.isMobileOTPVerified) {
        this.vendorForm.get('organizationPhonenumber')?.disable();
      } else {
        this.vendorForm.get('organizationPhonenumber')?.enable();
        const currentPhone = this.vendorForm.get('organizationPhonenumber')?.value;
        if (currentPhone && (currentPhone.includes('9999999991') || currentPhone.includes('0000000000'))) {
          this.vendorForm.get('organizationPhonenumber')?.setValue('');
        }
      }
    }
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

      this.vendorForm.get('city')?.disable();

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

    if (!this.isBuyer) {
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
    if (value && this.divisionFormList.filter(ele => ele.selectedDivision === value).length > 0) {
      this.toastrService.error('This division is already selected. Please choose a different division.', 'Error');
      divisionArray.at(index).get('division')?.setValue('');
      this.divisionFormList[index].selectedDivision = '';
      this.divisionFormList[index].categoryList = [];
      this.divisionFormList[index].selectedCategory = [];
      this.divisionFormList[index].filtered_categoryList = [];
      return;
    }
     this.activeTabIndex = -1;
     // reset category search query for 5 indexes
     for (let i = 0; i < 5; i++) {
       this.divisionFormList[i].categorySearchQuery = '';
     }
    const obj = { "division": event.target.value };
    this.divisionFormList[index].selectedDivision = event.target.value;
    this.createRfqService.getGMTCategoriesByDivision(obj).subscribe((res: any) => {
      this.categoryList = res || [];
      if (this.categoryList.length > 0) {
        this.filtered_categoryList = this.categoryList;
        this.divisionFormList[index].filtered_categoryList = this.categoryList;
        this.divisionFormList[index].selectedDivision = event.target.value;
        this.divisionFormList[index].selectedCategory = [];
        this.divisionFormList[index].categoryList = this.categoryList; 
      }
         this.activeTabIndex = index;
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
        this.divisionFormList[index].categorySearchQuery = '';
      }
    });
  }

  onCategorySearch(event, index) {
    const query = event.target.value.toLowerCase();
    this.divisionFormList[index].categorySearchQuery = event.target.value;
    const filtered_categoryList = this.divisionFormList[index].filtered_categoryList.filter(ele => ele != null && (ele.toLowerCase().includes(query)));
    // this.divisionFormList[index].categoryList = [];
    // setTimeout(() => {
      this.divisionFormList[index].categoryList = filtered_categoryList;
    // }, 10);
    
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
    if (this.vendorForm.controls.zipCode?.errors) {
      this.toastrService.error('Please enter valid Pincode', 'Error');
      return;
    }
    if (this.vendorForm?.controls?.gstin?.errors?.invalidGstin) {
      this.toastrService.error('Please enter valid GSTIN', 'Error');
      return;
    }
    if (!this.isValidPincode && this.vendorForm.controls.zipCode?.value != this.vendorRegObj.zipCode) {
      this.toastrService.error('Please Validate Pincode', 'Error');
      return;
    }

    if (this.isDemoBuyer && !this.isMobileOTPVerified) {
      this.toastrService.error('Please verify your mobile number with OTP before completing your profile.', 'Mobile Verification Required');
      return;
    }
    if (this.isDemoBuyer && !this.isEmailOTPVerified) {
      this.toastrService.error('Please verify your email address with OTP before completing your profile.', 'Email Verification Required');
      return;
    }
    if (this.isDemoBuyer && !this.isValidPincode) {
      this.toastrService.error('Please click Validate to verify your Pincode.', 'Pincode Validation Required');
      return;
    }

    const obj = this.vendorForm.getRawValue();
    obj.id = this.vendorRegObj.id;
    obj.subscriptionPlan = this.selectedSubscription ? { id: this.selectedSubscription.id } : '';
    console.log('obj', obj)
    if (!this.isBuyer) {
      obj.branches = obj.branches.filter(ele => ele.branchName && ele.contactPerson && ele.email && ele.address);

    }
    let divisionCategoriesList = [];
    if (this.divisionFormList.length > 0) {
      this.divisionFormList.forEach((element, index) => {
        if (element.selectedDivision && element.selectedCategory && element.selectedCategory.length > 0) {
          element.selectedCategory.forEach(catEle => {
            divisionCategoriesList.push({ division: element.selectedDivision, category: catEle })
          });
        }
        if (element.selectedCategory.length < 1) {
          this.divisionFormList[index].selectedDivision = '';
          this.divisionFormList[index].categoryList = [];
        }
      });
    }
    obj.divisionCategories = divisionCategoriesList;
    if (obj.divisionCategories.length < 1 && this.isShowDivisions && !this.isDemoBuyer) {
      this.toastrService.error('Please select at least one division and category', 'Error');
      return;
    }
    if (this.isBuyer) {
      obj.id = this.vendorRegObj.id;
      obj.userId = this.vendorRegObj.userId;
      delete obj.subscriptionPlan;

      if (this.isDemoBuyer) {
        const rawPhone = this.vendorForm.get('organizationPhonenumber')?.value;
        const phone = rawPhone ? rawPhone.toString().replace(/[^0-9]/g, '') : '';
        const completionPayload = {
          email: this.loggedUserName,
          phone: phone,
          fullName: obj.companyName || this.loggedUserDetails?.fullName,
          companyName: obj.companyName,
          address1: obj.address1,
          city: this.vendorForm.get('city')?.value || obj.city,
          state: this.vendorForm.get('state')?.value || obj.state,
          pincode: obj.zipCode,
          gstin: obj.gstin
        };
        this.createRfqService.completeBuyerProfile(completionPayload).subscribe((res: any) => {
          this.createRfqService.updateBuyerData(obj).subscribe(() => {});
          this.toastrService.success('Profile completed and verified successfully! Your pending RFQ is now being processed.', 'Success');
          this.isDemoBuyer = false;
          this.isMobileOTPVerified = true;
          const normalizedPhone = '+91' + phone;
          localStorage.setItem('loggedUserMobile', normalizedPhone);
          if (this.loggedUserDetails) {
            this.loggedUserDetails.verificationStatus = 'PROFILE_COMPLETED';
            this.loggedUserDetails.phone = normalizedPhone;
            const k = this.encryDecryService.set(JSON.stringify({ 'details': this.loggedUserDetails }));
            localStorage.setItem('logData', k);
          }
          this.getBuyerDataById(this.loggedUserDetails.id);
          this.isEdit = false;
          this.isFirstScreen = true;
        }, (error) => {
          this.toastrService.error(error?.error?.message || 'Error while completing buyer profile', 'Error');
        });
        return;
      }

      this.createRfqService.updateBuyerData(obj).subscribe((res: any) => {
        this.toastrService.success('Buyer Updated Successfully', 'Success');
        this.getBuyerDataById(this.loggedUserDetails.id)
        this.isEdit = false;
        this.isFirstScreen = true;
      }, (error) => {
        this.toastrService.error('Error while updating buyer', 'Error');
      });
    } else {

      obj.subscriptionPlan = this.selectedSubscription ? this.selectedSubscription : null;
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

  isCategorySelected(i, val) {
    return false //this.divisionFormList[i].selectedCategory && this.divisionFormList[i].selectedCategory.indexOf(val) > -1;
  }

  onupdatePincodeValidationStatus(event: any) {
    console.log('Pincode validation status event:', event);
    if (event && event.pincodeIsValid) {
      this.isValidPincode = true;
      if (event.city) {
        this.vendorForm.get('city')?.setValue(event.city);
      }
      if (event.state) {
        this.vendorForm.get('state')?.setValue(event.state);
      }
    } else {
      this.isValidPincode = false;
    }
  }

  handleTabChange(event: any) {
    this.activeTabIndex = event.index;
  }

  onCategoryChange(event, divisionIndex, categoryIndex) {
    const value = event.target.value;
    const categoryList = this.divisionFormList[divisionIndex].categoryList;
    this.divisionFormList[divisionIndex].categoryList = []
    if (event.target.checked) {
      const allSelectedCategories = this.divisionFormList.flatMap(item => item.selectedCategory);
      console.log("All selected categories:", allSelectedCategories);
      console.log("Total count:", allSelectedCategories.length);
      if ((allSelectedCategories.length >= 10 && this.roleName == 'ClientInitiator')) { // For Buyer, max 10 categories
        this.toastrService.warning('You can select a maximum of 10 categories across all divisions.', 'Warning');
        // Revert the checkbox state
        event.target.checked = false;
        this.divisionFormList[divisionIndex].categoryList = categoryList;
        return;
      }
      if (allSelectedCategories.length >= 5 && this.roleName != 'ClientInitiator') { // Seller /vendor  max 5 categories
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
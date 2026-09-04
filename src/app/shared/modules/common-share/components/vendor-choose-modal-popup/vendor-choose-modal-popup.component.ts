import { Component, EventEmitter, Inject, Input, OnChanges, OnInit, Optional, Output, SimpleChanges } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { AppApiConfig } from 'src/app/shared/constants/app-api.config';
import { EncryDecryService } from 'src/app/shared/services';
import { FormValidatationsService } from 'src/app/shared/services/form-validatations.service';
import { CreateRfqService } from 'src/app/layout/category-mgr/services/create-rfq.service';

@Component({
  selector: 'app-vendor-choose-modal-popup',
  templateUrl: './vendor-choose-modal-popup.component.html',
  styleUrls: ['./vendor-choose-modal-popup.component.scss']
})
export class VendorChooseModalPopupComponent implements OnChanges, OnInit{
  loggedUserDetails: any;
  roleName: any;
  loggedUserPermissions: any;
  @Input('parentData') parentData: any;
  @Input('vendorList') vendorList: any = [];
  @Input('totalRecords') totalRecords: number = 0;
  @Input('pageSize') pageSize : number = 0;
  @Input('searchTextValue') searchTextValue : string = '';
  @Input('searchBy') searchBy : string = '';
  @Input('searchDropdownOptions')searchDropdownOptions: any = [];
  @Input('vendorGridData')vendorGridData: any = [];  
  @Output() onAddNewVendor: EventEmitter<any> = new EventEmitter(); 
  @Output() onPageChange: EventEmitter<any> = new EventEmitter();
  @Output() onSearchMode: EventEmitter<any> = new EventEmitter(); 
  @Output() globalSearch: EventEmitter<any> = new EventEmitter(); 
  @Output() closeDialogWithData: EventEmitter<any> = new EventEmitter();
  @Output() onSearchCriteriaChange: EventEmitter<any> = new EventEmitter();
  @Input('searchCriteria') searchCriteria: string;
  cache_vendorList:any =[];
  vendorCartTableHeaders: any = [];
  selectedData: any = [];
  pageRecordSize: number = 10;
  pageOptions: number[] = [10, 20, 50, 100];
  defaultPermissions: any;
  cached_vendorList: any = [];
  searchVendorName: string = '';
  searchEmailId: string = '';
  searchMobileNo: string = '';
  searchCity: string = '';
  vendorForm: FormGroup;
  isNoVendorFound: boolean;
  categoryList: any = [];

  constructor(public dialogRef: MatDialogRef<VendorChooseModalPopupComponent>,
    @Optional() @Inject(MAT_DIALOG_DATA) public data,
    private encryDecryService: EncryDecryService,
    private toaster: ToastrService,
    private formValidatorService: FormValidatationsService,
    private createRfqService: CreateRfqService) { }

    ngOnInit() { 
    this.defaultPermissions = AppApiConfig.DEFAULT_PERMISSIONS;
    const temp = JSON.parse(this.encryDecryService.get(localStorage.getItem('logData')));
    this.loggedUserDetails = temp.details;
    this.roleName = this.loggedUserDetails.role.roleName;
    this.loggedUserPermissions = this.loggedUserDetails.listofPermission;
    this.buildVendorForm();
    this.loadCategories();
  }

  loadCategories() {
    this.createRfqService.getGMTCategories().subscribe((res: any) => {
      this.categoryList = Array.isArray(res) ? res : [];
    });
  }

  
    onInlineSearch(searchValue: string): void {
        if (!searchValue || searchValue.trim() === '') {
            this.vendorList = [...this.cache_vendorList]; // Reset to original data if search is empty
            return;
        }

        // Local filtering for current page
        const searchLower = searchValue.toLowerCase();
        const filtered = this.cache_vendorList.filter((item: any) => {
            //contains for any of the fields in the item
            return Object.values(item).some((val: any) => {
                if (val && typeof val === 'string') {
                    return val.toLowerCase().includes(searchLower);
                }
            });
        });

        console.log('Inline search results:', filtered);
        this.vendorList = [...filtered]
    }
 

  buildVendorForm() {
    // Initialize the vendor form here
    const defaultCategory = this.parentData && this.parentData.category ? this.parentData.category : '';
    this.vendorForm = new FormGroup({
      companyName: new FormControl('', Validators.required),
      city: new FormControl('', Validators.required),
      mobileNo: new FormControl('', [Validators.required, Validators.pattern(/^[0-9]{10}$/)]),
      email: new FormControl('', [Validators.required, Validators.email]) ,
      name: new FormControl('', [Validators.required, this.formValidatorService.alphabetValidator]),
      gstin: new FormControl('', [Validators.required]),
      products: new FormControl('', [Validators.required]),
      pinCode: new FormControl('', [Validators.required, this.formValidatorService.pincodeValidator]),
      vendorcategory: new FormControl(defaultCategory, [Validators.required])
    });
  }
  
    get vendorCtrls() {
        return this.vendorForm.controls;
    }


  ngOnChanges(changes: SimpleChanges): void {
    //Called before any other lifecycle hook. Use it to inject dependencies, but avoid any serious work here.
    //Add '${implements OnChanges}' to the class.
    console.log('Changes in Modal Popup:', changes);
    this.vendorCartTableHeaders = this.parentData ? (this.parentData.vendorHeaders || []) : [];
    if (this.parentData && this.parentData.category && this.vendorForm) {
      if (!this.vendorForm.get('vendorcategory')?.value) {
        this.vendorForm.patchValue({ vendorcategory: this.parentData.category });
      }
    }
    this.cache_vendorList = [...this.vendorList]; // Cache the original vendor list 
    console.log('Vendors List in Modal Popup:', this.vendorList);
  }
  onSearchCriteriaChanges(){
    this.globalSearchs();
  }

  onSearchCriteriaChange1(criteriaType: string, criteriaValue: string) {
    console.log(`Search Criteria Changed - Type: ${criteriaType}, Value: ${criteriaValue}`);
    switch (criteriaType) {
      case 'vendorName':
        this.searchEmailId = '';
        this.searchMobileNo = '';
        this.selectedData = [];
        this.vendorForm.patchValue({
          companyName: criteriaValue
        });

        this.vendorList = this.cached_vendorList.filter(vendor => vendor.companyName.toLowerCase().includes(criteriaValue.toLowerCase()));
        break;
      case 'emailId':
        this.searchMobileNo = '';
        this.vendorForm.patchValue({
          email: criteriaValue
        });
        if (criteriaValue.trim() === '') {
          this.vendorList = this.cached_vendorList.filter(vendor => vendor.companyName.toLowerCase().includes(this.searchVendorName.toLowerCase()));
          return;
        }
        this.vendorList = this.cached_vendorList.filter(vendor => vendor.email.toLowerCase().includes(criteriaValue.toLowerCase())
          && vendor.companyName.toLowerCase().includes(this.searchVendorName.toLowerCase()) );

        break;
      case 'mobile':
        this.vendorForm.patchValue({
          mobileNo: criteriaValue
        });
        if (criteriaValue.trim() === '') {
          this.vendorList = this.cached_vendorList.filter(vendor =>
            vendor.companyName.toLowerCase().includes(this.searchVendorName.toLowerCase()) &&
            vendor.email.toLowerCase().includes(this.searchEmailId.toLowerCase())
          );
          return;
        }
        this.vendorList = this.cached_vendorList.filter(vendor => vendor.email.toLowerCase().includes(criteriaValue.toLowerCase())
          && vendor.companyName.toLowerCase().includes(this.searchVendorName.toLowerCase())
          && vendor.mobileNo.includes(this.searchMobileNo));
        break;
      case 'city':
        this.vendorForm.patchValue({
          city: criteriaValue
        });
        if (criteriaValue.trim() === '') {
          this.vendorList = this.cached_vendorList.filter(vendor =>
            vendor.companyName.toLowerCase().includes(this.searchVendorName.toLowerCase()) &&
            vendor.email.toLowerCase().includes(this.searchEmailId.toLowerCase()) &&
            vendor.mobileNo.includes(this.searchMobileNo)
          );
          return;
        }
        this.vendorList = this.cached_vendorList.filter(vendor =>
          vendor.city.toLowerCase().includes(criteriaValue.toLowerCase()) &&
          vendor.companyName.toLowerCase().includes(this.searchVendorName.toLowerCase()) &&
          vendor.email.toLowerCase().includes(this.searchEmailId.toLowerCase()) &&
          vendor.mobileNo.includes(this.searchMobileNo)
        );
        break;
      default:
        this.vendorList = [...this.cached_vendorList]; // Reset to original list if no criteria matches
    }
    this.isNoVendorFound = this.vendorList.length === 0;
    // Implement your filtering logic here based on criteriaType and criteriaValue
  }

  onAddVendorsToCart() {
     if (this.vendorForm.invalid) {
            this.toaster.warning('Pls fill the required fields', 'Warning');
            return;
        }

      this.dialogRef.close({ action: 'addVendor', data: [this.vendorForm.getRawValue()] });
      this.onAddNewVendor.emit([this.vendorForm.getRawValue()]);
  }


  // for selected Vendor if its one by one
  onAddVendor(rowData: any) {

    // write logic for vendorGridData.gridValue is content this rowData
    const index =  this.vendorGridData.gridValue.findIndex((existedVendor:any) => existedVendor.id === rowData.id);
    if(index > -1){
      this.toaster.warning("Sorry, Selected Vendor Already added in Cart", "warning");
      return;
    }

    this.onAddNewVendor.emit([rowData]);
     this.closeDialogWithData.emit({data: this.selectedData,  'searchTextValue': this.searchTextValue,
       'searchBy': this.searchBy, 'searchCriteria': this.searchCriteria,
      'pageSize': this.pageSize, 'totalRecords':this.totalRecords, 'parentData': this.parentData, 
      'vendorList': this.vendorList, 'isPopAlreadyAccessed': true,
      'searchDropdownOptions': this.searchDropdownOptions
    });
        this.dialogRef.close({ action: 'addVendor', data: [rowData] });
  }

  onPageChanges(event:any){
    this.onPageChange.emit(event);
  }

  onSearchModes(searchMode: string){
      this.onSearchMode.emit({'searchMode': searchMode, 'searchTextValue': this.searchTextValue, 'searchBy': this.searchBy})

  }

  globalSearchs(){
    const cleanSearchText = this.searchTextValue ? this.searchTextValue.trim() : '';
    this.globalSearch.emit({'searchMode': this.searchBy, 'searchTextValue': cleanSearchText, 'searchBy': this.searchBy});
  }

  onPasteSearch(event: ClipboardEvent) {
    setTimeout(() => {
      this.globalSearchs();
    }, 50);
  }

  // for selected multiple vendors
  addToCart(){
    if(this.selectedData.length === 0){
      this.toaster.error('Please select at least one vendor to add to cart.');
      return;
    }
   
    const cartVendorIds = this.vendorGridData.gridValue.map((cartVendor:any)=> cartVendor.id)
    const selectedVendorsRemovingCartVendors = this.selectedData.filter((selectedVendor:any) => cartVendorIds.findIndex(id => id === selectedVendor.id) <= -1);
    
     // Proceed with adding selected vendors to cart
    if(selectedVendorsRemovingCartVendors.length === 0){
      this.toaster.warning("Sorry, Selected Vendors Already added in Cart", "warning");
      return;
    }
    this.onAddNewVendor.emit(this.selectedData);
    this.closeDialogWithData.emit({data: this.selectedData,  'searchTextValue': this.searchTextValue,
       'searchBy': this.searchBy, 'searchCriteria': this.searchCriteria,
      'pageSize': this.pageSize, 'totalRecords':this.totalRecords, 'parentData': this.parentData, 
      'vendorList': this.vendorList, 'isPopAlreadyAccessed': true,
      'searchDropdownOptions': this.searchDropdownOptions
    });
     this.dialogRef.close({ action: 'addToCart'});
  }

  // open create vendor modal with search details
  openCreateVendorWithSearchDetails(){
    if(this.searchVendorName.trim() === ''){
      this.toaster.error('Vendor Name is required to create new vendor.');
      return;
    }
    if(this.searchEmailId.trim() === ''){
      this.toaster.error('Email ID is required to create new vendor.');
      return;
    }
    if(this.searchMobileNo.trim() === ''){
      this.toaster.error('Mobile Number is required to create new vendor.');
      return;
    }

    if(!this.validateEmail(this.searchEmailId.trim())){
      this.toaster.error('Please enter a valid Email ID.');
      return;
    }

    //write vendor name with atleast 3 characters validation
    if(this.searchVendorName.trim().length < 3){
      this.toaster.error('Vendor Name must be at least 3 characters long to create new vendor.');
      return;
    }

    if(this.searchMobileNo.trim().length < 10){
      this.toaster.error('Mobile Number must be at least 10 digits  to create new vendor.');
      return;
    }

    //city name must be at least 2 characters long
    if(this.searchCity.trim().length < 2){
      this.toaster.error('City Name must be at least 2 characters  to create new vendor.');
      return;
    }

    //mobile number should be numeric only
    const mobileNumberPattern = /^[0-9]+$/;
    if(!mobileNumberPattern.test(this.searchMobileNo.trim())){
      this.toaster.error('Mobile Number must contain only numeric digits.');
      return;
    }

    const newVendorData = {
      companyName: this.searchVendorName,
      email: this.searchEmailId,
      mobileNo: this.searchMobileNo,
      city: this.searchCity,
      id:  'MANUALENTRYID_' + Math.random().toString(36).substr(2, 9)
    };
    this.dialogRef.close({ action: 'createVendor', data: [newVendorData] });
    this.onAddNewVendor.emit([newVendorData]);
  }
  validateEmail(email: string): boolean {
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return emailRegex.test(email);
}

}

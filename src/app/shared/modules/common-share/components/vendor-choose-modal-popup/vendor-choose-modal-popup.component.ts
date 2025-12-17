import { Component, EventEmitter, Inject, Input, Optional, Output, SimpleChanges } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { AppApiConfig } from 'src/app/shared/constants/app-api.config';
import { EncryDecryService } from 'src/app/shared/services';

@Component({
  selector: 'app-vendor-choose-modal-popup',
  templateUrl: './vendor-choose-modal-popup.component.html',
  styleUrls: ['./vendor-choose-modal-popup.component.scss']
})
export class VendorChooseModalPopupComponent {
  loggedUserDetails: any;
  roleName: any;
  loggedUserPermissions: any;
  @Input('parentData') parentData: any;
  @Input('vendorList') vendorList: any = [];
  @Output() onAddNewVendor: EventEmitter<any> = new EventEmitter(); 
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
  constructor(public dialogRef: MatDialogRef<VendorChooseModalPopupComponent>,
    @Optional() @Inject(MAT_DIALOG_DATA) public data,
    private encryDecryService: EncryDecryService,
    private toaster: ToastrService) { }

    ngOnInit() { 
    this.defaultPermissions = AppApiConfig.DEFAULT_PERMISSIONS;
    const temp = JSON.parse(this.encryDecryService.get('perm', localStorage.getItem('logData')));
    this.loggedUserDetails = temp.details;
    this.roleName = this.loggedUserDetails.role.roleName;
    this.loggedUserPermissions = this.loggedUserDetails.listofPermission;
  }

  ngOnChanges(changes: SimpleChanges): void {
    //Called before any other lifecycle hook. Use it to inject dependencies, but avoid any serious work here.
    //Add '${implements OnChanges}' to the class.
    console.log('Changes in Modal Popup:', changes);
    this.vendorCartTableHeaders = changes['parentData'].currentValue.vendorHeaders || [];
    // if (changes['parentData']) {
    //   this.vendorList = changes['parentData'].currentValue.vendorList || [];
      this.cached_vendorList = [...this.vendorList]; // Cache the original vendor list 
      console.log('Vendors List in Modal Popup:', this.vendorList);
    // }
  }

  onSearchCriteriaChange(criteriaType: string, criteriaValue: string) {
    console.log(`Search Criteria Changed - Type: ${criteriaType}, Value: ${criteriaValue}`);
    switch (criteriaType) {
      case 'vendorName':
        this.searchEmailId = '';
        this.searchMobileNo = '';
        this.selectedData = [];

        this.vendorList = this.cached_vendorList.filter(vendor => vendor.companyName.toLowerCase().includes(criteriaValue.toLowerCase()));
        break;
      case 'emailId':
        this.searchMobileNo = '';
        if (criteriaValue.trim() === '') {
          this.vendorList = this.cached_vendorList.filter(vendor => vendor.companyName.toLowerCase().includes(this.searchVendorName.toLowerCase()));
          return;
        }
        this.vendorList = this.cached_vendorList.filter(vendor => vendor.email.toLowerCase().includes(criteriaValue.toLowerCase())
          && vendor.companyName.toLowerCase().includes(this.searchVendorName.toLowerCase()) );

        break;
      case 'mobile':
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
      default:
        this.vendorList = [...this.cached_vendorList]; // Reset to original list if no criteria matches
    }
    // Implement your filtering logic here based on criteriaType and criteriaValue
  }


  // for selected Vendor if its one by one
  onAddVendor(rowData: any) {
    this.dialogRef.close({ action: 'addVendor', data: [rowData] });
    this.onAddNewVendor.emit([rowData]);
  }

  // for selected multiple vendors
  addToCart(){
    if(this.selectedData.length === 0){
      this.toaster.error('Please select at least one vendor to add to cart.');
      return;
    }
    // Proceed with adding selected vendors to cart
    this.dialogRef.close({ action: 'addToCart', data: this.selectedData });
    this.onAddNewVendor.emit(this.selectedData);
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

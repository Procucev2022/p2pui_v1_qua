import { Component, OnInit } from '@angular/core';
import { NgForm, FormGroup, FormBuilder, FormArray } from '@angular/forms';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
// import { AddProductsComponent } from '../components/add-product/add-products.component';
// import { VendorService } from '../services/vendor-service.service';
import { AppConfig } from 'src/app/app.config';
// import { VendorContactsComponent } from '../components/vendor-contacts/vendor-contacts.component';
// import { VendorClientRefComponent } from '../components/vendor-client-ref/vendor-client-ref.component';
// import { AddServicesComponent } from '../components/add-services/add-services.component';
import { ActivatedRoute, Router } from '@angular/router';
import { VendorService } from 'src/app/vendor-registration/services/vendor-service.service';
import { AddProductsComponent } from 'src/app/vendor-registration/components/add-product/add-products.component';
import { AddServicesComponent } from 'src/app/vendor-registration/components/add-services/add-services.component';
// import { VendorContactsComponent } from 'src/app/vendor-registration/components/vendor-contacts/vendor-contacts.component';
import { VendorClientRefComponent } from 'src/app/vendor-registration/components/vendor-client-ref/vendor-client-ref.component';
import { VendorRegistrationService } from '../services/vendor-registration.service';
import { CountriesService } from '../services/countries.service';
import { ConvertToBase64Service } from 'src/app/shared/modules/common-share/services/convert-to-base64.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-vendor-registration',
  templateUrl: './vendor-registration.component.html',
  styleUrls: ['./vendor-registration.component.scss']
})
export class VendorRegistrationComponent implements OnInit {

  selectedIndex = 0;
  title = 'Testing';

  stateInfo: any[] = [];
  countryInfo: any[] = [];
  cityInfo: any[] = [];

  productsList: any = [];
  servicesList: any = []
  contactsList: any = [];
  clientRefList: any = [];

  paginatoryDetails: any;
  pageRecordSize: any;
  pageOptions: any;
  selectedData: any;
  regId: any;
  states: any[] = this.getStatesArray();

  orgBranches: FormArray;

  generalModel: any = {};
  financialModel: any = {};
  productsModel: any = {};
  branchesForm: FormGroup;
  certificatesArray: any[] = [];
  selectedFilesArray: any[];
  documentsArray: any[] = [];
  certificatesToBase64: any[] = [];
  documentsToBase64: any[] = [];
  sidebar;
  base64Value:any;

  constructor(private dialog: MatDialog,
    private country: CountriesService,
    private fb: FormBuilder,
    private vendorRegSer: VendorRegistrationService,
    private vendorService: VendorService,
    private activateRoute: ActivatedRoute,
    private route: Router,
    private convertSer: ConvertToBase64Service,
    private toaster: ToastrService) {

  }

  ngOnInit() {
    // this.getCountries();
    this.activateRoute.queryParams.subscribe(
      params => {
        this.regId = params['regid'];
        if (this.regId) {
          console.log(this.regId)
        }
        else {
          this.route.navigateByUrl('/error')
        }
      }
    )

    this.generateBranchesForm();


    this.pageRecordSize = AppConfig.GRID_PAGE_INFO.initpageSize;
    this.pageOptions = AppConfig.GRID_PAGE_INFO.pageOptions;
    // this.getProductsData();
   // this.getServicesData()
    // this.getVendorContactsData();
    // this.getClientRefData();
  }


  generateBranchesForm() {
    this.branchesForm = this.fb.group({
      'orgBranches': this.fb.array([this.createBranch()])
    })

    // this.branchesForm.get('country').valueChanges.subscribe(value=>{
    //   console.log(value);

    // })
  }

  createBranch() {
    let fbGroup = this.fb.group({
      branchName: [''],
      address1: [''],
      address2: [''],
      // country: ['Select'],
      state: ['Select'],
      city: [''],
      zipCode: [''],
      others: [''],
    })


    return fbGroup
  }

  addBranch() {
    this.orgBranches = this.branchesForm.get('orgBranches') as FormArray;
    this.orgBranches.push(this.createBranch());
  }

  removeBranch(index) {
    this.orgBranches.removeAt(index);
  }

  getCountries() {
    this.country.allCountries().
      subscribe(
        data2 => {
          this.countryInfo = data2.Countries;
          // console.log('Data:', this.countryInfo);
        },
        err => console.log(err),
        () => console.log('complete')
      )
  }

  onChangeCountry(countryValue) {
    this.stateInfo = this.countryInfo[countryValue].States;
    this.cityInfo = this.stateInfo[0].Cities;
    console.log(this.cityInfo);
  }

  onChangeState(stateValue) {
    this.cityInfo = this.stateInfo[stateValue].Cities;
    // console.log(this.cityInfo);
  }


  productsHeaders: any = [
    // {field:'id'},
    { field: 'hsnCode', header: 'HSN Code', isLink: false },
    // { field: 'sacCode', header: 'SAC Code', isLink: false },
    { field: 'productName', header: 'Product Name', isLink: false },
    { field: 'description', header: 'Description', isLink: false },
    { field: 'others', header: 'Others', isLink: false },
  ];

  servicesHeaders: any = [
    // {field:'id'},
    // { field: 'hsnCode', header: 'HSN Code', isLink: false },
    { field: 'sacCode', header: 'SAC Code', isLink: false },
    { field: 'serviceName', header: 'Service Name', isLink: false },
    { field: 'description', header: 'Description', isLink: false },
    { field: 'others', header: 'Others', isLink: false },
  ];

  contactsHeaders: any = [
    // {field:'id'},
    { field: 'firstName', header: 'First Name', isLink: false },
    { field: 'lastName', header: 'Last Name', isLink: false },
    { field: 'email', header: 'Email', isLink: false },
    { field: 'phone', header: 'Phone', isLink: false },
  ];

  clientRefHeaders: any = [
    { field: 'name', header: 'Company Name', isLink: false },
    { field: 'email', header: 'Email', isLink: false },
    { field: 'pocFirstName', header: 'POC First Name', isLink: false },
    { field: 'pocLastName', header: 'POC Last Name', isLink: false },
    { field: 'phone', header: 'Phone', isLink: false },
    { field: 'comments', header: 'Comments', isLink: false },
    { field: 'file', header: 'File', isLink: true,
    valueGetter: function(params) {
      return this.getFileName(params);
    } },
  ];

  rowData = [

  ];

  getFileName(params) {
    console.log(params)
  }
  getProductsData() {
    this.vendorService
      .getProductsData()
      .subscribe(data => {
        this.productsList = data || [];
      });
  }

  getServicesData() {
    this.vendorService
      .getServicesData()
      .subscribe(data => {
        this.servicesList = data || [];
      });
  }

  getVendorContactsData() {
    this.vendorService
      .getVendorContactsData()
      .subscribe(data => {
        this.contactsList = data || [];
      });
  }
  getClientRefData() {
    this.vendorService
      .getClientRefData()
      .subscribe(data => {
        this.clientRefList = data || [];
      });
  }

  moveToNextTab(form: NgForm) { // not using currently , we will use after form validation applied
    if (form.valid) {
      this.selectedIndex++;
    } else {
      console.log('In Valid Form')
    }
  }
  moveToBackTab() {
    // this.selectedIndex--;
  }
  moveToSelectedTab(tabName: string) {
    for (let i = 0; i < document.querySelectorAll('.mat-tab-label-content').length; i++) {
      if ((<HTMLElement>document.querySelectorAll('.mat-tab-label-content')[i]).innerText == tabName) {
        (<HTMLElement>document.querySelectorAll('.mat-tab-label')[i]).click();
      }
    }
  }
  onAddProduct(action, prdData) {
    prdData.action = action;
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = "40%";
    // dialogConfig.height = "500px";
    this.dialog.open(AddProductsComponent, dialogConfig).afterClosed().subscribe(result => {
      console.log(result.data);
      if (result.event == 'submit') {
        this.productsList.push(result.data);
      }

    });
  }

  onAddService(action, prdData) {
    prdData.action = action;
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = "40%";
    // dialogConfig.height = "500px";
    const dailog = this.dialog.open(AddServicesComponent, dialogConfig);
    dailog.afterClosed().subscribe(result => {
      if (result.event == 'submit') {
        this.servicesList.push(result.data);
      }
    });
  }

  onAddContact(action, prdData) {
    prdData.action = action;
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = "40%";
   // dialogConfig.height = "600px";
    // this.dialog.open(VendorContactsComponent, dialogConfig).afterClosed().subscribe(result => {
    //   console.log(result);
    //   if (result.event == 'submit') {
    //     this.contactsList.push(result.data)
    //    }
    // });
  }

  onAddClientRef(action, prdData) {
    prdData.action = action;
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = "40%";
    // dialogConfig.height = "600px";
    this.dialog.open(VendorClientRefComponent, dialogConfig).afterClosed().subscribe(result => {
      console.log(result);
      if (result.event == 'submit') {
        this.clientRefList.push(result.data)
      }
    });
  }

  onDelete(type: any) {
    if (this.selectedData.length) {
      this.selectedData.forEach(sData => {
        this[type] = this[type].filter((record) => {
          return record.id != sData.id
        })
      });
      this.selectedData = [];
    } else {
      alert('please select atleast one record'); // need to change with toaster service
    }
  }


  // file upload
  uploadingFiles(event) {
    // this.selectedFiles = event.target.files;
    this.selectedFilesArray = Array.from(event.target.files);
    // this.fileName = this.selectedFiles[0].name;
  }

  removeFile(index) {
    // console.log(this.selectedFiles);
    console.log(index);
    // delete this.selectedFilesArray[index];
    this.selectedFilesArray.splice(index, 1)
    // if(this.selectedFilesArray.splice(index,0))
  }
  uploadCertificates(files) {
    Array.from(files).forEach(file => {
      this.certificatesArray.push(file)
    });
  }
  uploadDocuments(files) {
    Array.from(files).forEach(file => {
      this.documentsArray.push(file)
    });
  }
  deleteAttachment(index, type) {
    this[type].splice(index, 1)
  }


  saveGeneral(tabToMove: string, form: NgForm) {
    console.log(form);
    form.value['id'] = this.regId;
    this.vendorRegSer.saveVendorRegistration(form.value).subscribe((res) => {
      // if(res.statusCode == "Success" || res.statusCode == "success" || res.statusCode == "1001" ){
      //   this.toaster.success(res.message,'Success')
      //  }else if(res.statusCode == "Failure" || res.statusCode == "failure"){
      //    this.toaster.error(res.errorMessage, 'Failure')
      //  }
    })
    this.moveToSelectedTab(tabToMove);
  }
  saveBranches(tabToMove: string, form: any) {
    form.value['id'] = this.regId;
    this.vendorRegSer.saveVendorRegistration(form.value).subscribe((res) => {
      // if(res.statusCode == "Success" || res.statusCode == "success" || res.statusCode == "1001" ){
      //   this.toaster.success(res.message,'Success')
      //  }else if(res.statusCode == "Failure" || res.statusCode == "failure"){
      //    this.toaster.error(res.errorMessage, 'Failure')
      //  }
    })
    this.moveToSelectedTab(tabToMove);
  }

  saveProducts(tabToMove: string, dataToSubmit: any) {
    console.log(dataToSubmit);
    let temp = {
      id: this.regId,
      vendorProduct: dataToSubmit
    }
    this.vendorRegSer.saveVendorRegistration(temp).subscribe((res) => {
      // if(res.statusCode == "Success" || res.statusCode == "success" || res.statusCode == "1001" ){
      //   this.toaster.success(res.message,'Success')
      //  }else if(res.statusCode == "Failure" || res.statusCode == "failure"){
      //    this.toaster.error(res.errorMessage, 'Failure')
      //  }
    })
    this.moveToSelectedTab(tabToMove);
  }

  saveServices(tabToMove: string, dataToSubmit: any) {
    let temp = {
      id: this.regId,
      vendorService: dataToSubmit
    }
    this.vendorRegSer.saveVendorRegistration(temp).subscribe((res) => {
      // if(res.statusCode == "Success" || res.statusCode == "success" || res.statusCode == "1001" ){
      //   this.toaster.success(res.message,'Success')
      //  }else if(res.statusCode == "Failure" || res.statusCode == "failure"){
      //    this.toaster.error(res.errorMessage, 'Failure')
      //  }
    })

    this.moveToSelectedTab(tabToMove);
  }
  saveContacts(tabToMove: string, dataToSubmit: any) {
    let temp = {
      id: this.regId,
      vendorContact: dataToSubmit
    }
    this.vendorRegSer.saveVendorRegistration(temp).subscribe((res) => {
      // if(res.statusCode == "Success" || res.statusCode == "success" || res.statusCode == "1001" ){
      //   this.toaster.success(res.message,'Success')
      //  }else if(res.statusCode == "Failure" || res.statusCode == "failure"){
      //    this.toaster.error(res.errorMessage, 'Failure')
      //  }
    })
    this.moveToSelectedTab(tabToMove);
  }

  saveClientReferences(tabToMove: string, dataToSubmit: any) {
    let temp = {
      id: this.regId,
      clientReference: dataToSubmit
    }
    this.vendorRegSer.saveVendorRegistration(temp).subscribe((res) => {
      console.log(res, 'contacts')
    })
    this.moveToSelectedTab(tabToMove);
  }

  saveFinancials(tabToMove: string, form: NgForm) {
    form.value['id'] = this.regId;
    this.vendorRegSer.saveVendorRegistration(form.value).subscribe((res) => {
      // if(res.statusCode == "Success" || res.statusCode == "success" || res.statusCode == "1001" ){
      //   this.toaster.success(res.message,'Success')
      //  }else if(res.statusCode == "Failure" || res.statusCode == "failure"){
      //    this.toaster.error(res.errorMessage, 'Failure')
      //  }
    })
    this.moveToSelectedTab(tabToMove);
  }

  saveCertificates(tabToMove: string, form: NgForm) {
    this.certificatesArray.forEach(file => {
      this.convertSer.getBase64(file).then((data:string)=> {
        let temp = {
          fileName: file.name,
          file: data.split(',')[1]
        }
        this.certificatesToBase64.push(temp)
      })

    });
    setTimeout(()=> {
      let temp = {
        id: this.regId,
        'certificates': this.certificatesToBase64
      }
      this.vendorRegSer.saveVendorRegistration(temp).subscribe((res) => {
        console.log(res, 'financials')
        // if(res.statusCode == "Success" || res.statusCode == "success" || res.statusCode == "1001" ){
        //   this.toaster.success(res.message,'Success')
        //  }else if(res.statusCode == "Failure" || res.statusCode == "failure"){
        //    this.toaster.error(res.errorMessage, 'Failure')
        //  }
      })
      this.moveToSelectedTab(tabToMove);
    }, 300)
  }

  getBase64(file) {
    // var self;
    // var reader = new FileReader();
    // reader.readAsDataURL(file);
    // reader.onload = function () {
    //   self.base64Value = reader;
    // };
    // reader.onerror = function (error) {
    //   console.log('Error: ', error);
    // };
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = error => reject(error);
    });
 }

  regFormSubmit(form: NgForm) {

    this.documentsArray.forEach(file => {
      this.convertSer.getBase64(file).then((data:string)=> {
        let temp = {
          fileName: file.name,
          file: data.split(',')[1]
        }
        this.documentsToBase64.push(temp)
      })

    });
    setTimeout(()=> {
      let finalData = this.generalModel;
      finalData['id'] = this.regId;
      finalData['orgBranches'] = this.branchesForm.getRawValue().orgBranches;
      finalData['vendorProduct'] = this.productsList;
      finalData['vendorService'] = this.servicesList;
      finalData['vendorContact'] = this.contactsList;
      finalData['clientReference'] = this.clientRefList;
      finalData['orgBankDetails'] = [this.financialModel];
      finalData['certificates'] = this.certificatesToBase64 || [] ;
      finalData['documents'] = this.documentsToBase64 || [];


      this.vendorRegSer.submitVendorRegistration(finalData).subscribe((res:any) => {
       if(res.status == "Success" || res.status == "success" ) {
        this.toaster.success(res.message,'Success')
       } else if(res.status == "Failure" || res.status == "failure") {
         this.toaster.error(res.errorMessage, 'Failure')
       }
      })
    }, 200)



  }
  uploadFile(event) {

  }
  getRFQs(rowData) {

  }

  getStatesArray() {
    return [ 'Andhra Pradesh',
    'Arunachal Pradesh',
    'Assam',
    'Bihar',
    'Chhattisgarh',
    'Goa',
    'Gujarat',
    'Haryana',
    'Himachal Pradesh',
    'Jammu and Kashmir',
    'Jharkhand',
    'Karnataka',
    'Kerala',
    'Madhya Pradesh',
    'Maharashtra',
    'Manipur',
    'Meghalaya',
    'Mizoram',
    'Nagaland',
    'Odisha',
    'Punjab',
    'Rajasthan',
    'Sikkim',
    'Tamil Nadu',
    'Telangana',
    'Tripura',
    'Uttarakhand',
    'Uttar Pradesh',
    'West Bengal',
    'Andaman and Nicobar Islands',
    'Chandigarh',
    'Dadra and Nagar Haveli',
    'Daman and Diu',
    'Delhi',
    'Lakshadweep',
    'Puducherry'];
  }

  downloadFile(file) {
    console.log(file);

  }


}

import { Component, OnInit } from '@angular/core';

import { NgForm, FormGroup, FormBuilder, FormArray, Validators } from '@angular/forms';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { AppConfig } from 'src/app/app.config';
import { ActivatedRoute, Router } from '@angular/router';
import { ConvertToBase64Service } from 'src/app/shared/modules/common-share/services/convert-to-base64.service';
import { ToastrService } from 'ngx-toastr';
import { VendorRegistrationService } from 'src/app/vendor-registration/services/vendor-registration.service';
import { CountriesService } from 'src/app/vendor-registration/services/countries.service';
import { AddProductsComponent } from '../components/add-product/add-products.component';
import { AddServicesComponent } from '../components/add-services/add-services.component';
import { VendorContactsComponent } from '../components/vendor-contacts/vendor-contacts.component';
import { VendorClientRefComponent } from '../components/vendor-client-ref/vendor-client-ref.component';
import { VendorService } from 'src/app/vendor-registration/services/vendor-service.service';
import { EncryDecryService } from 'src/app/shared/services';
import { async } from '@angular/core/testing';
import swal from 'sweetalert2';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-vendor-reg',
  templateUrl: './vendor-reg.component.html',
  styleUrls: ['./vendor-reg.component.scss']
})



export class VendorRegComponent implements OnInit {


  selectedIndex = 0;
  secondLocked:  true
  title = 'Testing';
  companyId;

  moveTBranches = true;
  moveTProducts = true;
  moveTServices = true;
  moveTContacts = true;
  moveTClentREf = true;
  moveTBankdts = true;
  moveTOTurnOver = true;
  moveTOAuthorized = true;
  moveTDocuments = true;
  moveTCertificates = true;

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
  distributors: FormArray;

  generalModel: any = {};
  ifscCode: any = {};
  productsModel: any = {};
  branchesForm: FormGroup;
  authorizedForm: FormGroup;
  certificatesArray: any[] = [];
  selectedFilesArray: any[];
  documentsArray: any[] = [];
  certificatesToBase64: any[] = [];
  documentsToBase64: any[] = [];

  base64Value:any;
  vendorRegObj: any;
  loggedUserDetails: any;
  financialModel: any= {};
  turnOver =[{
    'year':'',
    'amount':''
  }];
  tempBranches: any;
  tempAuthorized: any = [];

    pancardDoc: any = [];
    gstinDoc: any =[];
    msmeDoc: any = [];
    chequeDoc:any = [];

    panDocTOBase64: any=[];
    gstinDocTOBase64: any=[];
    msmeDocTOBase64: any=[];
    chequeDocTOBase64: any=[];

    isPanCardDocSaved: Boolean;
    isGSTINDocSaved: Boolean;
    isMSMEDocSaved: Boolean;
    isChequeDocSaved: Boolean;
    isAuthorizedDistributor = false;
    acceptTermsand : any
  termsAndConditionsFile: any;

  constructor(private dialog: MatDialog,
    private country: CountriesService,
    private fb: FormBuilder,
    private vendorRegSer: VendorRegistrationService,
    private vendorService: VendorService,
    private activateRoute: ActivatedRoute,
    private route: Router,
    private convertSer: ConvertToBase64Service,
    private toaster: ToastrService,
    private encryDecryService: EncryDecryService,
    public matDialog: MatDialog) {

  }


  ngOnInit() {
    // this.getCountries();
    let temp =  JSON.parse(this.encryDecryService.get('perm', localStorage.getItem('logData')) );
        this.loggedUserDetails = temp.details;
        console.log('usrDetails,', this.loggedUserDetails)
        console.log( localStorage.getItem('orgId'), 'rogId')
        console.log( localStorage.getItem('companyName'))
    this.activateRoute.queryParams.subscribe(
      params => {
        console.log('helo', params)
        this.regId = params['regId'] ? params['regId']: localStorage.getItem('orgId');
        if (this.regId) {
          console.log(this.regId)
          this.getVendorById(this.regId);
        }
        // else {
        //   this.route.navigateByUrl('/error')
        // }
      }
    )

    this.generateBranchesForm();

    this.generateAuthorizedForm();
    this.pageRecordSize = AppConfig.GRID_PAGE_INFO.initpageSize;
    this.pageOptions = AppConfig.GRID_PAGE_INFO.pageOptions;

    this.vendorRegSer.getVendorTc().subscribe((res:any) => {
      this.termsAndConditionsFile = res[0]
    })
  }


  generateBranchesForm() {
    this.branchesForm = this.fb.group({
      'orgBranches': this.fb.array([this.createBranch()])
    })

  }

  createBranch() {
    let fbGroup = this.fb.group({
      branchName: [this.generalModel.city],
      gstin: [this.generalModel.gstin],
      address1: [this.generalModel.address1],
      // address2: [''],
      // country: ['Select'],
      state: [this.generalModel.state],
      city: [this.generalModel.city],
      zipCode: [this.generalModel.zipCode],
      others: [''],
    })


    return fbGroup
  }

  AddCreateBranch() {
    let fbGroup = this.fb.group({
      branchName: [''],
      gstin: [''],
      address1: [''],
      // address2: [''],
      // country: ['Select'],
      state: [''],
      city: [''],
      zipCode: [''],
      others: [''],
    })


    return fbGroup
  }
  addBranch() {
    this.orgBranches = this.branchesForm.get('orgBranches') as FormArray;
    this.orgBranches.push(this.AddCreateBranch());
  }

  uploadFile(event) {

  }

  addBranchWithData(data) {
    this.orgBranches = this.branchesForm.get('orgBranches') as FormArray;
    this.orgBranches.push(this.createBranchWithData(data));
  }
  createBranchWithData(data) {
    const fbGroup = this.fb.group({
      branchName: [data.branchName],
      gstin:[data.gstin],
      address1: [data.address1],
      // address2: [data.address2],
      // country: ['Select'],
      state: [data.state],
      city: [data.city],
      zipCode: [data.zipCode],
      others: [data.others],
    })


    return fbGroup
  }

  removeBranch(index) {
    this.orgBranches.removeAt(index+1);
  }

  generateAuthorizedForm() {
    this.authorizedForm = this.fb.group({
        'distributors': this.fb.array([this.createauthorized()]),
        'isAuthorizedDistributor': [false],
      })
  }

  get f() { return this.authorizedForm.controls; }

  createauthorized() {
      const auFormGroup = this.fb.group({
        company: [''],
        type: [''],
        description: [''],
      })

      return auFormGroup
  }

  addAuthorized() {
    this.distributors = this.authorizedForm.get('distributors') as FormArray;
    this.distributors.push(this.createauthorized());
  }

  addAuthorizedWithData(data) {
    this.distributors = this.authorizedForm.get('distributors') as FormArray;
    this.distributors.push(this.createAuthorizedWithData(data));
  }
  createAuthorizedWithData(data) {
    const auFormGroup = this.fb.group({
        company: [data.company],
        type:[data.type],
        description: [data.description],
       // isAuthorizedDistributor:[data.isAuthorizedDistributor]
    })


    return auFormGroup
  }

  removeauthorized(index) {
    this.distributors.removeAt(index+1);
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
    if (this.countryInfo && this.countryInfo[countryValue] && this.countryInfo[countryValue].States) {
      this.stateInfo = this.countryInfo[countryValue].States;
      if (this.stateInfo && this.stateInfo[0]) {
        this.cityInfo = this.stateInfo[0].Cities;
      }
    }
  }

  onChangeState(stateValue) {
    if (this.stateInfo && this.stateInfo[stateValue]) {
      this.cityInfo = this.stateInfo[stateValue].Cities;
    }
  }


  productsHeaders: any = [
    // {field:'id'},
    { field: 'hsnCode', header: 'HSN Code', isLink: false , fieldType: false},
    // { field: 'companyName', header: 'Company Name', isLink: false },
    { field: 'brandName', header: 'Brand Name', isLink: false , fieldType: false},
    { field: 'productName', header: 'Product Name', isLink: false , fieldType: false},
    { field: 'description', header: 'Description', isLink: false , fieldType: false},
    { field: 'others', header: 'Others', isLink: false , fieldType: false},
    { field: 'fileName', header: 'File', isLink: false , fieldType: true},

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
    { field: 'firstName', header: 'Name', isLink: false },
    // { field: 'lastName', header: 'Last Name', isLink: false },
    { field: 'designation', header: 'Designation', isLink: false },
    { field: 'email', header: 'Email', isLink: false },
    { field: 'phone', header: 'Phone', isLink: false },
    { field: 'alternativenumber', header: 'Alternative Number', isLink: false },
  ];

  clientRefHeaders: any = [
    { field: 'name', header: 'Company Name', isLink: false },
    { field: 'email', header: 'Email', isLink: false },
    { field: 'pocFirstName', header: 'Contact Person Name', isLink: false },
    // { field: 'pocLastName', header: 'POC Last Name', isLink: false },
    { field: 'phone', header: 'Phone', isLink: false },
    { field: 'location', header: 'Location', isLink: false },
    { field: 'comments', header: 'Comments', isLink: false },
    { field: 'files', header: 'File', isLink: true },
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
    if (!prdData) prdData = {};
    prdData.action = action;
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = "40%";
    const obj = {
      'isNewVendor': true
    }
    dialogConfig.data = obj;
    // dialogConfig.height = "500px";
    this.dialog.open(AddProductsComponent, dialogConfig).afterClosed().subscribe(result => {
      console.log(result.data);
      if (result && result.event == 'submit' && result.data) {
        this.productsList.push(result.data);
      }

    });
  }

  onAddService(action, prdData) {
    if (!prdData) prdData = {};
    prdData.action = action;
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = "40%";
    const obj = {
      'isNewVendor': true
    }
    dialogConfig.data = obj;
    // dialogConfig.height = "500px";
    const dailog = this.dialog.open(AddServicesComponent, dialogConfig);
    dailog.afterClosed().subscribe(result => {
      if (result && result.event == 'submit' && result.data) {
        this.servicesList.push(result.data);
      }
    });
  }

  onAddContact(action, prdData) {
    if (!prdData) prdData = {};
    prdData.action = action;
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = "40%";
   // dialogConfig.height = "600px";
    this.dialog.open(VendorContactsComponent, dialogConfig).afterClosed().subscribe(result => {
      console.log(result);
      if (result && result.event == 'submit' && result.data) {
        this.contactsList.push(result.data)
       }
    });
  }

  onAddClientRef(action, prdData) {
    if (!prdData) prdData = {};
    prdData.action = action;
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = "40%";
    // dialogConfig.height = "600px";
    this.dialog.open(VendorClientRefComponent, dialogConfig).afterClosed().subscribe(result => {
      console.log(result);
      if (result && result.event == 'submit' && result.data) {
        this.clientRefList.push(result.data)
      }
    });
  }

  onDelete(type: any) {
    if (this.selectedData && this.selectedData.length) {
      this.selectedData.forEach(sData => {
        if (this[type] && Array.isArray(this[type])) {
          this[type] = this[type].filter((record) => {
            return record && sData && record.id != sData.id;
          });
        }
      });
      this.selectedData = [];
    } else {
      alert('please select atleast one record'); // need to change with toaster service
    }
  }


  // file upload
  uploadingFiles(event) {
    if (event && event.target && event.target.files) {
      this.selectedFilesArray = Array.from(event.target.files);
    }
  }

  removeFile(index) {
    if (this.selectedFilesArray && Array.isArray(this.selectedFilesArray)) {
      this.selectedFilesArray.splice(index, 1);
    }
  }
  uploadCertificates(files) {
    if (files) {
      Array.from(files).forEach(file => {
        if (this.certificatesArray) this.certificatesArray.push(file);
      });
    }
  }
  uploadDocuments(files) {
    if (files) {
      Array.from(files).forEach(file => {
        if (this.documentsArray) this.documentsArray.push(file);
      });
    }
  }

  uploadGSTIN(event) {
    if (!event || !event.target || !event.target.files || !event.target.files[0]) return;
    this.gstinDoc = event.target.files[0];
    this.isGSTINDocSaved = true;
    if (this.convertSer && this.convertSer.getBase64) {
      try {
        const res = this.convertSer.getBase64(this.gstinDoc);
        if (res && typeof res.then === 'function') {
          res.then((data: string) => {
            if (!data) return;
            const temp = {
              fileName: 'GSTIN_document.' + (this.gstinDoc.name ? this.gstinDoc.name.split('.')[1] : 'png'),
              file: data.includes(',') ? data.split(',')[1] : data
            };
            if (this.gstinDocTOBase64) this.gstinDocTOBase64.push(temp);
          }).catch(() => {});
        }
      } catch (e) {}
    }
  }
  uploadMSME(event) {
    if (!event || !event.target || !event.target.files || !event.target.files[0]) return;
    this.msmeDoc = event.target.files[0];
    this.isMSMEDocSaved = true;
    if (this.convertSer && this.convertSer.getBase64) {
      try {
        const res = this.convertSer.getBase64(this.msmeDoc);
        if (res && typeof res.then === 'function') {
          res.then((data: string) => {
            if (!data) return;
            const temp = {
              fileName: 'MSME_document.' + (this.msmeDoc.name ? this.msmeDoc.name.split('.')[1] : 'png'),
              file: data.includes(',') ? data.split(',')[1] : data
            };
            if (this.msmeDocTOBase64) this.msmeDocTOBase64.push(temp);
          }).catch(() => {});
        }
      } catch (e) {}
    }
  }

  uploadCheque(event) {
    if (!event || !event.target || !event.target.files || !event.target.files[0]) return;
    this.chequeDoc = event.target.files[0];
    this.isChequeDocSaved = true;
    if (this.convertSer && this.convertSer.getBase64) {
      try {
        const res = this.convertSer.getBase64(this.chequeDoc);
        if (res && typeof res.then === 'function') {
          res.then((data: string) => {
            if (!data) return;
            const temp = {
              fileName: 'CHEQUE_document.' + (this.chequeDoc.name ? this.chequeDoc.name.split('.')[1] : 'png'),
              file: data.includes(',') ? data.split(',')[1] : data
            };
            if (this.chequeDocTOBase64) this.chequeDocTOBase64.push(temp);
          }).catch(() => {});
        }
      } catch (e) {}
    }
  }


  deletefiles(type) {
      if(type == 'pancardDoc') {
      this.isPanCardDocSaved = false;
      this.panDocTOBase64 = [];
      }
      if(type == 'gstinDoc') {
        this.isGSTINDocSaved = false;
        this.gstinDocTOBase64 = [];
    }
    if(type == 'msmeDoc') {
        this.isMSMEDocSaved = false;
        this.msmeDocTOBase64 = [];
    }
    if(type == 'chequeDoc') {
        this.isChequeDocSaved = false;
        this.chequeDocTOBase64 = [];
    }
  }

  uploadPanCard(event) {
    console.log('event pan', event)
      this.pancardDoc = event.target.files[0];
      this.isPanCardDocSaved = true;
      this.convertSer.getBase64(this.pancardDoc).then((data:string)=> {
        const temp = {
          fileName: 'PAN_document.'+ this.pancardDoc.name.split('.')[1],
          file: data.split(',')[1]
        }
        this.panDocTOBase64.push(temp)
      });
      console.log(this.panDocTOBase64)
    //   const reader = new FileReader();
    //     reader.readAsDataURL(this.pancardDoc);
    //     reader.onload = () => {
    //     console.log(this.panDocTOBase64);
    // };
  }








  deleteAttachment(index, type) {
    this[type].splice(index, 1)
    if(type == 'certificatesArray') {
      this.certificatesToBase64.splice(index,1)
      this.vendorRegObj.certificates.splice(index, 1);
    }
    if(type == 'documentsArray') {
      this.documentsToBase64.splice(index,1);
      this.vendorRegObj.documents.splice(index, 1);
    }

    console.log('docuArray', this.documentsArray)
    console.log('certificatesArray', this.certificatesArray)
  }


  saveGeneral(tabToMove: string, form: NgForm) {
    if(form.valid) {

        this.moveTBranches = false;
        this.saveData();
        this.moveToSelectedTab(tabToMove);
        if(this.vendorRegObj.orgBranches[0] == undefined){
        this.generateBranchesForm();
        }
    } else {
      this.toaster.error('Please enter all required fields','Failure')
        return;
    }

    console.log(form);
    form.value['id'] = this.regId;
    // this.vendorRegSer.saveVendorRegistration(form.value).subscribe((res) => {
    //   // if(res.statusCode == "Success" || res.statusCode == "success" || res.statusCode == "1001" ){
    //   //   this.toaster.success(res.message,'Success')
    //   //  }else if(res.statusCode == "Failure" || res.statusCode == "failure"){
    //   //    this.toaster.error(res.errorMessage, 'Failure')
    //   //  }
    // })
  }
  saveBranches(tabToMove: string, form: any) {
    if(form.valid) {


        this.saveData();
        this.moveTProducts = false;
        this.moveToSelectedTab(tabToMove);
    } else {
      this.toaster.error('Please enter all required fields','Failure')
        return;
    }

    form.value['id'] = this.regId;
    // this.vendorRegSer.saveVendorRegistration(form.value).subscribe((res) => {
    //   // if(res.statusCode == "Success" || res.statusCode == "success" || res.statusCode == "1001" ){
    //   //   this.toaster.success(res.message,'Success')
    //   //  }else if(res.statusCode == "Failure" || res.statusCode == "failure"){
    //   //    this.toaster.error(res.errorMessage, 'Failure')
    //   //  }
    // })
  }

  saveProducts(tabToMove: string, dataToSubmit: any) {
    // var temp = {
    //     id: this.regId,
    //     vendorProduct: dataToSubmit
    //   }
    this.moveTServices = false;
        this.saveData();
        this.moveToSelectedTab(tabToMove);
    console.log(dataToSubmit);
    // this.vendorRegSer.saveVendorRegistration(temp).subscribe((res) => {
    //   // if(res.statusCode == "Success" || res.statusCode == "success" || res.statusCode == "1001" ){
    //   //   this.toaster.success(res.message,'Success')
    //   //  }else if(res.statusCode == "Failure" || res.statusCode == "failure"){
    //   //    this.toaster.error(res.errorMessage, 'Failure')
    //   //  }
    // })
  }

  saveServices(tabToMove: string, dataToSubmit: any) {
    // var temp = {
    //   id: this.regId,
    //   vendorService: dataToSubmit
    // }
    this.moveTContacts = false;
       this.saveData();
        this.moveToSelectedTab(tabToMove);
    // this.vendorRegSer.saveVendorRegistration(temp).subscribe((res) => {
    //   // if(res.statusCode == "Success" || res.statusCode == "success" || res.statusCode == "1001" ){
    //   //   this.toaster.success(res.message,'Success')
    //   //  }else if(res.statusCode == "Failure" || res.statusCode == "failure"){
    //   //    this.toaster.error(res.errorMessage, 'Failure')
    //   //  }
    // })
  }
  saveContacts(tabToMove: string, dataToSubmit: any) {
    // var temp = {
    //   id: this.regId,
    //   vendorContact: dataToSubmit
    // }
    if(this.contactsList.length >=2) {
        this.moveTClentREf = false;
       this.saveData();
        this.moveToSelectedTab(tabToMove);
    } else {
        this.toaster.error("Atleast two Contacts Should be there");
    }
    // this.vendorRegSer.saveVendorRegistration(temp).subscribe((res) => {
    //   // if(res.statusCode == "Success" || res.statusCode == "success" || res.statusCode == "1001" ){
    //   //   this.toaster.success(res.message,'Success')
    //   //  }else if(res.statusCode == "Failure" || res.statusCode == "failure"){
    //   //    this.toaster.error(res.errorMessage, 'Failure')
    //   //  }
    // })
  }

  saveClientReferences(tabToMove: string, dataToSubmit: any) {
    if(this.vendorRegObj.clientRefference){
        if(true) { // this.clientRefList.length>0
            this.moveTBankdts = false;
            this.saveData();
            this.moveToSelectedTab(tabToMove);
        } else {
            this.toaster.error("Atleast One client reference is mandatory")
        }
    }else{
        this.moveTBankdts = false;
        this.saveData();
        this.moveToSelectedTab(tabToMove);
    }
  }

  saveFinancials(tabToMove: string, form: NgForm) {
      if(form.invalid) {
        this.toaster.error('Please enter all required fields','Failure')
        return;
      }
      this.moveTOTurnOver = false;
    form.value['id'] = this.regId;
    // this.vendorRegSer.saveVendorRegistration(form.value).subscribe((res) => {
    //   // if(res.statusCode == "Success" || res.statusCode == "success" || res.statusCode == "1001" ){
    //   //   this.toaster.success(res.message,'Success')
    //   //  }else if(res.statusCode == "Failure" || res.statusCode == "failure"){
    //   //    this.toaster.error(res.errorMessage, 'Failure')
    //   //  }
    // })
    this.saveData();
    this.moveToSelectedTab(tabToMove);
  }

  saveTurnOver(tabToMove: string, form: any) {
    // if(form.invalid){
    //     this.toaster.error('Please enter all required fields')
    //     return;
    //   }
    this.moveTOAuthorized = false;
    this.saveData();
    // this.moveToSelectedTab(tabToMove);

  }

  saveAuthorized(tabToMove: string, form: any) {
    if(form.invalid && form.value.isAuthorizedDistributor) {
        this.toaster.error('Please enter all required fields','Failure')
        return;
      }
      this.moveTDocuments = false;
    this.saveData();
    this.moveToSelectedTab(tabToMove);

  }


  saveDocuments(tabToMove: string, form: NgForm) {
    // this.certificatesArray.forEach(file => {
    //   if(!file.isOldCertificate){
    //     this.convertSer.getBase64(file).then((data:string)=>{
    //       var temp = {
    //         fileName: file.name,
    //         file: data.split(',')[1]
    //       }
    //       this.certificatesToBase64.push(temp)
    //     })
    //   }
    // });
    if(form.valid && this.documentsArray.length > 1) {

        this.moveTCertificates = false;
      this.saveData();
      this.moveToSelectedTab(tabToMove);

    } else {
        this.toaster.error("Pancard and GST documents are mandatory")
    }
    setTimeout(()=> {
      const temp = {
        id: this.regId,
        'certificates': this.certificatesToBase64
      }
      // this.vendorRegSer.saveVendorRegistration(temp).subscribe((res) => {
      //   console.log(res, 'financials')
      //   // if(res.statusCode == "Success" || res.statusCode == "success" || res.statusCode == "1001" ){
      //   //   this.toaster.success(res.message,'Success')
      //   //  }else if(res.statusCode == "Failure" || res.statusCode == "failure"){
      //   //    this.toaster.error(res.errorMessage, 'Failure')
      //   //  }
      // })

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

  regFormSubmit(form: NgForm,terms) {
    if(this.vendorRegObj.acceptedTerms == false){
      const  config: MatDialogConfig = {
        width: ' 762px'
      }
    const dialog =  this.dialog.open(terms, config)
     dialog.afterClosed().subscribe(result => {
          //  this.getAllClients();
      });
    }
    else{
    if(this.certificatesArray.length>0) {
      this.certificatesArray.forEach(element => {
        console.log('element.cer', element)
        if(element.isOldCertificate) {

        } else {
          this.convertSer.getBase64(element).then((data:string)=> {
            const temp = {
              fileName: element.name,
              file: data.split(',')[1]
            }
            this.certificatesToBase64.push(temp)
          });
        }
      });

    }
    setTimeout(()=> {
      let finalData = this.generalModel;
      finalData['acceptedTerms'] = this.vendorRegObj.acceptedTerms;
      finalData['clientRefference'] = this.vendorRegObj.clientRefference;
      finalData['tempapproval'] = this.vendorRegObj.tempapproval;
      finalData['validdate'] = this.vendorRegObj.validdate;
      finalData['id'] = this.regId;
      finalData['companyId'] = this.loggedUserDetails.org['companyId'];
      finalData['orgBranches'] = this.branchesForm.getRawValue().orgBranches;
      finalData['vendorProduct'] = this.productsList;
      finalData['vendorService'] = this.servicesList;
      finalData['vendorContact'] = this.contactsList;
      finalData['clientReference'] = this.clientRefList;
      finalData['orgBankDetails'] = [this.financialModel];
      finalData['orgTurnOver']=this.turnOver;
      finalData['authorizedDistributor'] = this.authorizedForm.value.isAuthorizedDistributor;
      if(this.authorizedForm.value.isAuthorizedDistributor == true) {
      finalData['distributors'] = this.authorizedForm.getRawValue().distributors;
      }
      finalData['certificates'] = this.certificatesToBase64 || [] ;
      finalData['documents'] = this.documentsToBase64 || [];
    //   finalData['documents'] = [this.panDocTOBase64,
    //                             this.gstinDocTOBase64,
    //                             this.msmeDocTOBase64,
    //                             this.chequeDocTOBase64,
    //                             this.documentsToBase64,] || [];
      finalData['orgType'] = this.vendorRegObj['orgType'];
      finalData['createdTS'] = new Date();
      finalData['status']=this.vendorRegObj['status'];
      finalData['email']=this.vendorRegObj['email'];
      finalData['refference']=this.vendorRegObj['refference'];
      finalData['website']=this.vendorRegObj['website'];
      finalData['organizationPhonenumber']=this.vendorRegObj['organizationPhonenumber'];
      finalData['dpsName']=this.vendorRegObj['dpsName'];
      finalData['gmtName']=this.vendorRegObj['gmtName'];
      finalData['bfsName']=this.vendorRegObj['bfsName'];
      finalData['crn'] = this.vendorRegObj['crn'];
      finalData['india'] = this.vendorRegObj['india'];

      this.vendorRegSer.submitVendorRegistration(finalData).subscribe((res:any) => {
       if(res.status == 'Success' || res.status == 'success' ) {
        this.toaster.success(res.message,'Success')
       } else if(res.status == 'Failure' || res.status == 'failure') {
         this.toaster.error(res.errorMessage, 'Failure')
       }
      })
    }, 200)
  }

  }

  onAcceptSubmit(accept){
    let reqObj = {
      'id' : this.vendorRegObj.id
    }
    this.vendorRegSer.getUpdateOrgTc(reqObj).subscribe((res:any) => {
      if(res == true ) {
        this.getVendorById(this.regId);
        this.matDialog.closeAll();
       this.toaster.success(res.message,'Success')
      } else {
        this.toaster.error(res.errorMessage, 'Failure')
      }
     })
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

  getVendorById(id) {
    this.vendorRegObj  = null;
    this.vendorRegSer.getVendorById({id: id}).subscribe((response)=> {
      this.vendorRegObj = response;
      console.log('response', response)
        // setTimeout(() => {
          this.bindData()
        // }, 500);

      // this.bindBranches();
    }, (error)=> {

    });
  }
  bindData() {
    this.bindGeneralModelData();
    this.bindFinancialModelData();
    this.bindServices();
    this.bindContacts();
    this.bindProducts();
    this.bindClientRefAndDocs();
    this.bindBranches();
    this.bindAuthorized();
    this.bindTurnOver();
  }

  bindClientRefAndDocs() {
    this.clientRefList = this.vendorRegObj.clientReference;
    if(this.vendorRegObj.documents.length>0) {
      this.documentsArray = []
      this.documentsToBase64=[]
      this.vendorRegObj.documents.forEach(element => {
        const obj = Object.assign({},element);
        obj['name'] = element.fileName;
        obj['isOldDocs']  = true;
        this.documentsArray.push(obj);
        const temp = {
          fileName: element.fileName,
          file: element.file
        };
        this.documentsToBase64.push(temp);
      });
    }
    if(this.vendorRegObj.certificates.length>0) {
      this.certificatesArray = []
      this.certificatesToBase64=[]
      this.vendorRegObj.certificates.forEach(element => {
        const obj = Object.assign({},element);
        obj['name'] = element.fileName;
        obj['isOldCertificate']  = true;
        this.certificatesArray.push(obj);
        const temp = {
          fileName: element.fileName,
          file: element.file
        };
        this.certificatesToBase64.push(temp);
      });
    }
  }
  bindProducts() {
    this.productsList = this.vendorRegObj.vendorProduct || [];
  }

  bindContacts() {
    this.contactsList = this.vendorRegObj.vendorContact || [];
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
      'state':this.vendorRegObj.state,
      'zipCode':this.vendorRegObj.zipCode
    };
  }

  bindFinancialModelData() {
    console.log('flinancti', this.vendorRegObj.orgBankDetails);
    if(this.vendorRegObj.orgBankDetails.length>0) {

      this.financialModel = {
        'bankName': this.vendorRegObj.orgBankDetails[0].bankName,
        'accountNumber': this.vendorRegObj.orgBankDetails[0].accountNumber,
        'branchName': this.vendorRegObj.orgBankDetails[0].branchName,
        'ifscCode': this.vendorRegObj.orgBankDetails[0].ifscCode,
        'pinCode':this.vendorRegObj.orgBankDetails[0].pinCode
      };
    }
  }

  bindServices() {
    this.servicesList = this.vendorRegObj.vendorService || [];
  }

  bindBranches() {

    this.tempBranches = this.vendorRegObj['orgBranches'];


    if(this.tempBranches.length>0) {
      this.tempBranches.forEach((element, index) => {
        if(index > -1) {
         this.addBranchWithData(element);
        }
      });

      setTimeout(() => {
        this.orgBranches.removeAt(0);
      }, 300);
    }



    // this.patchBranches(this.tempBranches);
  }

  patchBranches(branches) {

    for (let i = 0; i < branches.length - 1; i++) {
       this.createBranch();
       const e = this.branchesForm.get('orgBranches') as FormArray;
       e.patchValue(branches[i]);
    }


}



  prepareBranches(branches) {
    const tempBranches = [];
    branches.forEach(branch => {

            tempBranches.push(branch);

    });

    return tempBranches;
  }


  bindAuthorized() {
    this.tempAuthorized = this.vendorRegObj['distributors'];


    if(this.tempAuthorized.length>0) {
    this.authorizedForm.patchValue({'isAuthorizedDistributor': this.vendorRegObj['authorizedDistributor']});
      this.tempAuthorized.forEach((element, index) => {
        if(index > -1) {
         this.addAuthorizedWithData(element);
        }
      });

      setTimeout(() => {
        this.distributors.removeAt(0);
      }, 300);
    }


  }

  bindTurnOver() {
    console.log('turnOver', this.vendorRegObj.orgTurnOver);
    if(this.vendorRegObj.orgTurnOver.length>0) {

        this.turnOver = this.vendorRegObj.orgTurnOver || [];
      }

  }

  addTurnOver() {
    if(this.turnOver.length < 3) {
      this.turnOver.push({
        'year':'',
        'amount':''
      });
    } else {
      this.toaster.error('Only last 3 years are accepted','Error');
    }
  }

  removeTurnOver(i) {
    this.turnOver.splice(i,1);
  }



  saveData() {
    if(this.documentsArray.length>0) {
      this.documentsArray.forEach((element, index) => {
        console.log('element.isOldDocs', element);
        if(element.isOldDocs) {

        } else {
          this.convertSer.getBase64(element).then((data:string)=> {
            element['isOldDocs']  = true;
            const temp = {
              fileName: element.name,
              file: data.split(',')[1]
            };
          this.documentsToBase64.push(temp);
          });
        }
      });
    }
    if(this.certificatesArray.length>0) {
      this.certificatesArray.forEach(element => {
        console.log('element.cer', element);
        if(element.isOldCertificate) {

        } else {
          this.convertSer.getBase64(element).then((data:string)=> {
            const temp = {
              fileName: element.name,
              file: data.split(',')[1]
            };
            this.certificatesToBase64.push(temp);
          });
        }
      });

    }

    console.log('pandocs', this.panDocTOBase64);
    console.log('pandocs', this.gstinDocTOBase64);
    console.log('pandocs', this.msmeDocTOBase64);
    console.log('pandocs', this.documentsToBase64);


    setTimeout(()=> {
      const finalData = this.generalModel;
      finalData['id'] = this.regId;
      finalData['acceptedTerms'] = this.vendorRegObj.acceptedTerms;
      finalData['clientRefference'] = this.vendorRegObj.clientRefference;
      finalData['tempapproval'] = this.vendorRegObj.tempapproval;
      finalData['validdate'] = this.vendorRegObj.validdate;
      this.contactsList.forEach(c => {
        c['organization'] = {'id': this.regId};
      });

      finalData['companyId'] = this.loggedUserDetails.org['companyId'];
      finalData['orgBranches'] = this.branchesForm.getRawValue().orgBranches;
      finalData['vendorProduct'] = this.productsList;
      finalData['vendorService'] = this.servicesList;
      finalData['vendorContact'] = this.contactsList;
      finalData['clientReference'] = this.clientRefList;
      finalData['orgBankDetails'] = [this.financialModel];
      finalData['orgTurnOver'] = (this.turnOver[0].amount.length === 0 && this.turnOver[0].year.length === 0) ? [] : this.turnOver;
      finalData['authorizedDistributor'] = this.authorizedForm.value.isAuthorizedDistributor;
      if(this.authorizedForm.value.isAuthorizedDistributor === true) {
      finalData['distributors'] = this.authorizedForm.getRawValue().distributors;
      } else {
        finalData['distributors'] = [];
      }
      finalData['certificates'] = this.certificatesToBase64 || [] ;
     finalData['documents'] = this.documentsToBase64 || [];
     finalData['createdTS']=this.vendorRegObj.createdTS;
     finalData['emailsent']=this.vendorRegObj.emailsent;
     finalData['vendorStatus']=this.vendorRegObj.vendorStatus;
     finalData['procucevStatus']=this.vendorRegObj.procucevStatus;
     finalData['status']=this.vendorRegObj['status'];
     finalData['email']=this.vendorRegObj['email'];
     finalData['refference']=this.vendorRegObj['refference'];
     finalData['website']=this.vendorRegObj['website'];
     finalData['organizationPhonenumber']=this.vendorRegObj['organizationPhonenumber'];
     finalData['vendorcategory']=this.vendorRegObj['vendorcategory'];
     finalData['subCategory']=this.vendorRegObj['subCategory'];
     finalData['dpsName']=this.vendorRegObj['dpsName'];
     finalData['gmtName']=this.vendorRegObj['gmtName'];
     finalData['bfsName']=this.vendorRegObj['bfsName'];
     finalData['upgradeVendor'] = this.vendorRegObj['upgradeVendor'];
     finalData['upgradeStartDate'] = this.vendorRegObj['upgradeStartDate'];
     finalData['upgradeEndDate'] = this.vendorRegObj['upgradeEndDate'];
     finalData['upgradeDays'] = this.vendorRegObj['upgradeDays'];
     finalData['crn'] = this.vendorRegObj['crn'];
     finalData['india'] = this.vendorRegObj['india'];

    //  if(this.panDocTOBase64.length>0){
    //   finalData['documents'].push(this.panDocTOBase64[0])
    //  }
    //  if(this.msmeDocTOBase64.length>0){
    //   finalData['documents'].push(this.msmeDocTOBase64[0])
    //  }
    //  if(this.chequeDocTOBase64.length>0){
    //   finalData['documents'].push(this.chequeDocTOBase64[0])
    //  }
    //  if(this.gstinDocTOBase64.length>0){
    //   finalData['documents'].push(this.gstinDocTOBase64[0])
    //  }
    //   finalData['documents'] = [this.panDocTOBase64,
    //                             this.gstinDocTOBase64,
    //                             this.msmeDocTOBase64,
    //                             this.chequeDocTOBase64,
    //                              this.documentsToBase64] || [];
      finalData['orgType'] = this.vendorRegObj['orgType'];



      this.vendorRegSer.saveVendorRegistration(finalData).subscribe((res) => {
        this.toaster.success(res['message'], 'Success');
      });

    }, 200);


      this.selectedIndex = this.selectedIndex + 1;

  }

  onTabClick(e) {
    this.selectedIndex = e.index;
  }
}

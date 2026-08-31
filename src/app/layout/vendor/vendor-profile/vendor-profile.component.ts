import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { AppConfig } from 'src/app/app.config';
import { EncryDecryService } from 'src/app/shared/services';
import { ActivatedRoute } from '@angular/router';
import { VendorRegistrationService } from 'src/app/vendor-registration/services/vendor-registration.service';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { ProductEditComponent } from '../components/product-edit/product-edit.component';
import { ServiceEditComponent } from '../components/service-edit/service-edit.component';
import { VendorViewModelService } from '../../vendor-mgr/services/vendor-view-model.service';
import { AddProductsComponent } from '../components/add-product/add-products.component';
import { AddServicesComponent } from '../components/add-services/add-services.component';
import { ToastrService } from 'ngx-toastr';
import { AddClientRefComponent } from '../components/add-client-ref/add-client-ref.component';
import { EditClientRefComponent } from '../components/edit-client-ref/edit-client-ref.component';
import { ConvertToBase64Service } from 'src/app/shared/modules/common-share/services/convert-to-base64.service';

@Component({
  selector: 'app-vendor-profile',
  templateUrl: './vendor-profile.component.html',
  styleUrls: ['./vendor-profile.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class VendorProfileComponent implements OnInit {

    selectedIndex = 0;

//   productsList: any;
  // servicesList: any = [];


  paginatoryDetails: any;
  pageRecordSize: any;
  pageOptions: any;
  selectedData: any;


  productsList: any = [];
  servicesList: any = [];

  loggedUserDetails: any;
  regId: any;
    vendorRegData: any;
    vendorRegObj: any;
    generalModel: any;
    certificatesArray: any[] = [];
    certificatesToBase64: any[] = [];
    documentsToBase64: any[] = [];
 // vendorRegObj: any;

  constructor(
    private encryDecryService: EncryDecryService,
    private activateRoute: ActivatedRoute,
    private vendorRegSer: VendorRegistrationService,
    private vendorViewService: VendorViewModelService,
    private toasterservice: ToastrService,
    private dialog: MatDialog,
    private convertSer: ConvertToBase64Service,
  ) { }

  ngOnInit() {
            const temp =  JSON.parse(this.encryDecryService.get(localStorage.getItem('logData')) );
            this.loggedUserDetails = temp.details;
            console.log('usrDetails,', this.loggedUserDetails);
            console.log( localStorage.getItem('orgId'), 'rogId');
            console.log( localStorage.getItem('companyName'));
            this.activateRoute.queryParams.subscribe(
            params => {
            console.log('helo', params);
            this.regId = params['regId'] ? params['regId'] : localStorage.getItem('orgId');
            if (this.regId) {
            console.log(this.regId);
            this.getVendorById(this.regId);
            }
            // else {
            //   this.route.navigateByUrl('/error')
            // }
        }
        );
    this.pageRecordSize = AppConfig.GRID_PAGE_INFO.initpageSize;
    this.pageOptions = AppConfig.GRID_PAGE_INFO.pageOptions;
    // this.getVendordetails();
  }

  getVendorById(id) {
    this.vendorRegData  = null;
    this.vendorRegSer.getVendorById({id: id}).subscribe((response) => {
      this.vendorRegData = response;
      console.log('response', response);
        // setTimeout(() => {
          this.bindData();
        // }, 500);

      // this.bindBranches();
    }, (error) => {

    });
  }
  bindData() {

    this.bindProducts();
    // this.bindGeneralModelData();
    // this.bindFinancialModelData();
    this.bindServices();
    // this.bindContacts();

    // this.bindClientRefAndDocs();
    // this.bindBranches();
    // this.bindAuthorized();
    // this.bindTurnOver();
  }

  bindProducts() {
    this.productsList = this.vendorRegData.vendorProduct || [];
  }

  bindServices() {
  this.servicesList = this.vendorRegData.vendorService || [];
  }

  getVendordetails() {
    const temp = {
      id: localStorage.getItem('orgId')
    };
    this.vendorViewService.getVendorById(temp).subscribe((res: any) => {

      if (res) {
        this.vendorRegData = res || {};
        console.log(this.vendorRegData);
      }
    });

  }




  onTabClick(e) {
    this.selectedIndex = e.index;
  }

  branchHeaders: any = [
    { field: 'branchName', header: 'Branch Name', isLink: false },
    { field: 'gstin', header: 'GSTIN', isLink: false },
    { field: 'address1', header: 'Branch Address', isLink: false },
    { field: 'city', header: 'City', isLink: false },
    { field: 'state', header: 'State', isLink: false },
    { field: 'zipCode', header: 'Pin Code', isLink: false },
    { field: 'others', header: 'Others', isLink: false },

  ];

  productsHeaders: any = [
    // { field: 'ID', header: 'ID', isLink: false },
    { field: 'hsnCode', header: 'HSN Code', isLink: false },
    { field: 'brandName', header: 'Brand Name', isLink: false },
    { field: 'productName', header: 'Product Name', isLink: false },
    { field: 'description', header: 'Description', isLink: false },
    { field: 'others', header: 'Others', isLink: false },
    { field: 'fileName', header: 'File', isLink: false , fieldType: true},
  ];

  servicesHeaders: any = [
    { field: 'sacCode', header: 'SAC Code', isLink: false },
    { field: 'serviceName', header: 'Service Name', isLink: false },
    { field: 'description', header: 'Description', isLink: false },
    { field: 'others', header: 'Others', isLink: false },
  ];

  contactHeaders: any = [
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
    { field: 'files', header: 'File', isLink: true,
    valueGetter: function(params) {
      return this.getFileName(params);
    } },
  ];

  onEditProduct(rowData) {
    // prdData.action = action;
    console.log('rr', rowData);
    console.log(rowData.ID);
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    const obj = {
      'rowData': rowData,
      'vendorRegData' : this.vendorRegData
    };
    dialogConfig.data = obj;
    dialogConfig.width = '40%';
    // dialogConfig.height = "500px";
    this.dialog.open(ProductEditComponent, dialogConfig).afterClosed().subscribe(result => {
      console.log(result.data);
      // if (result.event === 'submit') {
      //   this.getVendorById(this.regId);
      //     // rowData.ID.push(result.data)
      //   // this.productsList[ID].push(result.data);
      // }
      this.getVendorById(this.regId);
    });

  }

  EditClientRef(rowData){
    console.log('rr', rowData);
    console.log(rowData.ID);
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    const obj = {
      'rowData': rowData,
      'vendorRegData' : this.vendorRegData
    };
    dialogConfig.data = obj;
    dialogConfig.width = '40%';
    this.dialog.open(EditClientRefComponent, dialogConfig).afterClosed().subscribe(result => {
      console.log(result.data);
      this.getVendorById(this.regId);
    });
  }

  onEditService(rowData) {
    // prdData.action = action;
    console.log(rowData.ID);
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.autoFocus = true;
    const obj = {
      'rowData': rowData,
      'vendorRegData' : this.vendorRegData
    };
    dialogConfig.data = obj;
    dialogConfig.width = '40%';
    // dialogConfig.height = "500px";
    this.dialog.open(ServiceEditComponent, dialogConfig).afterClosed().subscribe(result => {
      console.log(result.data);
      // if (result.event === 'submit') {
      //   this.getVendorById(this.regId);
      //     // rowData.ID.push(result.data)
      //   // this.productsList[ID].push(result.data);
      // }
      this.getVendorById(this.regId);
    });

  }

  onAddProduct(action, prdData) {
    prdData.action = action;
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = '50%';
    dialogConfig.data = this.vendorRegData;
    // dialogConfig.height = "500px";
    console.log('vedgrode', this.vendorRegData);
    this.dialog.open(AddProductsComponent, dialogConfig).afterClosed().subscribe(result => {
      console.log(result.data);
      if (result.event === 'submit') {
        // this.productsList.push(result.data);
        this.getVendorById(this.regId);
      }

    });
  }

  onAddService(action, prdData) {
    prdData.action = action;
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = '50%';
    dialogConfig.data = this.vendorRegData;
    const dailog = this.dialog.open(AddServicesComponent, dialogConfig).afterClosed().subscribe(result => {
      if (result.event === 'submit') {
        // this.servicesList.push(result.data);
        this.getVendorById(this.regId);
      }
    });
  }
  onAddClientRef(action, prdData){
    prdData.action = action;
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = '50%';
    dialogConfig.data = this.vendorRegData;
    const dailog = this.dialog.open(AddClientRefComponent, dialogConfig).afterClosed().subscribe(result => {
      if (result.event === 'submit') {
        // this.servicesList.push(result.data);
        this.getVendorById(this.regId);
      }
    });
  }

  onAddCertificates(action, prdData,mod){
    prdData.action = action;
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = '40%';
    dialogConfig.data = this.vendorRegData;
    const dailog = this.dialog.open(mod, dialogConfig).afterClosed().subscribe(result => {
      if (result.event === 'submit') {
        // this.servicesList.push(result.data);
        this.getVendorById(this.regId);
      }
    });
  }

  onDelete(type: any) {
    if (this.selectedData.length) {
      this.selectedData.forEach(sData => {
        this[type] = this[type].filter((record) => {
          return record.id !== sData.id;
        });
      });
      this.selectedData = [];
    } else {
        this.toasterservice.error('Atleast two Contacts Should be there');
    }


  }

  submitProfile() {
        const obj = {
            'id': localStorage.getItem('orgId'),
            'vendorProduct': this.productsList,
            'vendorService': this.servicesList
        };
        console.log(obj);
    this.vendorRegSer.saveVendorRegistration({obj}).subscribe((res) => {
        this.toasterservice.success(res['message'], 'Success');

  });


  }

  uploadCertificates(files) {
   
    console.log('files', files)
    Array.from(files).forEach(file => {
      this.certificatesArray.push(file)
    this.convertSer.getBase64(file).then((data:any)=> {
        const temp = {
          fileName: file['name'],
          file: data.split(',')[1]
        }
        this.certificatesToBase64.push(temp)
      });
    });
  }
  deleteAttachment(index, type) {
    this[type].splice(index, 1)
    if(type == 'certificatesArray') {
      this.certificatesToBase64.splice(index,1)
      this.vendorRegObj.certificates.splice(index, 1);
    }
    console.log('certificatesArray', this.certificatesArray)
  }
  uploadFile(event) {

  }
  onCertificateAdd(){
      this.vendorRegData.certificates.forEach(element => {
        this.certificatesToBase64.push(element)
      });
    this.vendorRegData['certificates'] = this.certificatesToBase64
    this.vendorRegSer.submitVendorRegistration(this.vendorRegData).subscribe((response) => {
        this.dialog.closeAll();
        if (response['status'] === 'Success') {
          this.certificatesToBase64 = []
          this.toasterservice.success(response['message'], 'Success');
        } else {
          this.toasterservice.error('Failed to update vendor details', 'Failed');
        }
      });
  }
}

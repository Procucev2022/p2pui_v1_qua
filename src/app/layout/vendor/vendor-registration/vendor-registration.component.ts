import { Component, OnInit } from '@angular/core';
import { NgForm, FormGroup } from '@angular/forms';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { AddProductsComponent } from '../../../vendor-registration/components/add-product/add-products.component';
import { VendorService } from '../../../vendor-registration/services/vendor-service.service';
import { AppConfig } from 'src/app/app.config';
import { VendorClientRefComponent } from '../../../vendor-registration/components/vendor-client-ref/vendor-client-ref.component';
import { AddServicesComponent } from '../../../vendor-registration/components/add-services/add-services.component';
import { ActivatedRoute, Router } from '@angular/router';
import { VendorContactsComponent } from '../components/vendor-contacts/vendor-contacts.component';

@Component({
  selector: 'app-vendor-registration',
  templateUrl: './vendor-registration.component.html',
  styleUrls: ['./vendor-registration.component.scss']
})
export class VendorRegistrationComponent implements OnInit {

  selectedIndex = 0;
  title = 'Testing';

  productsList:any;
  servicesList:any
  contactsList:any;
  clientRefList:any;

  paginatoryDetails: any;
  pageRecordSize: any;
  pageOptions: any;
  selectedData:any;
  regId: any;

  constructor(private dialog: MatDialog,private vendorService: VendorService, private activateRoute: ActivatedRoute, private route: Router){

  }

  ngOnInit() {

    this.activateRoute.queryParams.subscribe(
      params => {
        this.regId =  params['regId'];
        if(this.regId) {
        console.log(this.regId)
        }
        else{
          this.route.navigateByUrl('/error')
        }
      }
    )


    this.pageRecordSize = AppConfig.GRID_PAGE_INFO.initpageSize;
    this.pageOptions = AppConfig.GRID_PAGE_INFO.pageOptions;
    this.getProductsData();
    this.getServicesData()
    this.getVendorContactsData();
    this.getClientRefData();
   }



  productsHeaders: any = [
    //{field:'id'},
    { field: 'hsnCode', header: 'HSN Code', isLink: false },
    //{ field: 'sacCode', header: 'SAC Code', isLink: false },
    { field: 'productName', header: 'Product Name', isLink: false },
    { field: 'description', header: 'Description', isLink: false },
    { field: 'others', header: 'Others', isLink: false },
  ];

  servicesHeaders: any = [
    //{field:'id'},
    //{ field: 'hsnCode', header: 'HSN Code', isLink: false },
    { field: 'sacCode', header: 'SAC Code', isLink: false },
    { field: 'serviceName', header: 'Service Name', isLink: false },
    { field: 'description', header: 'Description', isLink: false },
    { field: 'others', header: 'Others', isLink: false },
  ];

  contactsHeaders: any = [
    //{field:'id'},
    { field: 'firstName', header: 'First Name', isLink: false },
    { field: 'lastName', header: 'Last Name', isLink: false },
    { field: 'email', header: 'Email', isLink: false },
    { field: 'phone', header: 'Phone', isLink: false },
  ];

  clientRefHeaders: any = [
    { field: 'name', header: 'Name', isLink: false },
    { field: 'email', header: 'Email', isLink: false },
    { field: 'poc', header: 'POC', isLink: false },
    { field: 'pocName', header: 'POC Name', isLink: false },
    { field: 'comments', header: 'Comments', isLink: false },
    { field: 'file', header: 'File', isLink: false },
  ];

  rowData = [

  ];
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
    console.log(this.productsList);
  }

  moveToNextTab(form: NgForm) { // not using currently , we will use after form validation applied
    if (form.valid) {
      this.selectedIndex++;
    } else {
      console.log('In Valid Form')
    }
  }
  moveToBackTab() {
    //this.selectedIndex--;
  }
  moveToSelectedTab(tabName: string) {
    for (let i = 0; i < document.querySelectorAll('.mat-tab-label-content').length; i++) {
      if ((<HTMLElement>document.querySelectorAll('.mat-tab-label-content')[i]).innerText == tabName) {
        (<HTMLElement>document.querySelectorAll('.mat-tab-label')[i]).click();
      }
    }
  }
  moveToBranches(tabName: string,form:NgForm) {
    for (let i = 0; i < document.querySelectorAll('.mat-tab-label-content').length; i++) {
      if ((<HTMLElement>document.querySelectorAll('.mat-tab-label-content')[i]).innerText == tabName) {
        (<HTMLElement>document.querySelectorAll('.mat-tab-label')[i]).click();
      }
    }
    if(form.invalid){
        return;
    }
    this.vendorService.getGeneralForm(
        form.value.companyName,
        form.value.pan,
        form.value.gstin,
        form.value.address
    );
    form.resetForm();
  }
  moveToProducts(tabName: string,form:NgForm) {
    for (let i = 0; i < document.querySelectorAll('.mat-tab-label-content').length; i++) {
      if ((<HTMLElement>document.querySelectorAll('.mat-tab-label-content')[i]).innerText == tabName) {
        (<HTMLElement>document.querySelectorAll('.mat-tab-label')[i]).click();
      }
    }
    if(form.invalid){
        return;
    }
    this.vendorService.getBranchesForm(
        form.value.branchName,
        form.value.branchAddress
    );
    form.resetForm();
}
  onAddProduct(action,prdData) {
    prdData.action = action;
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = "40%";
    dialogConfig.height = "500px";
    this.dialog.open(AddProductsComponent, dialogConfig).afterClosed().subscribe(result => {
      console.log(result.data);
      if(result.event == 'submit'){
        this.productsList.push(result.data);
      }

    });
  }

  onAddService(action,prdData) {
    prdData.action = action;
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = "40%";
    dialogConfig.height = "500px";
    const dailog = this.dialog.open(AddServicesComponent,dialogConfig);
    dailog.afterClosed().subscribe(result => {
      if(result.event == 'submit'){
      this.servicesList.push(result.data);
      }
    });
  }

  onAddContact(action,prdData) {
    prdData.action = action;
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = "40%";
    dialogConfig.height = "600px";
    this.dialog.open(VendorContactsComponent, dialogConfig).afterClosed().subscribe(result => {
      console.log(result);
      if(result.event == 'submit'){}
    });
  }

  onAddClientRef(action,prdData) {
    prdData.action = action;
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = "40%";
    dialogConfig.height = "600px";
    this.dialog.open(VendorClientRefComponent, dialogConfig)
  }

  onDelete(){
    console.log(this.productsList);

    this.selectedData.forEach(sData => {
      this.productsList = this.productsList.filter((p)=>{
        return p.id != sData.id
      })
    });
    console.log(this.productsList);
  }


  selectedFilesArray: any[];
  selectedDocumentsArray: any[];

  // file upload
  uploadingFiles(event){
    //this.selectedFiles = event.target.files;
    this.selectedFilesArray = Array.from(event.target.files);
    //this.fileName = this.selectedFiles[0].name;
  }

  removeFile(index){
    //console.log(this.selectedFiles);
    console.log(index);
    //delete this.selectedFilesArray[index];
    this.selectedFilesArray.splice(index,1)
    //if(this.selectedFilesArray.splice(index,0))
  }

  uploadingDocuments(event){
    this.selectedDocumentsArray = Array.from(event.target.files)
  }
  removeDocumentFiles(index){
    this.selectedDocumentsArray.splice(index,1)
  }

  regFormSubmit(){

  }

}

import { Component, OnInit, ViewEncapsulation, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { VendorViewModelService } from '../../../../../layout/vendor-mgr/services/vendor-view-model.service';
import { Optional } from 'ag-grid-community';
import { AppConfig } from 'src/app/app.config';
import { MAT_DIALOG_DATA, MatDialogRef,  } from '@angular/material/dialog';



@Component({
  selector: 'app-vendor-view-model',
  templateUrl: './vendor-view-model.component.html',
  styleUrls: ['./vendor-view-model.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class VendorViewModelComponent implements OnInit {


  //   productsList: any= []
  //   servicesList: any = []
  //   contactsList: any = [];
  //   clientRefList: any = [];

  productsList: any;
  servicesList: any;
  contactsList: any;
  clientRefList: any;


  paginatoryDetails: any;
  pageRecordSize: any;
  pageOptions: any;
  selectedData: any;
  vendorRegData: any;


  constructor(private dialogRef: MatDialogRef<VendorViewModelComponent>,
    @Optional() @Inject(MAT_DIALOG_DATA) public data,
    private httpService: HttpClient,
    private vendorViewService: VendorViewModelService ) {
    this.vendorRegData = data;
    console.log('reg data'+this.vendorRegData);
  }





  closeDialog() {
    this.dialogRef.close({ event: 'Cancel' });
  }



  approvalViewDetails = {

    "companyName": "Venu",
    "pan": "Gse34",
    "gstin": "7879dsfj",
    "address1": "vijayaeada",
    "address2": "krishna",
    "country": "India",
    "state": "Andhra Pradesh",
    "city": "viijayawada",
    "zipCode": "539900",

    "orgBranches":
    {
      "branchName": "guru",
      "address1": "vijayaeafa",
      "address2": "krishna",
      "country": "india",
      "state": "Ap",
      "city": "vij",
      "zipCode": "539900",
      "others": "sdf"
    },


    "vendorProduct": [
      {
        "hsnCode": 555,
        "productName": "procucev",
        "others": "no mention",
        "description": "description"
      }]
    ,

    "vendorService": [
      {
        "sacCode": 556,
        "serviceName": "procucev",
        "others": "no mention",
        "description": "description"
      }]
    ,

    "vendorContact": [
      {
        "firstName": "stephen",
        "lastName": "curry",
        "email": "reply@email.com",
        "phone": "999999999"
      }]
    ,

    "clientReference": [
      {
        "name": "stephen",
        "email": "curry@gmail.com",
        "pocFirstName": "seth",
        "pocLastName": "curry",
        "phone": "999999999",
        "comments": "no comments",
        "file": "aslkhdf"
      }
    ],

    "orgBankDetails":
    {
      "bankName": "venu",
      "accountNumber": "1237834927947",
      "branchName": "gade",
      "ifscCode": "VEN798sdf",
      "pinCode": "677989"
    },
    "orgTurnOver":[
    {
        "year":"2019",
        "amount":20000
    },
    {
        "year":"2018",
        "amount":200
    }
],

    "distributors":[
        {
            "company":"Info",
            "type":"product",
            "description":"product and service"
        },
        {
            "company":"Infotech",
            "type":"product",
            "description":"product"
        }
    ]


  }

  branchHeaders: any = [
    { field: 'branchName', header: 'Branch Name', isLink: false, width:'145px' },
    { field: 'gstin', header: 'GSTIN', isLink: false ,width:'105px'},
    { field: 'address1', header: 'Branch Address', isLink: false ,width:'161px'},
    { field: 'city', header: 'City', isLink: false ,width:'105px'},
    { field: 'state', header: 'State', isLink: false ,width:'105px'},
    { field: 'zipCode', header: 'Pin Code', isLink: false ,width:'120px'},
    { field: 'others', header: 'Others', isLink: false ,width:'105px'},

  ];

  productsHeaders: any = [
    // {field:'id'},
    { field: 'hsnCode', header: 'HSN Code', isLink: false },
    // { field: 'sacCode', header: 'SAC Code', isLink: false },
    { field: 'brandName', header: 'Brand Name', isLink: false },
    { field: 'productName', header: 'Product Name', isLink: false },
    { field: 'description', header: 'Description', isLink: false },
    { field: 'others', header: 'Others', isLink: false },
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
    { field: 'name', header: 'Company Name', isLink: false ,width:'155px'},
    { field: 'email', header: 'Email', isLink: false ,width:'105px'},
    { field: 'pocFirstName', header: 'Contact Person Name', isLink: false ,width:'160px'},
    // { field: 'pocLastName', header: 'POC Last Name', isLink: false ,width:'160px'},
    { field: 'phone', header: 'Phone', isLink: false ,width:'105px'},
    { field: 'location', header: 'Location', isLink: false ,width:'130px'},
    { field: 'comments', header: 'Comments', isLink: false ,width:'130px'},
    {
      field: 'files', header: 'File', isLink: true,
      valueGetter: function (params) {
        return this.getFileName(params);
      }
    },
  ];

  //   getProductsData() {
  //     this.vendorViewService
  //       .getProductsData()
  //       .subscribe(data => {
  //         this.productsList = data || [];
  //       });
  //   }

  //   getServicesData() {
  //     this.vendorViewService
  //       .getServicesData()
  //       .subscribe(data => {
  //         this.servicesList = data || [];
  //       });
  //   }

  //   getVendorContactsData() {
  //     this.vendorViewService
  //       .getVendorContactsData()
  //       .subscribe(data => {
  //         this.contactsList = data || [];
  //       });
  //   }
  //   getClientRefData() {
  //     this.vendorViewService
  //       .getClientRefData()
  //       .subscribe(data => {
  //         this.clientRefList = data || [];
  //       });
  //   }

  getRFQs() { }


  downloadFile() { }

  ngOnInit() {
    this.pageRecordSize = AppConfig.GRID_PAGE_INFO.initpageSize;
    this.pageOptions = AppConfig.GRID_PAGE_INFO.pageOptions;
  }

//   downloadAttachment(file) {
//       console.log(file)
//       console.log(file.fileName)
//     const linkSource = 'data:application/pdf;base64,' + file
//     const downloadLink = document.createElement("a");
//     const fileName = file.fileName

//     downloadLink.href = linkSource;
//     downloadLink.download = fileName;
//     downloadLink.click();

//   }

  downloadAttachment(filename, data) {
    let link = document.createElement('a');
    link.href = 'data:application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;base64,' + encodeURIComponent(data);
    link.setAttribute('download', filename);

    link.style.display = 'none';
    document.body.appendChild(link);

    link.click();

    document.body.removeChild(link);
  }

  zoomout() {
    this.dialogRef.updateSize('70%');
  }

  zoomin() {
      this.dialogRef.updateSize('90%');
  }

}

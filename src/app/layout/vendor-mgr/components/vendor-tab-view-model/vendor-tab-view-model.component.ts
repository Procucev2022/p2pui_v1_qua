import { Component, OnInit, ViewEncapsulation, Inject } from '@angular/core';
import { AppConfig } from 'src/app/app.config';
import { Optional } from 'ag-grid-community';
import { DomSanitizer } from '@angular/platform-browser';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { HttpClient } from '@angular/common/http';
import { VendorViewModelService } from '../../services/vendor-view-model.service';

@Component({
  selector: 'app-vendor-tab-view-model',
  templateUrl: './vendor-tab-view-model.component.html',
  styleUrls: ['./vendor-tab-view-model.component.scss'],
  encapsulation:ViewEncapsulation.None
})
export class VendorTabViewModelComponent implements OnInit {

    productsList: any;
    servicesList: any;
    contactsList: any;
    clientRefList: any;


    paginatoryDetails: any;
    pageRecordSize: any;
    pageOptions: any;
    selectedData: any;
    vendorRegData: any;


    constructor(private dialogRef: MatDialogRef<VendorTabViewModelComponent>,
      @Optional() @Inject(MAT_DIALOG_DATA) public data,
      private httpService: HttpClient,
      private vendorViewService: VendorViewModelService,
      private sanitizer: DomSanitizer) {
      this.vendorRegData = data;
    }



    closeDialog() {
      this.dialogRef.close({ event: 'Cancel' });
    }


    productsHeaders: any = [
        //{field:'id'},
        { field: 'hsnCode', header: 'HSN Code', isLink: false },
        //{ field: 'sacCode', header: 'SAC Code', isLink: false },
        { field: 'productName', header: 'Product Name', isLink: false },
        { field: 'brandName', header: 'Brand Name', isLink: false },
        { field: 'description', header: 'Description', isLink: false },
        { field: 'others', header: 'Others', isLink: false },
        { field: 'fileName', header: 'File', isLink: false , fieldType: true},
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
        { field: 'firstName', header: 'Name', isLink: false },
        //{ field: 'lastName', header: 'Last Name', isLink: false },
        { field: 'designation', header: 'Designation', isLink: false },
        { field: 'email', header: 'Email', isLink: false },
        { field: 'phone', header: 'Phone', isLink: false },
        { field: 'alternativenumber', header: 'Alternative Number', isLink: false },
      ];

      clientRefHeaders: any = [
        { field: 'name', header: 'Company Name', isLink: false },
        { field: 'email', header: 'Email', isLink: false },
        { field: 'pocFirstName', header: 'Contact Person Name', isLink: false },
        //{ field: 'pocLastName', header: 'POC Last Name', isLink: false },
        { field: 'phone', header: 'Phone', isLink: false },
        { field: 'comments', header: 'Comments', isLink: false },
        {
          field: 'file', header: 'File', isLink: true,
          valueGetter: function (params) {
            return this.getFileName(params);
          }
        },
      ];

      getRFQs() { }


      downloadFile() { }

      ngOnInit() {
        this.pageRecordSize = AppConfig.GRID_PAGE_INFO.initpageSize;
        this.pageOptions = AppConfig.GRID_PAGE_INFO.pageOptions;
      }



}

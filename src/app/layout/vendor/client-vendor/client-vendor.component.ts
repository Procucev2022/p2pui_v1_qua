import { AppApiConfig } from './../../../shared/constants/app-api.config';
import { Component, OnInit } from '@angular/core';
import { AddOrEditVendorModalComponent } from '../../../shared/modules/common-share/components/add-or-edit-vendor-modal/add-or-edit-vendor-modal.component';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import {VendorQuotService} from '../services/vendor-quot.service';
import { ToastrService } from 'ngx-toastr';
@Component({
  selector: 'app-client-vendor',
  templateUrl: './client-vendor.component.html',
  styleUrls: ['./client-vendor.component.scss']
})
export class ClientVendorComponent implements OnInit {


  clientVendorsData: any = [];
  displayData: any = [];
  clientVendorDataWithouDuplicates: any = [];
  displayType: any = 'category';
  expandedRows: any = {};
  selectedData :any = [];
  pageRecordSize:any;
    pageOptions: any;
  clientVendorsHeaders: any = [
    // { field: 'id', header: 'Id', isLink: false },
    { field: 'companyName', header: 'Company Name', isLink: false, width: '180px' },
    { field: 'itemDesc', header: 'Description', isLink: false, width: '240px' },
    { field: 'vendorcategory', header: 'Category', isLink: false, width: '170px' }

  ];
  constructor(private modalDialog: MatDialog, private vendorQuotService: VendorQuotService,  private toaster: ToastrService, ) {
    this.pageRecordSize = AppApiConfig.GRID_PAGE_INFO.initpageSize;
    this.pageOptions = AppApiConfig.GRID_PAGE_INFO.pageOptions;
   }
  ngOnInit() {

    this.fetchClientVendors();
  }


  fetchClientVendors() {
    this.vendorQuotService.getAllClientVendors().subscribe((response) => {

      if (response['errorCode'] === 204) {
        this.toaster.error(response['errorMessage']);
        this.clientVendorsData = [];
      } else  if (response['errorCode'] === 500) {
        this.toaster.error(response['errorMessage']);
        this.clientVendorsData = [];
      } else {
        this.clientVendorsData = response;
        this.displayData = response;
        this.filterData();
      }
    }, (error) => {

    });
  }
  addOrEditVendor(data) {
    const modalData = data ? data : null;
    let height;
    if (data != null) {
      height = '100px';
    } else {
      height = '450px';
    }
    console.log('heght is ' + height);
    this.modalDialog.open(AddOrEditVendorModalComponent, {
      width: '70%',
      minHeight: height,
      data: data,
    }).afterClosed().subscribe((result) => {
      console.log('result.event', result.event);
      if (result && result.event === 'close') {
        this.fetchClientVendors();
      }
    });
  }

  displayFormat() {
    if (this.displayType === 'vendor') {
      this.displayData = this.clientVendorDataWithouDuplicates;
    } else {
      this.displayData = this.clientVendorsData;
    }
  }

  filterData() {

    this.clientVendorDataWithouDuplicates = this.sort_by_key(this.clientVendorsData, 'companyName');
    const data: any = [];
    data.push(this.clientVendorDataWithouDuplicates[0]);
    for (let i = 1; i < this.clientVendorDataWithouDuplicates.length; i++) {
      if (this.clientVendorDataWithouDuplicates[i].companyName !== data[data.length - 1].companyName) {
        data.push(this.clientVendorDataWithouDuplicates[i]);
      }
    }
    this.clientVendorDataWithouDuplicates = data;

  }


  sort_by_key(array, key) {
  return array.sort(function(a, b) {
    const x = a[key]; const y = b[key];
    return ((x < y) ? -1 : ((x > y) ? 1 : 0));
  });
  }
}

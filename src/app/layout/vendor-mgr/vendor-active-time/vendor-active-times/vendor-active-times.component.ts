import { Component, OnInit, Optional, Inject } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CategoryService } from 'src/app/layout/category/services/category.service';
import { AppApiConfig } from 'src/app/shared/constants/app-api.config';
import { VendorLinkingToItemModalComponent } from 'src/app/layout/category/vendor-linking-to-item-modal/vendor-linking-to-item-modal.component';
import { EncryDecryService } from 'src/app/shared/services';
@Component({
  selector: 'app-vendor-active-times',
  templateUrl: './vendor-active-times.component.html',
  styleUrls: ['./vendor-active-times.component.scss']
})
export class VendorActiveTimesComponent implements OnInit {

  startTime: any;
  endTime: any;
  day: any;
  selectedType: any;
  paginatoryDetails: any;
  searchForm: FormGroup;
  vendorList = [];
  pageRecordSize: any;
  pageOptions: any;
  selectedItems = new Map();
  vendorHeaders = [
    { field: 'vendorName',  header: 'Vendor Name',  isLink: false, width: '150px', fieldType: 'text' },
    { field: 'city',  header: 'City',  isLink: false, width: '120px', fieldType: 'text' },
    { field: 'rank', header: 'Rank', isLink: false,  width: '120px',  fieldType: 'text'},
    { field: 'uom', header: 'UOM', isLink: false,  width: '130px',  fieldType: 'text'},
    { field: 'pricePerUnit',  header: 'Price Per Unit',  isLink: false, width: '120px', fieldType: 'text' }
  ];

  itemHeaders = [
    { field: 'itemNumber',  header: 'Item Number',  isLink: false, width: '185px', fieldType: 'text' },
    { field: 'description',  header: 'Item Description',  isLink: false, width: '530px', fieldType: 'text' }
  ];
  itemList = [];
  selectedData: any;
  selecteItemsData = [];
  daysList = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  typeList: any = [
    'Daily',
    'Weekly'
  ];
  requiredCheck = true;
  selectedVendorList: any[] = [];
  linkedVendorListByItem: any[] = [];
  loggedUserDetails: any;
  roleName: any;

  constructor(private fb: FormBuilder,
    private catService: CategoryService, private modalDialog: MatDialog, private toastr: ToastrService,
    private encryDecryService: EncryDecryService) { }

  ngOnInit() {
    // this.searchForm =  this.fb.group({
    //   type: ['hsn'],
    //   companyName: [''],
    //   city: [''],
    //   hsncode: [''],
    //   saccode: ['']
    // });
    this.pageRecordSize = AppApiConfig.GRID_PAGE_INFO.initpageSize;
    this.pageOptions = AppApiConfig.GRID_PAGE_INFO.pageOptions;
    this.searchForm =  this.fb.group({
        itemCode: [''],
    });
    const temp = JSON.parse(
      this.encryDecryService.get(localStorage.getItem('logData'))
    );
    this.loggedUserDetails = temp.details;
    this.roleName = this.loggedUserDetails.role.roleName;


  }

//  get type() {return this.searchForm.controls.type ; }
//  get city() {return this.searchForm.controls.city ; }
//  get hsncode() {return this.searchForm.controls.hsncode ; }
//  get saccode() {return this.searchForm.controls.saccode ; }
//  get companyName() {return this.searchForm.controls.companyName ; }

get itemCode() {return this.searchForm.controls.itemCode ; }

 searchVendor() {
  const reqPayload = {
    // city: this.city.value,
    // companyName: this.companyName.value,
    // vendorCategory: this.hsncode.value === '' ? [] : [{hsncode: this.hsncode.value}],
    // vendorserviceApprove: this.saccode.value === '' ? [] : [{saccode: this.saccode.value}]
    'itemNumber': this.itemCode.value
  };
  if(this.roleName != 'VendorManager'){
    this.catService.getVendorsSearchByItemCodeForCM(reqPayload).subscribe((res) => {
      if (Array.isArray(res)) {
        this.itemList = res || [];
      }
    });
  }else{
    this.catService.getVendorsSearchByItemCode(reqPayload).subscribe((res) => {
      if (Array.isArray(res)) {
        this.itemList = res || [];
      }
    });
  }
 
 }

 typeSelect() {
  console.log('selected type ' + this.selectedType);

 }

 resetForm() {
   this.searchForm.reset();
  //  this.type.setValue('hsn');
 }

 linkUnLinkVendor(rowData, index, isLinked, isEdit) {
   this.vendorList[index]['isEdit'] = isEdit;
   this.vendorList[index]['isLinked'] = isLinked;
 }

 unLinkVendor(rowData, index) {
  delete this.vendorList[index]['linkedVendorItemDetails'];
  this.vendorList[index]['isEdit'] = false;
  this.vendorList[index]['isLinked'] = false;
 }

 onSubmit() {
  //  if (this.selectedData.length > 0) {
    // if (this.startTime && this.endTime && this.day) {
    //   this.selectedVendorList = [];
    //   this.requiredCheck = true;
    //   this.selectedData.forEach((ele) => {
    //     const obj = {
    //       'itemEditStarttime': this.startTime,
    //       'itemEditEndtime': this.endTime,
    //       'day': this.day,
    //       'vendor': {
    //         'id': ele.id
    //       }
    //     };
    //     this.selectedVendorList.push(obj);
    //   });
    //   this.catService.enableEditToVendor(this.selectedVendorList).subscribe((res: any) => {
    //     if (res.status = 'Success') {
    //       this.toastr.success(res.message, 'Success');
    //     } else {
    //       this.toastr.error(res.message, 'Error');
    //     }
    //   });
    // } else {
    //   this.requiredCheck = false;
    // }
  //  } else {
  //    this.toastr.error('Please select atleast one vendor', 'Error');
  //  }

    if (this.selectedType === undefined || this.startTime === undefined || this.endTime === undefined) {
      this.toastr.error('Please select all the required fields', 'Error');
      return;
    }
    if (this.selectedType !== undefined && this.selectedType === 'Weekly' && this.day === undefined) {
      this.toastr.error('Please select Day', 'Error');
      return;
    }

    if (this.selectedItems.size === 0) {
      this.toastr.error('Please select atleast one Item', 'Error');
      return;
    }

    const request = [];
    for (const [itemId, vendors] of  this.selectedItems.entries()) {
      const obj = {
        'id': itemId,
        'dynamicPricingType': this.selectedType,
        'startTime': this.startTime.getHours() + ':' + this.startTime.getMinutes(),
        'endTime': this.endTime.getHours() + ':' + this.endTime.getMinutes(),
        'dynamicPricingDay': this.selectedType === 'Daily' ? null : this.day,
        'vendors': this.getVendorsFormat(vendors)
      };
      request.push(obj);
    }
    this.catService.createDynamicPricingByItemcodes(request).subscribe((res) => {

      if (res['statusCode'] === '200' ) {
        this.toastr.success(res['message'], 'Success');
      } else {
        this.toastr.error(res['message'], 'Failure');
      }
    });


 }

 getVendorsFormat(vendors) {
  const arr = [];
  for (let i = 0; i < vendors.length; i++) {
    arr.push({'id': vendors[i]});
  }
  return arr;
 }

 getLinkedVendorDetails(rowData) {
  console.log(rowData);
  this.selectedData = rowData;
  this.linkedVendorListByItem = [];
  const obj = {
          'id': rowData.id
  };
  this.catService.getLinkedVendorByItemId(obj).subscribe((res) => {
      if (res && Array.isArray(res)) {
        this.linkedVendorListByItem = [];
          for (let i = 0; i < res.length; i++) {
            const data = res[i];
            data['uom'] = data['uom']['description'];
            data['status'] = data.status ? data['status']['uiDisplay'] : '';
            this.linkedVendorListByItem.push(data);
        }
      }
  });

}

addItem(event, data, type) {


    if (type === 'vendorLevel') {
      if (this.selectedItems.has(this.selectedData.id)) {
        if (!this.selectedItems.get(this.selectedData.id).includes(data.vendorId)) {
          this.selectedItems.get(this.selectedData.id).push(data.vendorId);
        }
      } else {
        this.selectedItems.set(this.selectedData.id, [data.vendorId]);
      }
    } else if (type === 'itemLevel') {
      this.selectedItems.set(data.id,  data.vendorData);
    }
    this.toastr.success('item added', 'Success');
}


//  submitForm() {
//    if (this.checkAnyVendorLinkedOrNot()) {
//      const finalLinkedVendorList  = [];
//      const genericObj =  {
//       'category': this.selectedItemData.category,
//       'hsn':  this.selectedItemData.hsn ? this.selectedItemData.hsn : (this.selectedItemData.sac ? this.selectedItemData.sac : '') ,
//       'item': {'id': this.selectedItemData.id}
//      };
//      const linkedVendorList =  this.vendorList.filter((ele) => ele.isLinked);
//      linkedVendorList.forEach(ele => {
//         const vendor_uom  = {
//            vendor  : { id: ele.id},
//            uom  : {id: ele['linkedVendorItemDetails']['uom']}
//         };
//         const finalpayLoad = {...ele['linkedVendorItemDetails'], ...genericObj, ...vendor_uom};
//         console.log('final payload', finalpayLoad);
//         finalLinkedVendorList.push(finalpayLoad);
//     });
//     this.catService.LinkToVendorWithItem(finalLinkedVendorList).subscribe((res) => {
//       if (res['status'] === 'Success') {
//         this.toastr.success(res['message'], 'Success');
//         this.dialogRef.close({event: 'linked'});
//       }
//     });
//    } else {
//      this.toastr.warning('Please Link atleast one vendor with item', 'Warning');
//    }
//  }

 checkAnyVendorLinkedOrNot() {
    return this.vendorList.some((ele) => ele['isLinked']);
 }
 deactivateItem(event, data) {
  const reqPayload = [{
    'id': data.id
  }];
  this.catService.deactivateItem(reqPayload).subscribe((res) => {
    if (res['status'] === 'Success' ) {
      this.toastr.success(res['message'], 'Success');
      this.searchVendor();
    } else {
      this.toastr.error(res['message'], 'Failure');
    }
  });
 }
 activateItem(event, data) {
  const reqPayload = [{
    'id': data.id
  }];
  this.catService.activateItem(reqPayload).subscribe((res) => {
    if (res['status'] === 'Success' ) {
      this.toastr.success(res['message'], 'Success');
      this.searchVendor();
    } else {
      this.toastr.error(res['message'], 'Failure');
    }
  });
 }


 deactivateVendor(event, data) {
  const reqPayload = [{
    'vendor': {
      'id': data.vendorId
    },
    'item': {
      'id': this.selectedData.id
    }
  }];
  this.catService.deactivateVendor(reqPayload).subscribe((res) => {
    if (res['status'] === 'Success' ) {
      this.toastr.success(res['message'], 'Success');
      this.getLinkedVendorDetails(this.selectedData);
    } else {
      this.toastr.error(res['message'], 'Failure');
    }
  });
 }


 activateVendor(event, data) {
  const reqPayload = [{
    'vendor': {
      'id': data.vendorId
    },
    'item': {
      'id': this.selectedData.id
    }
  }];
  this.catService.activateVendor(reqPayload).subscribe((res) => {
    if (res['status'] === 'Success' ) {
      this.toastr.success(res['message'], 'Success');
      this.getLinkedVendorDetails(this.selectedData);
    } else {
      this.toastr.error(res['message'], 'Failure');
    }
  });
 }


}






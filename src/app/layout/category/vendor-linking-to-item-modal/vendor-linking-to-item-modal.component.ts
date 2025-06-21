import { Component, OnInit, Optional, Inject } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { CategoryService } from '../services/category.service';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { EditVendorLinkingToItemModalComponent } from '../edit-vendor-linking-to-item-modal/edit-vendor-linking-to-item-modal.component';
import { ToastrService } from 'ngx-toastr';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-vendor-linking-to-item-modal',
  templateUrl: './vendor-linking-to-item-modal.component.html',
  styleUrls: ['./vendor-linking-to-item-modal.component.scss']
})
export class VendorLinkingToItemModalComponent implements OnInit {

  paginatoryDetails: any;
  searchForm: FormGroup;
  vendorList = [];
  vendorHeaders = [
    { field: 'companyName',  header: 'Company Name',  isLink: false, width: '220px', fieldType: 'text' },
    { field: 'vendorRank',  header: 'Rank',  isLink: false, width: '220px', fieldType: 'text' },
    { field: 'vendorEmail',  header: 'Email Id',  isLink: false, width: '220px', fieldType: 'text' },
    { field: 'city',  header: 'City',  isLink: false, width: '220px', fieldType: 'text' }
  ];
  selectedData = [];
  pageRecordSize:any = 10; 
  constructor(private fb: FormBuilder,
    private catService: CategoryService, private modalDialog: MatDialog, private toastr: ToastrService, public dialogRef: MatDialogRef<VendorLinkingToItemModalComponent >,
    @Optional() @Inject(MAT_DIALOG_DATA) public selectedItemData) { }

  ngOnInit() {

    console.log('selectedItemData', this.selectedItemData);
    this.searchForm =  this.fb.group({
      type: ['hsn'],
      companyName: [''],
      city: [''],
      hsncode: [''],
      saccode: ['']
    });

  }

 get type() {return this.searchForm.controls.type ; }
 get city() {return this.searchForm.controls.city ; }
 get hsncode() {return this.searchForm.controls.hsncode ; }
 get saccode() {return this.searchForm.controls.saccode ; }
 get companyName() {return this.searchForm.controls.companyName ; }

 searchVendor() {
  const reqPayload = {
    city: this.city.value,
    companyName: this.companyName.value,
    vendorCategory: this.hsncode.value == '' ? [] : [{hsncode: this.hsncode.value}],
    vendorserviceApprove: this.saccode.value == '' ? [] : [{saccode: this.saccode.value}]
  };
  this.catService.getVendorsSearch(reqPayload).subscribe((res) => {
    if (Array.isArray(res)) {
      this.vendorList = res || [];
      this.vendorList.forEach(element => {
        element['isLinked'] = false;
        element['isEdit'] = false;
        element['status'] = element.status ? element['status']['uiDisplay'] : '';
      });
    }
  });
 }

 resetForm() {
   this.searchForm.reset();
   this.type.setValue('hsn');
 }

 linkUnLinkVendor(rowData, index, isLinked, isEdit) {
   this.vendorList[index]['isEdit'] = isEdit;
   this.vendorList[index]['isLinked'] = isLinked;
 }

 linkUnLinkVendorModal(rowData, index) {
     rowData['itemDescription'] = this.selectedItemData['description']
     rowData['itemNumber'] = this.selectedItemData['itemNumber']
    this.modalDialog.open(EditVendorLinkingToItemModalComponent, {
    width: '80%',
    minHeight: '44vh',
    data: rowData

    }).afterClosed().subscribe((event) => {
      if (event.type === 'linked') {
      this.vendorList[index] = Object.assign({}, event['data']);
      }
    });
 }

 editLinkedVendorData(rowData, index) {
  this.modalDialog.open(EditVendorLinkingToItemModalComponent, {
    width: '80%',
    minHeight: '44vh',
    data: rowData

    }).afterClosed().subscribe((event) => {
      if (event.type === 'linked') {
      this.vendorList[index] = Object.assign({}, event['data']);
      }
    });
 }

 unLinkVendor(rowData, index) {
  delete this.vendorList[index]['linkedVendorItemDetails'];
  this.vendorList[index]['isEdit'] = false;
  this.vendorList[index]['isLinked'] = false;
 }

 submitForm() {
   if (this.checkAnyVendorLinkedOrNot()) {
     const finalLinkedVendorList  = [];
     const genericObj =  {
      'category': this.selectedItemData.category,
      'hsn':  this.selectedItemData.hsn ? this.selectedItemData.hsn : (this.selectedItemData.sac ? this.selectedItemData.sac : '') ,
      'item': {'id': this.selectedItemData.id}
     };
     const linkedVendorList =  this.vendorList.filter((ele) => ele.isLinked);
     linkedVendorList.forEach(ele => {
        const vendor_uom  = {
           vendor  : { id: ele.id},
           uom  : {id: ele['linkedVendorItemDetails']['uom']}
        };
        const finalpayLoad = {...ele['linkedVendorItemDetails'], ...genericObj, ...vendor_uom};
        console.log('final payload', finalpayLoad);
        finalLinkedVendorList.push(finalpayLoad);
    });
    this.catService.LinkToVendorWithItem(finalLinkedVendorList).subscribe((res) => {
      if (res['status'] === 'Success') {
        this.toastr.success(res['message'], 'Success');
        this.dialogRef.close({event: 'linked'});
      }
    });
   } else {
     this.toastr.warning('Please Link atleast one vendor with item', 'Warning');
   }
 }

 checkAnyVendorLinkedOrNot() {
    return this.vendorList.some((ele) => ele['isLinked']);
 }
}

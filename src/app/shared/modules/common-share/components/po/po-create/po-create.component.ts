import { Component, Inject, OnInit, Optional } from '@angular/core';
import { NgForm } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { TreeModule } from 'primeng/tree';
import { ClientService } from 'src/app/layout/client/services/client-service.service';
import { AppApiConfig } from 'src/app/shared/constants/app-api.config';
import { EncryDecryService } from 'src/app/shared/services';
import { ConvertToBase64Service } from '../../../services/convert-to-base64.service';
import { PoService } from '../../../services/po.service';
import { PpoViewModalComponent } from '../../ppo-view-modal/ppo-view-modal.component';
import { PO } from './po.model';
import swal from 'sweetalert2';
@Component({
  selector: 'app-po-create',
  templateUrl: './po-create.component.html',
  styleUrls: ['./po-create.component.scss']
})
export class PoCreateComponent implements OnInit {
  pageRecordSize: number;
  pageOptions: number[];
  selectedData: any = [];
  isQuantityValid: boolean;
  attachments: any = [];
  paginatoryDetails: any;
  dynamicFields: any = [];
  poValue = 0;
  poObj: PO = new PO();
  advance: boolean;
  tableHeaders: any = [];
  tableColumnData: any = [];
  prId: any;
  poId: any = null;
  isPOCreate = false;
  ppoId: any;
  poItemsHeaders: any = [
    { field: 'description', header: 'Description', isLink: false, width: '240px' },
    { field: 'brand', header: 'Specification', isLink: false, width: '140px' },
    { field: 'quantity', header: 'Quantity', isLink: false, width: '120px' },
    { field: 'poQuantity', header: 'PO Quantity', isLink: false, width: '140px' },
    { field: 'unitofMeasures', header: 'UOM', isLink: false, width: '100px' },
    { field: 'excludetaxamount', header: 'Basic Amount', isLink: false, width: '140px' },
    { field: 'gstValue', header: 'GST', isLink: false, width: '125px' },
    { field: 'totalamount', header: 'Total Amount', isLink: false, width: '155px' },
];
model :any ={
  advanceAmount: '',

}
  loggedUserDetails: any;
  roleName: any;
  vendorBranches: any[];
  constructor(public dialogRef: MatDialogRef<PpoViewModalComponent>,
    @Optional() @Inject(MAT_DIALOG_DATA) public data,
    private encryDecryService: EncryDecryService,
    private toaster: ToastrService,
    private clientService: ClientService,
    private convertSer: ConvertToBase64Service,
    private modalDialog: MatDialog,
    private poService: PoService) { }

  ngOnInit() {
    this.advance = false;
    this.pageRecordSize = AppApiConfig.GRID_PAGE_INFO.initpageSize;
    this.pageOptions = AppApiConfig.GRID_PAGE_INFO.pageOptions;
    const temp =  JSON.parse(this.encryDecryService.get('perm', localStorage.getItem('logData')) );
    this.loggedUserDetails = temp.details;
    this.roleName = this.loggedUserDetails['role']['roleName'];
    console.log('userDetails', this.loggedUserDetails);
    this.generateFormData();
    this.getVendorsBranches();
  }

  getVendorsBranches() {
    const vendorId = this.data.isPoCreate ? this.data.poItemsData.vendorId : this.data.poData.vendor.id;
    this.poService.getVendorsBranches({id: vendorId }).subscribe( (res) => {
      this.vendorBranches = Array.isArray(res) ? res : [];
    }, err => this.vendorBranches  = [] );
  }
  generateFormData() {
    if (this.data.isPoCreate) {
      this.isPOCreate = true;
      this.prId = this.data.ppoData.prsid;
      this.ppoId = this.data.ppoId;
      this.tableHeaders = this.data.poItemsData.poItemsHeaders || [];
      this.tableColumnData = this.data.poItemsData.lineItemsList || [];
      this.generateDynamicClientFields({id: this.loggedUserDetails.org.id});
    } else {
      console.log('this.poData edit scenario', this.data.poData);
      this.poObj = {...this.data.poData};
      this.poId = this.data.poData.poId;
      this.dynamicFields = [...this.data.poData.dynamicfields];
      this.attachments = [...this.data.poData.documents];
      this.tableHeaders = [...this.poItemsHeaders];
      this.tableColumnData = [...this.data.poData.poitems];
      this.poValue = this.data.poData.poValue;
      this.advance = this.data.poData.advance;
    }



    if (this.tableColumnData && this.tableColumnData.length > 0) {
      this.tableColumnData.forEach(element => {
        element['poQuantity'] = element['quantity'];
      });
    }
    this.getTotalPoAmount(this.tableColumnData);

  }
  resetForm (poForm) {
   this.attachments = [];
   poForm.reset();
  }

  generateDynamicClientFields(vendor) {
    this.poService.getDynamicFieldsByClientId(vendor).subscribe((response) => {
      if (Array.isArray(response)) {
        this.dynamicFields = response || [];
      } else {
        this.dynamicFields =  [];
      }

    });
  }

  onGetPoTotal(rowData) {
    console.log('rowdata', rowData);
    if ( rowData.poQuantity > rowData.quantity) {
      this.isQuantityValid = true;
      this.toaster.warning('Warning', 'PO Quantity should not excess actual Qunatity');
      rowData['isInValid'] = true;
    } else {
      if (rowData.poQuantity < 0) {
        rowData['poQuantity'] = 0;
      }
      rowData['isInValid'] = false;
      this.getTotalPoAmount(this.tableColumnData);
      this.isQuantityValid = false;
    }
  }

  getTotalPoAmount(arrayData) {
    console.log(arrayData, this.poValue);

    this.poValue = 0;
    if (arrayData.length > 0) {
      arrayData.forEach((item) => {
        this.poValue = this.poValue + (item.poQuantity <= 0 ? 0 : ((item.poQuantity * item.excludetaxamount) + Number(item.gstValue)));
        item['totalamount'] = item.poQuantity <= 0 ? 0 : (item.poQuantity * item.excludetaxamount ) + Number(item.gstValue) ;
      });
    } else {
      this.poValue = 0;
    }
  }

  checkValue(eve:any){
    this.poValue = 0;
    if (this.selectedData.length > 0) {
      this.selectedData.forEach((item) => {
        this.poValue = this.poValue + (item.poQuantity <= 0 ? 0 : ((item.poQuantity * item.excludetaxamount) + Number(item.gstValue)));
      });
    }else{
      this.getTotalPoAmount(this.tableColumnData)
    }
  }


  filesDropped(event) {
    const fileData = event;
    console.log('event', event);
    const file = event[0];
    this.convertSer.getBase64(file).then((data: string) => {
      const temp = {
        fileName: file.name,
        file: data.split(',')[1]
      };
      this.attachments.push(temp);
    });

  }

  fileUploadEvent(event, isDropped) {
    const fileData = event;
    console.log('event1', event);
    const file =  event.target.files[0];
    this.convertSer.getBase64(file).then((data: string) => {
      const temp = {
        fileName: file.name,
        file: data.split(',')[1]
      };
      // For Muliple files upload
      this.attachments.push(temp);
    });
  }

  deleteAttachments(index) {
      this.attachments.splice(index, 1);
  }

  generatePo(form: NgForm) {
    if(!this.poValue){
      this.toaster.warning('PO Value should be valid', 'Warning');
      return;
    }
    if (this.selectedData.length <= 0 ) {
      this.toaster.warning('Please select atleast one item', 'Warning');
      return;
    } else {
      const isQuantity = this.selectedData.some((item) => item.poQuantity <= 0);
      if (isQuantity) {
        this.toaster.warning('Please enter PO Quantity for the selected items', 'Warning');
        return;
      }
    }
    if (this.isQuantityValid) {
      this.toaster.warning('PO Quantity should not exceed the actual quantity', 'Warning');
      return;
    }
    if (form.form.invalid) {
      this.toaster.warning('Please enter required fields', 'Warning');
      return;
    }
    const reqObj = this.buildCreatePoJson();
    const poObj = Object.assign({}, this.poObj);
    const finalObj: any  = {...reqObj, ...poObj};
    finalObj['poValue'] = this.poValue
     console.log('final Obj', finalObj);
     swal({
      title: `<h4>Are you sure?</h4>`,
      html: `<h5>You want to generate PO with below details</h5><h5>Selected ${this.selectedData.length} item(s) and PO Amount is Rs. ${this.poValue} <h5>`,
      type: 'warning',
      confirmButtonText: 'Yes',
      confirmButtonColor: '#006dd5',
      cancelButtonColor: '#d63636',
      showCancelButton: true,
      reverseButtons: true,
  }).then((result) => {
      if (result.value) {
          this.poService.createPO(finalObj).subscribe((response) => {
            if (response['status'] === 'Success') {
              this.toaster.success('PO Generated Successfully', 'Success');
              this.dialogRef.close({event: 'close'});
            } else {
              this.toaster.error(response['errorMessage'], 'Failed');
            }

          });
      }
  });

  }

  updatePo(form: NgForm) {
    if (this.tableColumnData.length <= 0 ) {
      this.toaster.warning('No items available for PO', 'Warning');
      return;
    } else {
      const isQuantity = this.tableColumnData.some((item) => item.poQuantity <= 0);
      if (isQuantity) {
        this.toaster.warning('Please enter PO Quantity for the selected items', 'Warning');
        return;
      }
      if (this.isQuantityValid) {
        this.toaster.warning('PO Quantity should not exceed the actual quantity', 'Warning');
        return;
      }
      if (form.form.invalid) {
        this.toaster.warning('Please enter required fields', 'Warning');
        return;
      }

      const finalObj = {...this.poObj};
        finalObj['advance'] = this.advance;
        this.advance ? finalObj['advanceAmount'] =  null : '';
        finalObj['poitems'] =  this.tableColumnData;
        finalObj['dynamicfields'] = this.dynamicFields;
        finalObj['documents'] = this.attachments;
        finalObj['poValue'] = this.poValue;
        this.poService.updatePO(finalObj).subscribe((response) => {
          this.toaster.success('PO Generated Successfully', 'Success');
          this.dialogRef.close({event: 'close'});
        });
      }

  }

  buildCreatePoJson() {
    let finalPoValue = 0;
    const finalItems = [];
    this.selectedData.forEach((item) => {
      item['ppoitemId'] = item['id'];
      delete item['id'];
      item['ppoQuantity'] = item['quantity'];
      item['quantity'] = item['poQuantity'];
      finalPoValue =  finalPoValue + (item.poQuantity <= 0 ? 0 : ((item.poQuantity * item.unitprice) + Number(item.gstValue)));
      if (item['quantity'] > 0) {
        finalItems.push(item);
      }
    });



    this.dynamicFields.forEach(element => {
      const id = element['id'];
     element['clientdynamicfield'] = {
        'id': id
      };
      delete element['id'];
    });
    return {
      'poValue': finalPoValue,
      'pr': {
        'id': this.prId
      },
      'client': {'id': localStorage.getItem('orgId')},
      'vendor': {'id': this.data.poItemsData.vendorId},
      'clientInitiator': localStorage.getItem('loggedId'),
      'ppo': {
        'id': this.data.ppoData.id
      },
      'poitems': this.selectedData,
      'dynamicfields': this.dynamicFields,
      'documents': this.attachments,
      'advance': this.advance
    };
  }

}

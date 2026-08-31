import { Component, Inject, OnInit, Optional } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { PoService } from 'src/app/shared/modules/common-share/services/po.service';
import { EncryDecryService } from 'src/app/shared/services';
import { ViewPosComponent } from '../view-pos/view-pos.component';

@Component({
  selector: 'app-po-create-asn',
  templateUrl: './po-create-asn.component.html',
  styleUrls: ['./po-create-asn.component.scss']
})
export class PoCreateAsnComponent implements OnInit {
  itemsData: any[];
  itemsHeaderData = [
    { field: 'description', header: 'Description', isLink: false, width: '300px' , isEditableCell: false},
    { field: 'brand', header: 'Specification', isLink: false, width: '100px' , isEditableCell: false },
    { field: 'poQuantity', header: 'PO Quantity', isLink: false, width: '100px' , isEditableCell: true },
    { field: 'quantity', header: 'Scheduled Quantity', isLink: false, width: '100px' , isEditableCell: false },
    { field: 'deliveryQuantity', header: 'ASN Quantity', isLink: false, width: '100px' , isEditableCell: true },
    { field: 'unitofMeasures', header: 'UOM', isLink: false, width: '100px' , isEditableCell: false },
    { field: 'excludetaxamount', header: 'Basic Amount', isLink: false, width: '80px' , isEditableCell: false },
    { field: 'gstValue', header: 'GST Value', isLink: false, width: '125px' , isEditableCell: false }
  ];
  deliveryItemsData: any;
  asnForm: any;
  minDate: Date;
  attachments: any;
  submitted: boolean;
  ivalidQuntyForSomeCell: boolean;
  loggedUserType: any;
  loggedUserDetails: any;

  constructor(public dialogRef: MatDialogRef<ViewPosComponent>,
    @Optional() @Inject(MAT_DIALOG_DATA) public data,
    private encryDecryService: EncryDecryService,
    private toaster: ToastrService,
    private modalDialog: MatDialog,
    private  poService: PoService,
    private formBuilder: FormBuilder) { }

  ngOnInit() {
    console.log('data asn', this.data);
    this.minDate = new Date();
    const temp =  JSON.parse(this.encryDecryService.get(localStorage.getItem('logData')) );
    console.log('lgo', temp.details);
    this.loggedUserType = temp.details.role.roleName;
    this.loggedUserDetails = temp.details;
    this.getDeliveryItems();
    this.createASNForm();
  }

  createASNForm() {
    this.asnForm = this.formBuilder.group({
      asndesc: ['', Validators.required],
      transportMode: ['', Validators.required],
      dispatchDate: ['', Validators.required],
      expectedDate: ['', Validators.required],
      cargoDetails: ['', Validators.required],
      trasportPhone: ['', Validators.required]
    });
  }
  get f() { return this.asnForm.controls; }

  getDeliveryItems() {
    this.deliveryItemsData = null;
    this.poService.getItemsByDeliveryId({id: this.data.deliveryData.id}).subscribe((res) => {
      if (Array.isArray(res)) {
        this.itemsData = res;
        this.itemsData.forEach(element => {
          element['deliveryQuantity'] = element['quantity'];
          element['isInvalid'] = false;
          element['isEmpty'] = false;
        });
        const actionEvents = [];
        this.deliveryItemsData = {
          actionEvents: [...actionEvents],
          gridTopButtonActions  : [],
          gridColumnData: this.itemsData,
          gridHeaders: [...this.itemsHeaderData],
          gridTitle: '',
          displayParentLabel: 'Delivery ID - ',
          displayParentId: this.data.deliveryData.deliveryId,
          editableCells : ['deliveryQuantity'],
          rowEventClickEventName: '',
          gridSelectionCheckbox: {
            showSelction: false,
            allowMultipleSelection: false
          }
        };
      }
    });

  }

  onClickCommonGrid(event) {
    this[event.eventName](event.rowData, event.rowIndex);
  }

  cellEditEvent(rowData, rowIndex) {
    this.ivalidQuntyForSomeCell = false;
    if (rowData['deliveryQuantity'] > rowData['poQuantity']) {
      rowData['deliveryQuantity'] = rowData['poQuantity'];
      // rowData['isInvalid'] = true;
      // this.ivalidQuntyForSomeCell = true;
    } else {
      if (rowData['deliveryQuantity'] <= 0) {
        rowData['deliveryQuantity'] = 0;
      }
    }
    console.log('edit event', rowData);
  }

  getAttachedDocsList(event) {
    console.log('event from attachment', event);
    this.attachments = event['attachments'];
  }

  resetForm() {
    this.asnForm.reset();
    this.attachments = [];
  }

  onSubmit() {
    this.submitted = true;
    let checkAllProductQtyisZero = false;
    if (this.ivalidQuntyForSomeCell) {
      this.toaster.warning('Please check the Delivery Quantity exceed actual Quantity', 'Warning');
      return;
    }
   checkAllProductQtyisZero =  this.deliveryItemsData.gridColumnData.every(element => element['deliveryQuantity'] === 0 );
   if (checkAllProductQtyisZero) {
      this.toaster.warning('Please enter ASN Quantity  for at least  one product', 'Warning');
      return;
   }
    if (this.asnForm.invalid) {
      this.toaster.warning('Please fill all required fields', 'Warning');
        return;
    } else {
      const reqObj = this.asnForm.getRawValue();
      console.log('obj', reqObj);
      this.deliveryItemsData.gridColumnData.forEach((item) => {
        item['deliveryitemId'] = this.data.deliveryData.id;
        const deliveryQuantity =  item['quantity'];
        item['quantity'] = item['deliveryQuantity'];
        item['deliveryQuantity'] = deliveryQuantity;
        delete item['id'];
      });
      const finalDeliveryItems =  this.deliveryItemsData.gridColumnData.filter((item) => item.quantity > 0 );
      const genericObj = {
          'vendor': {
            'id': this.loggedUserDetails.org.id
          },
         'po': this.data.poData.id,
         'client': this.data.poData.clientId,
        'delivery': {
          'id': this.data.deliveryData.id
        },
        documents:  this.attachments,
        asnItems: finalDeliveryItems
      };
      const finalObj = {...reqObj, ...genericObj};
      console.log('finalObj', finalObj);


      this.poService.createASN(finalObj).subscribe((response) => {
        if (response['status'] === 'Success') {
          this.toaster.success(response['message'], 'Success');
          this.dialogRef.close({event: 'close'});
        } else {
          this.toaster.success(response['message'], 'Failed');
        }
      });
    }
  }

}

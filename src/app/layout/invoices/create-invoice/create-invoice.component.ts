import { Component, Inject, OnInit, Optional, ViewChild } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { PoService } from 'src/app/shared/modules/common-share/services/po.service';
import { EncryDecryService } from 'src/app/shared/services';
import { ViewPosComponent } from '../../pos/view-pos/view-pos.component';
import { InvoicesService } from '../invoices.service';

@Component({
  selector: 'app-create-invoice',
  templateUrl: './create-invoice.component.html',
  styleUrls: ['./create-invoice.component.scss']
})
export class CreateInvoiceComponent implements OnInit {
  @ViewChild('addAddtionalItemsModal') addAddtionalItemsModal;
  invoiceForm: any;
  submitted: boolean;
  totalAmount = 0;
  attachments: any = [];
  itemsData: any[] = [];
  deliveryItemsData: {};
  additionalItemsList = [];
  itemsHeaderData: any = [];
  loggedUserType: any;
  loggedUserDetails: any;
  additionalItemsFieldsRowData = [];
  additonItemsRowData =  {
    description: '',
    brand: '',
    category: '',
    unitofMeasures: '',
    vendorPrice: '',
    itemcode: '',
    quantity: 0,
    id: 0,
  };

  additonalItemsHeadersData: any = null;
  isAdd: boolean;
  dialogRef1: MatDialogRef<any>;
  constructor(public dialogRef: MatDialogRef<ViewPosComponent>,
    @Optional() @Inject(MAT_DIALOG_DATA) public data,
    private encryDecryService: EncryDecryService,
    private toaster: ToastrService,
    private modalDialog: MatDialog,
    private modalDialog1: MatDialog,
    private  invoiceService: InvoicesService,
    private formBuilder: FormBuilder) { }

  ngOnInit() {
    const temp =  JSON.parse(this.encryDecryService.get('perm', localStorage.getItem('logData')) );
    this.loggedUserType = temp.details.role.roleName;
    this.loggedUserDetails = temp.details;
    this.getASNItems();
    this.additionalItemsFieldsRowData.push(this.additonItemsRowData);


    this.itemsHeaderData = [
      { field: 'description', header: 'Description', isLink: false, width: '300px' , isEditableCell: false},
      { field: 'brand', header: 'Specification', isLink: false, width: '100px' , isEditableCell: false },
      { field: 'quantity', header: 'Quantity', isLink: false, width: '100px' , isEditableCell: false },
      { field: 'invoiceQuantity', header: 'Invoice Quantity', isLink: false, width: '100px' , isEditableCell: true },
      { field: 'unitofMeasures', header: 'UOM', isLink: false, width: '100px' , isEditableCell: false },
      { field: 'unitprice', header: 'Unit Price', isLink: false, width: '80px' , isEditableCell: false },
      { field: 'gstValue', header: 'GST Value', isLink: false, width: '125px' , isEditableCell: false },
      { field: 'totalamount', header: 'Total Amount', isLink: false, width: '125px' , isEditableCell: false }

    ];
    this.createInvoiceForm();

    this.additonalItemsHeadersData = {
      actionEvents: [{
        name: 'Edit',
        className: 'fa fa-pencil',
        eventName: 'editAdditionalItemData',
        iconType: 'regular'
      },
    {
      name: 'Delete Item',
      className: 'fa fa-trash',
      eventName: 'deleteItem',
      iconType: 'regular'
    }],
      gridTopButtonActions  : [],
      gridColumnData:  [],
      gridHeaders: [
        { field: 'description', header: 'Description', isLink: false, width: '300px' , isEditableCell: false},
        { field: 'brand', header: 'Specification', isLink: false, width: '100px' , isEditableCell: false },
        { field: 'category', header: 'Category', isLink: false, width: '100px' , isEditableCell: false },
        { field: 'itemcode', header: 'Invoice Quantity', isLink: false, width: '100px' , isEditableCell: true },
        { field: 'unitofMeasures', header: 'UOM', isLink: false, width: '100px' , isEditableCell: false },
        { field: 'vendorPrice', header: 'Price', isLink: false, width: '80px' , isEditableCell: false },
        { field: 'quantity', header: 'Quantity', isLink: false, width: '80px' , isEditableCell: false },
      ],
      gridTitle: '',
      displayParentLabel: '',
      displayParentId: '',
      rowEventClickEventName: '',
      editableCells : [],
      gridSelectionCheckbox: {
        showSelction: true,
        allowMultipleSelection: false
      }

    };
  }

  createInvoiceForm() {
    this.totalAmount = 0;
    this.submitted = false;
    this.invoiceForm = this.formBuilder.group({
      invoiceDesc: ['', Validators.required],
      remarks: ['', Validators.required]
    });
  }
  get f() { return this.invoiceForm.controls; }

  resetForm() {
    this.invoiceForm.reset();
    this.attachments = [];
  }
  openAdditonalItemsModal(openAdditonalItemsModal) {
    this.isAdd = true;
   this.dialogRef1 = this.modalDialog1.open(openAdditonalItemsModal, {
      width: '80%',
      minHeight: '400px',
      data: this.additionalItemsList
    });
  }
  onSubmit() {
    this.submitted = true;

    if (this.deliveryItemsData['gridColumnData'].length === 0 ) {
      this.toaster.warning(`Without Items, Invoice can't be create`, 'Warning');
      return;
    }
    const  checkIsAllItemsQuantityisZero = this.deliveryItemsData['gridColumnData'].every(element => element['invoiceQuantity'] <= 0);
    if (checkIsAllItemsQuantityisZero) {
      this.toaster.warning('Atleast One Product/Item should have Invoice Quantity', 'Warning');
      return;
    }
    if (this.invoiceForm.invalid) {
      this.toaster.warning('Please fill all required fields', 'Warning');
      return;
    } else {
      const finalItemsData = [];
      this.deliveryItemsData['gridColumnData'].forEach((item) => {
        item['asnitemId'] = item['id'];
        item['asnQuantity'] = item['quantity'];
        item['quantity'] = item['invoiceQuantity'];
        delete item['id'];
        if (item['quantity'] > 0) {
        finalItemsData.push(item);
        }
      });

      this.additionalItemsList.forEach(element => {
        delete element['id'];
      });
      const coreObj = {
        'invoiceAmount': this.totalAmount,
        'vendor': {
          'id': this.loggedUserDetails.org.id
        },
        'client':   this.data.poData.clientId,
        'po': this.data.poData.id,
        'asn': {
          'id': this.data.asnData.id
        },
        'invoiceItems': [...finalItemsData],
        'documents': this.attachments,
        'additionalItems': [...this.additionalItemsList]
      };
      const finalObj = {...coreObj, ...this.invoiceForm.getRawValue()};
      this.invoiceService.createInvoice(finalObj).subscribe((res) => {
        if (res['status'] === 'Success') {
          this.toaster.success(res['message'], 'Success');
          this.dialogRef.close({event: 'close'});
        } else {
          this.toaster.error(res['message'], 'Failure');
        }
      });

    }
  }
  getASNItems() {
    this.deliveryItemsData = null;
    this.invoiceService.getItemsByASNId({id: this.data.asnData.id}).subscribe((res) => {
      if (Array.isArray(res)) {
        this.totalAmount = 0;
        this.itemsData = res || [];
        this.itemsData.forEach(element => {
          element['invoiceQuantity'] = element['quantity'];
          element['isInvalid'] = false;
          element['isEmpty'] = false;
          element['totalamount'] = 0;

          element['totalamount'] =  element['invoiceQuantity'] <= 0 ? 0 : element['totalamount'] + ((element['unitprice'] * element['invoiceQuantity']) + Number( element['gstValue']));
          this.totalAmount = this.totalAmount + element['totalamount'];
        });
        const actionEvents = [];
        this.deliveryItemsData = {
          actionEvents: [...actionEvents],
          gridTopButtonActions  : [],
          gridColumnData: this.itemsData,
          gridHeaders: [...this.itemsHeaderData],
          gridTitle: '',
          displayParentLabel: '',
          displayParentId: this.data.asnData.asnId,
          editableCells : ['invoiceQuantity'],
          rowEventClickEventName: '',
          gridSelectionCheckbox: {
            showSelction: false,
            allowMultipleSelection: false
          }
        };
      }
    });


    console.log('delivary items data==============> ' + JSON.stringify(this.data));
    console.log(this.deliveryItemsData);

  }


  getAttachedDocsList(event) {
    console.log('event from attachment', event);
    this.attachments = event['attachedDocuments'];
  }

  onClickCommonGrid(event) {
    console.log('event', event);
    this[event.eventName](event.rowData, event.rowIndex);
  }

  cellEditEvent(rowData, rowIndex) {
    rowData['totalamount'] = 0;
    if ((rowData.invoiceQuantity > rowData.quantity)) {
      rowData['invoiceQuantity'] = rowData['quantity'];
      rowData['isInvalid'] = true;
    } else {
      rowData['totalamount'] = 0;
      if (rowData.invoiceQuantity <= 0) {
        rowData['invoiceQuantity'] = 0;
      }
    }
    rowData['totalamount'] =  rowData['invoiceQuantity'] <= 0 ? 0 : rowData['totalamount'] + ((rowData['unitprice'] * rowData['invoiceQuantity']) + Number( rowData['gstValue']));
    this.getInvoiceTotal();
  }

  getInvoiceTotal() {
    this.totalAmount = 0;
    this.deliveryItemsData['gridColumnData'].forEach((element) => {
      this.totalAmount = this.totalAmount + (element.totalamount);
    });
  }

  additem(rowData, isAdd) {
    if (Object.keys(this.additonItemsRowData).some(ele => this.additonItemsRowData[ele] == null || this.additonItemsRowData[ele] === '')) {
      this.toaster.warning('Please fill the all Fields', 'Warning');
      return;
    }
    if (!isAdd) {
     const index = this.additionalItemsList.findIndex((item) => item.id === this.additonItemsRowData['id']);
     this.additionalItemsList[index] = Object.assign({}, this.additonItemsRowData);
     this.resetChildGridData();
     this.additonItemsRowData  = {
      description: '',
      brand: '',
      category: '',
      unitofMeasures: '',
      vendorPrice: '',
      itemcode: '',
      quantity: 0,
      id: 0
     };
    } else {
      this.additonItemsRowData['id'] = (Math.random() * 10000);
      this.additionalItemsList.push(this.additonItemsRowData);
      this.resetChildGridData();
      this.additonItemsRowData  = {
        description: '',
        brand: '',
        category: '',
        unitofMeasures: '',
        vendorPrice: '',
        itemcode: '',
        quantity: 0,
        id: 0
       };
    }
    console.log('rowData', rowData);
    console.log('lis', this.additionalItemsList);

  }

  deleteItem(event) {
    const index = this.additionalItemsList.findIndex((item) => item.id === event['id']);
    this.additionalItemsList.splice(index, 1);
    this.resetChildGridData();
  }

  editAdditionalItemData(rowData) {
    this.isAdd = false;
    this.additonItemsRowData =  Object.assign({}, rowData);
  }

  resetChildGridData() {
    this.additonalItemsHeadersData.gridColumnData  = [];
    setTimeout(() => {
      this.additonalItemsHeadersData.gridColumnData   = [...this.additionalItemsList];
      this.isAdd = true;
    }, 50);

  }

  closeItemModal() {
    this.dialogRef1.close({});
  }

}

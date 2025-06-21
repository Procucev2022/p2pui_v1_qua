import { ChangeDetectorRef, Component, Inject, OnInit, Optional, SimpleChanges } from '@angular/core';
import { FormGroup, FormControl, Validators, FormArray, FormBuilder } from '@angular/forms';
import { MatDialogRef, MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { PoService } from 'src/app/shared/modules/common-share/services/po.service';
import { EncryDecryService } from 'src/app/shared/services';
import { ClientService } from '../../client/services/client-service.service';

@Component({
  selector: 'app-accept-pos',
  templateUrl: './accept-pos.component.html',
  styleUrls: ['./accept-pos.component.scss']
})
export class AcceptPosComponent implements OnInit {
  poData: any;
  deliveryForm: any;
  deliveryTypes: any = [
    {name: 'Single Delivery', type: 'single'},
    {name: 'Multiple Deliveries', type: 'multiple'}
  ];
  public deliveryData = [];
  tableData = [];
  minDate = new Date();
  selectedData = [];
  tableArrayData = [];
  poItemsHeaders: any = [
    { field: 'description', header: 'Description', isLink: false, width: '300px' },
    { field: 'brand', header: 'Specification', isLink: false, width: '100px' },
    { field: 'quantity', header: 'PO Quantity', isLink: false, width: '100px' },
    { field: 'deliveryQuantity', header: 'Delivery Quantity', isLink: false, width: '100px' },
    { field: 'unitofMeasures', header: 'UOM', isLink: false, width: '100px' },
    { field: 'excludetaxamount', header: 'Basic Amount', isLink: false, width: '80px' },
    { field: 'gstValue', header: 'GST Value', isLink: false, width: '125px' },
    // { field: 'totalamount', header: 'Total Amount', isLink: false, width: '155px' }
];
  deliveryTotal: number;
  isQuantityValid: boolean;
  deliveryTotalMessage = [
    {isValid: false, message: 'Please check quantity for the delivery items quantity'}
  ];
  isDataLoaded: boolean;
  deliveryMode: any;
  isDeliveryDateEmpty: boolean;
  loggedUserDetails: any;
  constructor(public dialogRef: MatDialogRef<AcceptPosComponent>,
    @Optional() @Inject(MAT_DIALOG_DATA) public data,
    private encryDecryService: EncryDecryService,
    private toaster: ToastrService,
    private modalDialog: MatDialog,
    private fb: FormBuilder,
    private cdr: ChangeDetectorRef,
    private poService: PoService) { }

  ngOnInit() {
    const temp = JSON.parse(
      this.encryDecryService.get('perm', localStorage.getItem('logData'))
  );
  this.loggedUserDetails = temp.details;
    this.poData = this.data ;
    this.data.poitems.forEach((item) => {
      item['deliveryQuantity'] = item['quantity'];
      item['totalDeliveryAmount'] = 0;
      item['isDeliveryQtyEmpty'] = false;
      item['isInValid'] = false;
    });
    this.deliveryMode = 'single';
    this.tableData = this.data.poitems.slice(0);

    this.addOneMoreDelivery(true);
    console.log('data acceptPO data', this.data);
     console.log('form', this.tableArrayData);
  }

  onSubmit(deliveryForm) {
    if (deliveryForm.form.invalid) {
      this.toaster.warning('Please enter required fields', 'Warning');
      return;
    }
    if (this.checkIsNotValidDate()) {
      this.toaster.warning('Delivery Date  should not be empty!', 'Warning');
      return;
    }
    if (this.checkIsNotValidDeliveryQty()) {
      this.toaster.warning('Delivery Quantity  should not be empty!', 'Warning');
      return;
    }
    if ( this.checkIsQuantityExceed()) {
      this.toaster.warning('Delivery Quantity should not exceed Quantity', 'Warning');
      return;
    }
    this.buildJSON();
  }
  buildJSON() {
    const isSingleDelivery = this.deliveryMode === 'single' ? true : false;
    this.deliveryData.forEach((element, index) => {
      element['single'] = isSingleDelivery;
      element['multiple'] = !isSingleDelivery;
      element['po'] = {
        'id': this.poData.id
     },
     element['client'] = this.data.client.id;
     element['newCommentAvailableProcucev'] = true;
     element['newCommentAvailableClient'] = true;
     element['newCommentAvailableVendor'] = false;
     element['vendor'] = {
       'id': this.loggedUserDetails.org.id
     };
      const deliveryItems = [];
      element.itemsData_.forEach(ele => {
        ele['poQuantity'] = ele['quantity'];
        ele['quantity'] = ele['deliveryQuantity'];
        Number(ele['deliveryQuantity']);
        delete ele['totalDeliveryAmount'];
        delete ele['isDeliveryQtyEmpty'];
        delete ele['isInValid'];
        ele['poitemId'] = ele['id'];
        delete ele['id'];
        if (ele['quantity'] > 0) {
          deliveryItems.push(ele);
        }
      });
     element['deliveryItems'] = [...deliveryItems];
    delete element['itemsData_'];
    });
    const obj = [...this.deliveryData];
    console.log('obj', obj);
    this.poService.acceptPoOrCreateDeliveryHeader(obj).subscribe((response) => {
      if (response['status'] === 'Success') {
        this.toaster.success(response['message'], 'Success');
        this.dialogRef.close({event: 'close'});
      } else {
        this.toaster.error(response['message'], 'Failed');
      }
    });
  }

  checkIsNotValidDate() {
    let isInValid = false;
    isInValid =   this.deliveryData.some((item) => (item.deliveryDate == null || !item.deliveryDate));
    return isInValid;
  }

  checkIsNotValidDeliveryQty() {
    let isInvalidQty = false;
    isInvalidQty =   this.deliveryData.some((item) =>
      item.itemsData_.every((item_) => item_.deliveryQuantity <= 0));
      console.log('isInvalidQty', isInvalidQty);
      return isInvalidQty;
  }

  checkIsQuantityExceed() {
    let isInvalidQty = false;
    isInvalidQty =   this.deliveryData.some((item) =>
      item.itemsData_.some((item_) => item_.isInValid));
      return isInvalidQty;
  }
  addOneMoreDelivery(isFirstRecord) {
      const index = isFirstRecord ? 0 : this.deliveryData.length;
      this.isDeliveryDateEmpty = false;
      if (isFirstRecord) {
        this.deliveryData = [];
        this.isDataLoaded = false;
        this.deliveryData.push({
          deliveryDate: null,
            remarks: null,
            itemsData_ : [...this.tableData]
        });
        console.log(' this.deliveryData', this.deliveryData);
        this.getTotalPoAmount(this.deliveryData[index]['itemsData_'], index);
      } else {
        if (this.checkIsNotValidDate()) {
          this.toaster.warning('Delivery Date should not be empty!', 'Warning');
          return;
        } else if (this.checkIsNotValidDeliveryQty()) {
          this.toaster.warning('Delivery Quantity should not be empty!', 'Warning');
          return;
        } else if (this.checkIsQuantityExceed()) {
          this.toaster.warning('Delivery Quantity should not exceed quantity!', 'Warning');
          return;
        } else {

          // getting previous values
          const previousIndexData = this.deliveryData[index - 1];
          const previousIndexItems = previousIndexData['itemsData_'];
          const nextItems = [];
          for (let i = 0; i < previousIndexItems.length; i++) {
            const diff = previousIndexItems[i].quantity - previousIndexItems[i].deliveryQuantity;
            console.log('previous quantity ' + previousIndexItems[i].quantity );
            console.log('previous delivary quantity ' + previousIndexItems[i].deliveryQuantity);
            if (diff === 0) {
              // ignore that item
            } else {
              const currentItem = JSON.parse(JSON.stringify(previousIndexItems[i]));
              delete currentItem.quantity;
              currentItem['quantity'] = diff;
              delete currentItem.deliveryQuantity;
              currentItem['deliveryQuantity'] = diff;
              nextItems.push(currentItem);
            }
          }
          this.isDataLoaded = false;
          this.deliveryData = this.deliveryData.filter((item) => item);

          if(nextItems.length === 0) {
            this.toaster.warning('All items are selected', 'Warning');
            return;
          }
          this.deliveryData.push({
            deliveryDate: null,
              remarks: null,
              itemsData_ : [...nextItems]
          });
          console.log(this.deliveryData);
        this.getTotalPoAmount(this.deliveryData[index]['itemsData_'], index);
        }

      }
  }

  customTB(item, index) {
    return `${item.id}-${index}`;
  }

  deliveryTypeChange(dType) {
    this.deliveryMode = dType;
    if (this.deliveryMode === 'single') {
      this.addOneMoreDelivery(true);
    }
  }

  removeDeliveryItem(index, tabData) {
    // this.deliveryData.splice(index, 1);
    // this.deliveryData = [...this.deliveryData.splice(index, 1)];
    console.log('ddata', this.deliveryData);
    const deliveryData = this.deliveryData.filter((item, i) => index !== i);
    this.deliveryData = [...deliveryData];
    console.log('this.deilverdata', this.deliveryData);
  }


  onGetPoTotal(event, rowData, tableIndex, rowIndex) {

    const obj1: any = {'deliveryQuantity': event.target.value};
    const obj2: any = {...this.deliveryData[tableIndex]['itemsData_'][rowIndex]};
    delete obj2['deliveryQuantity'];
    this.deliveryData[tableIndex]['itemsData_'][rowIndex] = {...obj1, ...obj2};
    if ( this.deliveryData[tableIndex]['itemsData_'][rowIndex]['deliveryQuantity'] > Number(rowData.quantity)) {
      this.deliveryData[tableIndex]['itemsData_' ][rowIndex]['isInValid'] = true;
      this.isQuantityValid = true;
      this.toaster.warning('Warning', 'PO Quantity should not excess actual Qunatity');
    } else {
      if (this.deliveryData[tableIndex]['itemsData_'][rowIndex]['deliveryQuantity'] <= 0) {
        this.deliveryData[tableIndex]['itemsData_'][rowIndex]['isDeliveryQtyEmpty'] = true;
        this.deliveryData[tableIndex]['itemsData_'][rowIndex]['deliveryQuantity'] = 0;
      } else {
        this.deliveryData[tableIndex]['itemsData_'][rowIndex]['isDeliveryQtyEmpty'] = false;
      }
      this.getTotalPoAmount(this.deliveryData[tableIndex]['itemsData_'], tableIndex);
      this.isQuantityValid = false;
      this.deliveryData[tableIndex]['itemsData_'][rowIndex]['isInValid'] = false;
    }
  }

  getTotalPoAmount(arrayData, i) {
    this.deliveryTotal = 0;
    if (arrayData.length > 0) {
      arrayData.forEach((item) => {
        this.deliveryTotal = this.deliveryTotal + (item.deliveryQuantity <= 0 ? 0 : ((item.deliveryQuantity * item.unitprice) + Number(item.gstValue)));
      });
    } else {
      this.deliveryTotal = 0;
    }
    this.deliveryData[i]['itemsData_']['totalDeliveryAmount']  = 0;
    this.deliveryData[i]['itemsData_']['totalDeliveryAmount'] = this.deliveryTotal;
    this.isDataLoaded = true;
  }

  onChangeQty(rowData, index) {
    this.tableArrayData[index][rowData]['deliveryQuantity'] = rowData.deliveryQuantity;
  }


  ngOnChanges(changes: SimpleChanges): void {
    console.log('changes', changes);
    for (const propName in changes) {
      console.log('prop', propName);
    }
    // Called before any other lifecycle hook. Use it to inject dependencies, but avoid any serious work here.
    // Add '${implements OnChanges}' to the class.

  }

}

import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-po-delivery-items',
  templateUrl: './po-delivery-items.component.html',
  styleUrls: ['./po-delivery-items.component.scss']
})
export class PoDeliveryItemsComponent implements OnInit {
  paginatoryDetails: any;
  pageRecordSize: any;
  pageOptions: any;
  selectedData: any;
  @Input('tableData') tableData;
  @Input('tableHeaders') tableHeaders;
  @Input('tableIndex') tableIndex;
  isQuantityValid: boolean;
  toaster: any;
  data: any;
  poTotalAmount: number;
  

  constructor() { }

  ngOnInit() {
    if (this.tableData) {
      let deliveryTotal = 0;
      this.tableData.forEach(element => {
        element['deliveryQuantity'] = element['quantity'];
       deliveryTotal += element['deliveryTotalAmount']+((element['deliveryQuantity']*element['unitprice'])+Number(element['gstValue']))
      });
    }
    console.log('this.tableData',this.tableData);

  }

  onGetPoTotal(rowData) {
    console.log('rowdata', rowData);
    if ( rowData.deliveryQuantity > rowData.quantity) {
      this.isQuantityValid = true;
      this.toaster.warning('Warning', 'PO Quantity should not excess actual Qunatity');
    } else {
      if (rowData.deliveryQuantity < 0) {
        rowData['deliveryQuantity'] = 0;
      }
      this.getTotalPoAmount(this.data.poItemsData.lineItemsList);
      this.isQuantityValid = false;
    }
  }

  getTotalPoAmount(arrayData) {
    this.poTotalAmount = 0;
    if (arrayData.length > 0) {
      arrayData.forEach((item) => {
        this.poTotalAmount = this.poTotalAmount + (item.deliveryQuantity <= 0 ? 0 : ((item.deliveryQuantity * item.unitprice) + Number(item.gstValue)));
      });
    } else {
      this.poTotalAmount = 0;
    }
  }

}

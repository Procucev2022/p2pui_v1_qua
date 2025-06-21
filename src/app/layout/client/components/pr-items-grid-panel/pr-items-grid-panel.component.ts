import { Component, OnInit, Output, ViewChild, EventEmitter, Input } from '@angular/core';
import { CategoryService } from '../../../category/services/category.service';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ConvertToBase64Service } from '../../../../shared/modules/common-share/services/convert-to-base64.service';
import { CreatePrModelService } from '../../services/create-pr-model.service';
import { Table } from 'primeng/table';
import { startWith, pairwise, take } from 'rxjs/operators';
import { pipe } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ClientService } from '../../services/client-service.service';
import { trigger, state, style, transition, animate } from '@angular/animations';

@Component({
  selector: 'app-pr-items-grid-panel',
  templateUrl: './pr-items-grid-panel.component.html',
  styleUrls: ['./pr-items-grid-panel.component.scss'],
  animations: [
    trigger('rowExpansionTrigger', [
        state('void', style({
            transform: 'translateX(-10%)',
            opacity: 0
        })),
        state('active', style({
            transform: 'translateX(0)',
            opacity: 1
        })),
        transition('* <=> *', animate('400ms cubic-bezier(0.86, 0, 0.07, 1)'))
    ])
]
})
export class PrItemsGridPanelComponent implements OnInit {

  @ViewChild('addItemToPRModal') addItemToPRModal;
  @ViewChild('bulkUploadPRModal') bulkUploadPRModal;
  @ViewChild('linkedItemListGrid') linkedItemListGrid: Table;
  @Input('prItemsFromInvoice') prItemsFromInvoice;
  @Input('createPRformList') createPRformList;
  @Input('isActions')isActions: boolean = false;
  @Output() updatedPrList = new EventEmitter();
  estimatedPRValueForLinkedItems = 0;
  estimatedPRValueForNonLinkedItems = 0;
  nonItemForm: FormGroup;
  BOQDocument: any;
  BOQDocToBase64: any = [];
  public additemModalRef: MatDialogRef<any>;
  showLinkedItemsPanel: boolean;
  onlyLinkedItems: boolean;
  nonLinkPrValue = true;
  addItemPrValues: any;
  estimatedPRValue: any;
  estimatedPrEnableDisable = true;
  section: string;
  selectedItemId: any;
  selectedSubCategory: any = '';
  dropDownConfig = {
    search: true,
    placeholder: 'Select',
    searchPlaceholder: 'Search',
    height: 'auto',
    displayKey: 'subCategoryName'
  };
  cache_linkedItemList: any[];
  constructor(private catService: CategoryService, private clientService: ClientService,
    private modalDialog: MatDialog, private toastr: ToastrService,
    private convertSer: ConvertToBase64Service, private prModalService: CreatePrModelService) { }

    filtered_subCategoryList = [];

  paginatoryDetails: any;
  linkedVendorList = [];
  linkedVendorHeaders = [
    { field: 'vendorName',  header: 'Vendor Name',  isLink: false, width: '220px', fieldType: 'text' },
    { field: 'companyId',  header: 'Vendor Id',  isLink: false, width: '200px', fieldType: 'text' },
    { field: 'subCategory',  header: 'Sub Category',  isLink: false, width: '120px', fieldType: 'text' },
    { field: 'city',  header: 'City',  isLink: false, width: '120px', fieldType: 'text' },

  ];
  selectedLinkedVendorData = [];

  linkedItemHeaders = [
    { field: 'description', header: 'Item Description', isLink: false,  width: '150px',  fieldType: 'text'},
    { field: 'clientItemCode', header: 'Item Code', isLink: false,  width: '150px',  fieldType: 'text'},
    { field: 'specification', header: 'Specification', isLink: false,  width: '130px',  fieldType: 'text'},
    { field: 'createdTS', header: 'Price', isLink: false,  width: '130px',  fieldType: 'img'},
  ];
  linkedItemList = [];
  selectedLinkedItemData: any[] = [];

  itemListByVendorId = [];
  itemHeadersByVendorId = [
    { field: 'description', header: 'Item Description', isLink: false,  width: '255px',  fieldType: 'text'},
    { field: 'vendorItemCode', header: 'Item Code', isLink: false,  width: '150px',  fieldType: 'text'},
    { field: 'uom', header: 'UOM', isLink: false,  width: '130px',  fieldType: 'text'},
    { field: 'pricePerUnit', header: 'Price', isLink: false,  width: '130px',  fieldType: 'text'}
  ];
  selectedItemDataByVendorId = [];

  linkedVendorListByItem = [];
  linkedVendorHeadersByItem = [
    { field: 'vendorName',  header: 'Vendor Name',  isLink: false, width: '220px', fieldType: 'text' },
    // { field: 'companyId',  header: 'Vendor Id',  isLink: false, width: '200px', fieldType: 'text' },
    { field: 'city',  header: 'City',  isLink: false, width: '120px', fieldType: 'text' },
    { field: 'rank', header: 'Rank', isLink: false,  width: '120px',  fieldType: 'text'},
    { field: 'uom', header: 'UOM', isLink: false,  width: '130px',  fieldType: 'text'},
    { field: 'pricePerUnit',  header: 'Price Per Unit',  isLink: false, width: '120px', fieldType: 'text' }
  ];
  selectedLinkedVendorDataByItem = [];

  prItemHeaders = [
    { field: 'description', header: 'Item Description', isLink: false,  width: '150px',  fieldType: 'text'},
    { field: 'specification', header: 'Specification', isLink: false,  width: '100px',  fieldType: 'text'},
    { field: 'uom', header: 'UOM', isLink: false,  width: '100px',  fieldType: 'text'},
    { field: 'quantity', header: 'Quantity', isLink: false,  width: '100px',  fieldType: 'text'}

  ];
  prItemList = [];
  selectedPrItemData = [];

  addItemHeaders = [
    { field: 'description', header: 'Item Description', isLink: true,  width: '150px',  fieldType: 'text'},
    // { field: 'uom', header: 'UOM', isLink: false,  width: '130px',  fieldType: 'text'},
    { field: 'quantity', header: 'Quantity', isLink: false,  width: '130px',  fieldType: 'text'},
  ];
  addItemList = [];
  expandedRows: {} = {};

  getSubCategoryList() {
    this.clientService.getSubCategoryList({id: localStorage.getItem('orgId')}).subscribe((res: any) => {
      if (Array.isArray(res)) {
        this.filtered_subCategoryList = res || [];
      }
    });
  }
  onSubCategoryChange(eve: any) {
    if (eve) {
      this.linkedItemList = this.cache_linkedItemList.filter(ele => ele.subCategoryId === eve.subCategoryId);
    } else {
      this.linkedItemList = this.cache_linkedItemList;
      this.selectedSubCategory = '';
    }

    console.log('tesx', eve);
  }



  ngOnInit() {
    this.getSubCategoryList();
    this.getLinkedItemsByClient();
    this.getLinkedVendorsByClient();
    this.createNonItemForm();

    this.clientService.prDataInfo$.subscribe((res) => {
      console.log(res);
      if (res) {
        if(Array.isArray(res.pritems)){
          this.prItemList =   res.pritems.map((ele:any)=> {return {...ele, ...{'specification': ele.brand, 'uom': ele.unitofMeasures}}})
        }
        // this.prItemList =   res.pritems
        this.getEstimatedPRValueForNonLinkedItem();
        this.getEstimatedPRValue();
        // this.estimatedPRValue = res.estimatedPrvalue
        // let sum = 0
        // res.prItems.filter((data) => {
        //   sum += data.quantity * parseInt(data.vendorPrice)
        // })
        // this.estimatedPRValue = sum
        // console.log(sum,this.estimatedPRValue);
      }
    });
  }

  createNonItemForm() {
    this.nonItemForm = new FormGroup({
      description: new FormControl('', Validators.required),
      quantity: new FormControl('', Validators.required),
      uom: new FormControl('', Validators.required),
      specification: new FormControl('', Validators.required),
      price: new FormControl('', Validators.required)
   });
  //  this.nonItemForm.get('description').valueChanges.pipe(startWith(null), pairwise()).subscribe(([prev, next]: [any, any]) => {
  //    if(!!prev && !!next && next !== prev) {
  //       this.linkedItemListGrid.filterGlobal(next, 'contains');
  //    }
  //  });
  }

  getLinkedItemsByClient() {
    this.catService.getLinkedItemsByClient({id: localStorage.getItem('orgId')}).subscribe((res) => {
      if (res && Array.isArray(res)) {
        this.cache_linkedItemList = res;
        this.linkedItemList = res;
      }
    });
  }

  getItemsByVendorAndClient(rowData) {
    this.itemListByVendorId = [];
    this.catService.getItemsByVendorAndClient({id: rowData.vendorId}).subscribe((res) => {
      if (res && Array.isArray(res)) {
        this.itemListByVendorId = res;
        res.forEach(element => {
          element['uom'] = element['uom']['description'];

        });
        this.itemListByVendorId = [...res];
        this.successItemChilds(this.itemListByVendorId, rowData);
      }
    });
  }

  getLinkedVendorsByClient() {
    this.catService.LinkToClientWithVendorClient({id: localStorage.getItem('orgId')}).subscribe((res) => {
      if (res && Array.isArray(res)) {
        this.linkedVendorList = res;
      }
    });
  }

  getVendorByItemAndClient(rowData) {
    const obj = {
      'client': {
        'id': localStorage.getItem('orgId')
      },
      'item': {
        'id': rowData.itemId
      }
    };
    this.catService.getVendorsByClientAndItem(obj).subscribe((res) => {
      if (res && Array.isArray(res)) {
        this.linkedVendorListByItem = [];
        res.forEach((data) => {
          data['uom'] = data['uom']['description'];
          data['status'] = data.status ? data['status']['uiDisplay'] : '';
          this.linkedVendorListByItem.push(data);
        });
        this.successChilds(this.linkedVendorListByItem, rowData);
      }
    });
  }

  successChilds(data, rowData) {
    this.linkedItemList.forEach(element => {
        if (rowData.itemId === element.itemId) {
            element['childs'] = data;
        }
    });
  }

  successItemChilds(data, rowData) {
    this.linkedVendorList.forEach(element => {
        if (rowData.vendorId === element.vendorId) {
            element['childs'] = data;
        }
    });
  }

  getCloseItemsByVendorId() {
    this.expandedRows = {};
  }

  getItemsByVendorId(rowData) {
    this.expandedRows = {};
    const thisRef = this;
    thisRef.expandedRows[rowData.vendorId] = 1;

    this.selectedLinkedVendorData = [rowData];
    this.getItemsByVendorAndClient(rowData);
  }

  getVendorByItemId(rowData) {
    this.expandedRows = {};
    const thisRef = this;
    thisRef.expandedRows[rowData.itemId] = 1;

    this.selectedLinkedItemData = [rowData];
    this.getVendorByItemAndClient(rowData);
    console.log(this.selectedLinkedItemData);
  }

  getCloseVendorByItemId() {
    this.expandedRows = {};
  }

  addItemToPR(rowData, editMode) {
    this.section = 'Client';
    this.selectedLinkedItemData = [rowData];
    this.selectedItemId = rowData.itemId;
    this.addItemList = [];
    if (this.selectedLinkedItemData.length > 0 || editMode === 'single') {
      console.log('1');
      if (editMode === 'single') {
        console.log('1');
        rowData['quantity'] = '';
        rowData['linkedItemStatus'] = true;
        rowData['linkedItemId'] = rowData['itemId'];
        rowData['procucevItemCode'] = rowData['itemCode '];
        this.addItemList.push(rowData);
      } else {
        console.log('1');
        this.selectedLinkedItemData.forEach(element => {
          element['quantity'] = '';
          this.addItemList.push(element);
        });
      }
    } else {
      this.toastr.warning('Please Select atleast One Item ', 'Warning');
      return false;
    }
    if (editMode === 'single') {
      console.log('1');
      this.additemModalRef = this.modalDialog.open(this.addItemToPRModal, {
        maxWidth: '80%',
        minWidth: '60%',
        minHeight: '30vh',
        maxHeight: '90vh',
      });
    } else {
      console.log('1');
      if (this.selectedLinkedItemData.length > 0) {
        this.additemModalRef =  this.modalDialog.open(this.addItemToPRModal, {
          maxWidth: '80%',
          minWidth: '60%',
          minHeight: '30vh',
          maxHeight: '90vh',
        });
      }
    }
  }


  removePRItem(rowData) {
    const index = this.prItemList.findIndex(ele => ele.id = rowData.id);
    this.prItemList = this.prItemList.filter(ele => ele !== rowData);
    // this.prItemList.splice(index, 1);

    this.getEstimatedPRValue();
    this.toastr.warning('The item was removed from PRitems', 'Warning');
  }

  addItemsToPrItems() {
    const isEMptyQty = this.addItemList.some(ele => ele.quantity <= 0);
    console.log('isEm', isEMptyQty);
    if (isEMptyQty) {
      this.toastr.warning('Please enter quantity for all items', 'Warning');
      return;
    }
    this.addItemList.forEach(element => {
      if (!element.specification) {
        element.specification = element.item.specification;
      }
      this.prItemList.push(element);
      if (this.section === 'Client') {
      this.getAddItemToPr(element);
      } else if (this.section === 'Item') {
      this.getEstimatedPRValue();
      }
    });
    this.additemModalRef.close();

    this.additemModalRef.afterClosed().subscribe(res => {
        this.resetSelectedGridData();
    });
  }

  prChange(data: any) {
    console.log(data);
    if (this.estimatedPrEnableDisable) {
      this.estimatedPRValue = this.estimatedPRValueForLinkedItems + this.estimatedPRValueForNonLinkedItems;
    } else {
      this.estimatedPRValue = parseInt(data);
      this.updatedPrList.emit({prItemsList: this.prItemList, estimatedPRValue: this.estimatedPRValue,
        estimatedItemValue: this.estimatedPRValueForNonLinkedItems});
    }
  }

  getEstimatedPRValue() {
    if (this.addItemPrValues ? this.addItemPrValues.id : this.addItemPrValues) {
      this.prItemList.map((ele) => {
        if (ele.itemId && !ele.vendorId) {
        ele['linkedItemId'] = this.selectedItemId;
        ele['vendorName'] = this.addItemPrValues.companyName;
        ele['vendorId'] = this.addItemPrValues.id;
        ele['linkedItemPrice'] = this.addItemPrValues.pricePerUnit;
        ele['uom'] = this.addItemPrValues.uom;
        }
        return ele;
      });
    }
   this.onlyLinkedItems = this.prItemList.some(ele => ele.linkedItemPrice);
    if (this.onlyLinkedItems) {
      console.log('item linked only');
      this.estimatedPRValueForLinkedItems  = 0;
      this.prItemList.forEach((ele) => {
          if (ele.linkedItemPrice && ele.linkedItemStatus) {
              this.estimatedPRValueForLinkedItems = this.estimatedPRValueForLinkedItems + (ele.linkedItemPrice * ele.quantity);
          }
      });
    } else {
      this.estimatedPRValueForLinkedItems = 0;
    }

    // if(!this.estimatedPrEnableDisable){
      this.estimatedPRValue = this.estimatedPRValueForLinkedItems + this.estimatedPRValueForNonLinkedItems;
    // }
    this.updatedPrList.emit({prItemsList: this.prItemList, estimatedPRValue: this.estimatedPRValue ? this.estimatedPRValue : (this.estimatedPRValueForLinkedItems + this.estimatedPRValueForNonLinkedItems),
      estimatedItemValue: this.estimatedPRValueForNonLinkedItems});
  }

  getAddItemToPr(data) {
    this.addItemPrValues = undefined;
    const obj = {
      'client': {
        'id': localStorage.getItem('orgId')
      },
      'itemCode': data.itemCode
    };
    this.catService.getAddItemToPr(obj).subscribe((res) => {
      if (res) {
        console.log(res);
        this.addItemPrValues = res;
        this.getEstimatedPRValue();
      }
    });
  }

  addItemByVendorToPR(rowData, editMode) {
    this.section = 'Item';
    this.selectedItemDataByVendorId = [rowData];
    this.addItemList = [];
    if (this.selectedItemDataByVendorId.length > 0 || editMode === 'single') {
      if (editMode === 'single') {
        rowData['quantity'] = '';
        rowData['linkedItemPrice'] = rowData['pricePerUnit'];
        rowData['linkedItemStatus'] = true;
        rowData['procucevItemCode'] = rowData['item']['itemNumber'];
        rowData['uom'] = rowData['uom'];
        rowData['linkedItemId'] = rowData['id'];
        rowData['vendorId'] = rowData['vendor']['id'];
        rowData['vendorName'] = rowData['vendor']['companyName'];
        this.addItemList.push(rowData);
      } else {
      this.selectedItemDataByVendorId.forEach(element => {
        element['quantity'] = 0;
        element['linkedItemStatus'] = true;
        element['uom'] = rowData['uom'];
        element['linkedItemId'] = rowData['id'];
        element['vendorId'] = rowData['vendor']['id'];
        rowData['vendorName'] = rowData['vendor']['companyName'];
        this.addItemList.push(element);
      });
     }
    } else {
      this.toastr.warning('Please Select atleast One Item ', 'Warning');
      return false;
    }
    if (editMode === 'single') {
      this.additemModalRef = this.modalDialog.open(this.addItemToPRModal, {
        maxWidth: '80%',
        minWidth: '60%',
        minHeight: '30vh',
        maxHeight: '90vh',
      });
    } else {
      if (this.selectedItemDataByVendorId.length > 0) {
        this.additemModalRef =  this.modalDialog.open(this.addItemToPRModal, {
          maxWidth: '80%',
          minWidth: '60%',
          minHeight: '30vh',
          maxHeight: '90vh',
        });
      }
    }
  }
  addItemWithVendorIdToPR(rowData, editMode) { // LInked ITems - nested Grid vendors- action block
    this.section = 'Item';
    this.linkedItemList.forEach((item) => {
      if (item.childs) {
        item.childs.forEach(element => {
          if (element.id === rowData.id) {
            this.selectedLinkedItemData = [item];
          }
        });
      }
    });
    console.log(this.linkedItemList, this.selectedLinkedItemData, rowData);
    // this.selectedLinkedItemData = [rowData]
    const prItemObject = {...this.selectedLinkedItemData[0], linkedItemStatus : true, vendorName: rowData['vendorName'], linkedItemPrice: rowData['pricePerUnit'], vendorId: rowData.vendorId, linkedItemId: this.selectedLinkedItemData[0]['itemId']};
    this.addItemList = [];
    if (this.selectedLinkedVendorDataByItem.length > 0 || editMode === 'single') {
      if (editMode === 'single') {
        prItemObject['quantity'] = '';
        prItemObject['uom'] = rowData.uom;
        console.log(prItemObject);

        this.addItemList.push(prItemObject);
      } else {
        this.selectedLinkedVendorDataByItem.forEach(element => {
          prItemObject['quantity'] = '';
          prItemObject['uom'] = rowData.uom;
          this.addItemList.push(prItemObject);
        });
      }

    } else {
      this.toastr.warning('Please Select atleast One Item ', 'Warning');
      return false;
    }
    if (editMode === 'single') {
      this.additemModalRef = this.modalDialog.open(this.addItemToPRModal, {
        maxWidth: '80%',
        minWidth: '60%',
        minHeight: '30vh',
        maxHeight: '90vh',
      });
    } else {
      if (this.selectedLinkedVendorDataByItem.length > 0) {
        this.additemModalRef =  this.modalDialog.open(this.addItemToPRModal, {
          maxWidth: '80%',
          minWidth: '60%',
          minHeight: '30vh',
          maxHeight: '90vh',
        });
      }
    }
  }

  resetSelectedGridData() {
    this.selectedLinkedVendorDataByItem = [];
        this.selectedItemDataByVendorId = [];
        this.selectedLinkedVendorData = [];
        this.selectedPrItemData = [];
  }

  addNonItemToPR() {
    this.nonItemForm.markAsTouched();
    if (this.nonItemForm.valid) {
      const obj = {...{nonItem: true}, ...this.nonItemForm.getRawValue()};
      console.log(obj);
      this.prItemList.push(obj);
      this.prItemList.length > 0 ? (this.toastr.success('Item added to pr successfully', 'Success')) : '';
      this.nonItemForm.reset();
      this.nonItemForm.markAsUntouched();
      this.getEstimatedPRValueForNonLinkedItem();
      this.getEstimatedPRValue();
    this.linkedItemListGrid.reset();
    } else {
      this.toastr.warning('Please enter all fields', 'Warning');
    }
  }
    getEstimatedPRValueForNonLinkedItem() {
        this.nonLinkPrValue = false;
        let a = 0;
        let b = 0;
        this.prItemList.forEach((ele) => {
            if (ele.nonItem) {
                a = ele.price * ele.quantity;
            }
            if (!ele.linkedItemStatus && ele.linkedItemStatus !== undefined) {
              b = ele.linkedItemPrice * ele.quantity;
          }
        });
        this.estimatedPRValueForNonLinkedItems = a + b;
    }

  showLinkedItems() {
    this.showLinkedItemsPanel = true;
  }

  resetNonItemForm() {
    this.nonItemForm.reset();
    this.nonItemForm.markAsUntouched();
    this.linkedItemListGrid.filterGlobal('', 'contains');
  }

  uploadBOQFile($event) {
    this.BOQDocument = $event.target.files[0];
    this.convertSer.getBase64(this.BOQDocument).then((data: string) => {
        const temp = {
            fileName: this.BOQDocument.name,
            file: data.split(',')[1],
        };
        this.BOQDocToBase64.push(temp);
    });
  }

  openBulkUploadModal() {
    this.additemModalRef =  this.modalDialog.open(this.bulkUploadPRModal, {
      maxWidth: '60%',
      minWidth: '30%',
      minHeight: '30vh',
      maxHeight: '80vh',
    });
  }

  convertBoQtoPrItems() {
    if (this.BOQDocToBase64.length > 0) {
      this.prModalService.convertBOQToPR({capexFlag: false, boqfile: this.BOQDocToBase64[0]['file']}).subscribe((res) => {
        if (Array.isArray(res)) {
          this.estimatedPrEnableDisable = false;
          res.forEach(element => {
            element['isBoqItem'] = true;
            this.prItemList.push(element);
            this.getEstimatedPRValue();
          });
          this.BOQDocToBase64 = [];
          this.additemModalRef.close();
        }
      });
     }
  }
  onItemDesc(data: any) {
    console.log(data.target.value);
    const __FOUND = this.linkedItemList.find(function(post, index) {
        if (post.description === data.target.value) {
            return true;
        }
    });
    console.log(__FOUND);

  }

}

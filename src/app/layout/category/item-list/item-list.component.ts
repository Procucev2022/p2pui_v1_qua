import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { CommonGridData } from 'src/app/shared/modules/common-share/models/commonGridData';
import { EncryDecryService } from 'src/app/shared/services';
import { CreateItemCategoryComponent } from '../create-item-category/create-item-category.component';
import { CategoryService } from '../services/category.service';
import { AppApiConfig } from '../../../shared/constants/app-api.config';
import { AppConfig } from 'src/app/app.config';
import { NewCreateSubCategoryComponent } from '../new-create-sub-category/new-create-sub-category.component';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { PriceAnalyticsGraphModalComponent } from 'src/app/shared/modules/common-share/price-analytics-graph-modal/price-analytics-graph-modal.component';

@Component({
  selector: 'app-item-list',
  templateUrl: './item-list.component.html',
  styleUrls: ['./item-list.component.scss'],
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
export class ItemListComponent implements OnInit {
  itemGridData: CommonGridData;
  selectedItemId: string;
  hsnCodeList: any = [];
  linkedVendorList: any[];
  linkedClientList: any[];
  selectedRowData: any;
  defaultPermissions: any;
  loggedUserDetails: any;
  loggedUserPermissions: any;
  roleName: any;
  itemList: any[] = [];
  selectedData: any;
  updatedDescripiton: any;
  updatedSpecification: any;
  itemHeaders = [
    // { field: 'upcCode', header: 'UPC', isLink: false,  width: '150px',  fieldType: 'text', fieldTitle: 'Universal Product Code'},
    { field: 'description', header: 'Item Description', isLink: false,  width: '200px',  fieldType: 'text', fieldTitle: ''},
    { field: 'itemNumber', header: 'Item Number', isLink: false,  width: '150px',  fieldType: 'text', fieldTitle: ''},
    { field: 'specification', header: 'Specification', isLink: false,  width: '200px',  fieldType: 'text', fieldTitle: ''},
    { field: 'price', header: 'Price', isLink: false,  width: '130px',  fieldType: 'text', fieldTitle: ''},
    // { field: 'uom', header: 'UOM', isLink: false,  width: '130px',  fieldType: 'text'},
    { field: 'status', header: 'Status', isLink: false,  width: '130px',  fieldType: 'text', fieldTitle: ''},
    { field: 'createdTS', header: 'Creation Date', isLink: false,  width: '130px',  fieldType: 'date', fieldTitle: ''}
  ];
    pageRecordSize: any;
    pageOptions: any;
    paginatoryDetails: any;
    expandedRows: {} = {};
  loggedUserOwnPermissions: any;
  DEfAULT_OWN_PERMISSIONS_LIST:any;
    isAnalyticsScreenShow: boolean;

  constructor(private catService: CategoryService, private modalDialog: MatDialog,
    private toaster: ToastrService,
    private encryDecryService: EncryDecryService) { }

  ngOnInit() {
    this.pageRecordSize = AppConfig.GRID_PAGE_INFO.initpageSize;
    this.pageOptions = AppConfig.GRID_PAGE_INFO.pageOptions;
    this.defaultPermissions = AppApiConfig.DEFAULT_PERMISSIONS;
    const temp = JSON.parse(
      this.encryDecryService.get(localStorage.getItem('logData'))
    );
    this.loggedUserDetails = temp.details;
    this.roleName = this.loggedUserDetails.role.roleName;

    this.loggedUserPermissions = this.loggedUserDetails.listofPermission;

    this.DEfAULT_OWN_PERMISSIONS_LIST = AppApiConfig.OWN_PERMISSIONS_LIST;
    this.loggedUserOwnPermissions = this.loggedUserDetails.ownPermissions || [];
    this.selectedRowData = null;
    this.isAnalyticsScreenShow =this.loggedUserDetails.role.roleName == 'VendorManager' || this.loggedUserDetails.role.roleName == "CategoryManager" ;

    if (this.roleName === 'VendorManager' || this.roleName === 'VendorManager2' || this.roleName === 'PartialVendor') {
     this.getAllItemsMaster();
    }else{
      this.getAllItemsForCM();
    }
  }

  getAllItemsForCM(){
    this.itemGridData = null;
    this.itemList = [];
    this.catService.getAllItemsForCM().subscribe((res) => {
      if (!!res && Array.isArray(res)) {
        res.forEach(ele => {
          // ele['uom'] = ele['itemuom']['description'];
          ele['status'] = ele['status']['uiDisplay'];
          this.itemList.push(ele);
        });
        // this.setItemGridData(res);
      } else {
          this.itemList = [];
        // this.setItemGridData([]);
      }
    });
  }

  getAllItemsMaster() {
    this.itemGridData = null;
    this.itemList = [];
    this.catService.getAllItemsMaster().subscribe((res) => {
      if (!!res && Array.isArray(res)) {
        res.forEach(ele => {
          // ele['uom'] = ele['itemuom']['description'];
          ele['status'] = ele['status']['uiDisplay'];
          this.itemList.push(ele);
        });
        // this.setItemGridData(res);
      } else {
          this.itemList = [];
        // this.setItemGridData([]);
      }
    });

  }

  onPage(event) {
    this.paginatoryDetails = event;
  }

    approve(data) {
        console.log(data);
        const obj = {
            id : data.id
        };
        this.catService.approveItem(obj).subscribe((res) => {
            this.successCallBack(res);
        });
    }
    reject(data) {
      const obj = {
        id : data.id
      };
      this.catService.rejectItem(obj).subscribe((res) => {
        this.successCallBack(res);
      });
    }
    successCallBack(res: any) {
        if (res.status === 'Success') {
            this.toaster.success(res.message, 'Success');
        } else {
            this.toaster.error(res.message, 'Error');
        }
        this.getAllItemsMaster();
    }

  setItemGridData(res) {
    const gridTopButtonsEvents = [
      {
        name: 'Create Item',
        btnColor: 'primary',
        btnName: 'Create',
        btnEventName: 'createItem',
        btnType: 'button'
      }
    ];
    const actionEvents = [

    ];
    const gridHeaders = [
      { field: 'description', header: 'Item Description', isLink: true,  width: '150px',  fieldType: 'text'},
      { field: 'upcCode', header: 'UPC Code', isLink: false,  width: '150px',  fieldType: 'text'},
      { field: 'itemNumber', header: 'Item Number', isLink: false,  width: '150px',  fieldType: 'text'},
      { field: 'uom', header: 'UOM', isLink: false,  width: '130px',  fieldType: 'text'},
      { field: 'status', header: 'Status', isLink: false,  width: '130px',  fieldType: 'text'},
      { field: 'createdTS', header: 'Creation Date', isLink: false,  width: '130px',  fieldType: 'date'},
    ];
   this.itemGridData = {
    actionEvents: [...actionEvents],
    gridTopButtonActions  : [...gridTopButtonsEvents],
    gridColumnData: res || [],
    gridHeaders: [...gridHeaders],
    gridTitle: '',
    displayParentLabel: ' ',
    displayParentId: '',
    rowEventClickEventName: 'getVendorAndClientListByItemId',
    editableCells : [],
    gridSelectionCheckbox: {
      showSelction: false,
      allowMultipleSelection: false
    }
   };
  }

  onClickCommonGrid(event) { console.log('event', event);
   this[event.eventName](event);
  }

  createItem(selectedData?: any) {
    const response = [];
//     this.catService.fetchAllHSNCodes().subscribe((res) => {

//       if (!!res && Array.isArray(res)) {
//         response = res || [];
//       }


//     response.forEach(element => {
//         this.hsnCodeList.push({label: element.commodityName, value: element.fullCode, id: element.id});
//     });

//  });
    this.modalDialog.open(NewCreateSubCategoryComponent, {
      width: '80%',
      minHeight: '80vh',
      data: {...selectedData, type: 'Item'}
    }).afterClosed().subscribe((res) => {
      if (true) {
      this.getAllItemsMaster();
      }
    });
  }


  // getVendorAndClientListByItemId(event) {
  //   this.selectedRowData  = null;
  //   setTimeout(() => {
  //     this.selectedRowData  = Object.assign({}, event);
  //   }, 100);

  // }

  getVendorAndClientListByItemId(selectedRowData, event, isNewItemLink:boolean) {
    if(isNewItemLink && !selectedRowData.itemNumber){
        this.createItem(selectedRowData);
        return;
    }
    this.expandedRows = {};
    const thisRef = this;
    thisRef.expandedRows[selectedRowData.id] = 1;

    this.selectedData = [selectedRowData];
    this.selectedRowData = Object.assign({}, selectedRowData);

}

getCloseRFQLineItems(selectedRowData, event) {
    this.expandedRows = {};
}

editDescription(data, editItem) {
  this.selectedItemId = data.id;
  this.updatedDescripiton = data.description;
  this.updatedSpecification = data.specification;
  this.modalDialog.open(editItem , {
    width: '30%'
  });
}

saveItemDescription(editItemForm) {
  console.log( editItemForm);
  if (editItemForm.valid) {
    const obj = {
      id : this.selectedItemId,
      description: this.updatedDescripiton,
      specification: this.updatedSpecification
    };
    if (this.updatedDescripiton.length === 0) {
      this.toaster.error('description should not be empty', 'Error');
    } else if (this.updatedSpecification.length === 0) {
      this.toaster.error('specification should not be empty', 'Error');
    } else {
      this.catService.editItemDescription(obj).subscribe((res) => {
        const response = JSON.parse(JSON.stringify(res));
        if (response.status === 'Success') {
          this.toaster.success(response.message, 'Success');
          this.getAllItemsMaster();
          this.modalDialog.closeAll();
      } else {
          this.toaster.error(response.message, 'Error');
      }
      });
    }
  }
}

// view Analytics Modal
showAnalyticsForSelectedItem(rowData:any, isVendorLevel,  parentRowData?: any){
        let chartData;
        if(!isVendorLevel){
             chartData = {
                'itemId': rowData.id,
                'graphTitle': 'Price Trend For : '+rowData.description,
                'graphSubTitle': '',
                'isVendorLevel': isVendorLevel,
                'currentPrice': rowData.price,
                'priceFlag': rowData.priceFlag
            }
        }else{
            chartData = {
                'itemId': parentRowData.id,
                'vendorId': rowData.vendorId,
                'graphTitle': 'Price Trend For : '+rowData.vendorName,
                'graphSubTitle': '',
                'isVendorLevel': isVendorLevel,
                'currentPrice': rowData.pricePerUnit,
                'priceFlag': rowData.priceFlag
            }
        }
        const dialog = this.modalDialog.open(PriceAnalyticsGraphModalComponent, {  width: '60%',
        minHeight: '80vh',data: chartData });

        dialog.afterClosed().subscribe(result => {

        });


}


}

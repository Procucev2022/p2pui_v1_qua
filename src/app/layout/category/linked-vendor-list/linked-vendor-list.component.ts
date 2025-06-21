import { Component, OnInit, Input } from '@angular/core';
import { EncryDecryService } from '../../../shared/services/encry-decry.service';
import { AppApiConfig } from '../../../shared/constants/app-api.config';
import { MatDialog } from '@angular/material/dialog';
import { VendorLinkingToItemModalComponent } from '../vendor-linking-to-item-modal/vendor-linking-to-item-modal.component';
import { CategoryService } from '../services/category.service';
import { LinkClientModalComponent } from '../link-client-modal/link-client-modal.component';
import { CommonGridData } from 'src/app/shared/modules/common-share/models/commonGridData';
import { ToastrService } from 'ngx-toastr';
import { PriceAnalyticsGraphModalComponent } from 'src/app/shared/modules/common-share/price-analytics-graph-modal/price-analytics-graph-modal.component';

@Component({
  selector: 'app-linked-vendor-list',
  templateUrl: './linked-vendor-list.component.html',
  styleUrls: ['./linked-vendor-list.component.scss']
})
export class LinkedVendorListComponent implements OnInit {

  @Input('itemData') itemData;
  paginatoryDetails: any;
  vendorList = [];
  vendorHeaders = [
    { field: 'vendorName',  header: 'Company Name',  isLink: true, width: '220px', fieldType: 'text' },
    { field: 'description',  header: 'Description',  isLink: false, width: '220px', fieldType: 'text' },
    { field: 'rank',  header: 'Rank',  isLink: false, width: '120px', fieldType: 'text' },
    { field: 'leadTimeDay',  header: 'Lead Time Days',  isLink: false, width: '180px', fieldType: 'text' },
    { field: 'uom',  header: 'UOM',  isLink: false, width: '140px', fieldType: 'text' },
    { field: 'pricePerUnit',  header: 'Price Per Unit',  isLink: false, width: '180px', fieldType: 'text' },
  ];
  gridHeaders = [
    { field: 'companyName', header: 'Company Name', isLink: false,  width: '150px',  fieldType: 'text'},
    { field: 'city', header: 'City', isLink: false,  width: '150px',  fieldType: 'text'},
    { field: 'createdTS', header: 'Creation Date', isLink: false,  width: '130px',  fieldType: 'date'},
];
  selectedData = [];
  selectedDataOne:any[] = []
  defaultPermissions: any;
  loggedUserDetails: any;
  loggedUserPermissions: any;
  pageRecordSize: number;
  pageOptions: number[];
  clientsListByItem: CommonGridData
  linkedVendorsList: any[] = [];
    pageRecordSizeOne: number;
    pageOptionsOne: number[];
    DEfAULT_OWN_PERMISSIONS_LIST:any;
    loggedUserOwnPermissions:any;
    roleName:any;
    isAnalyticsScreenShow: boolean;

  constructor(private encryDecryService: EncryDecryService,
    private modalDialog: MatDialog, private catService: CategoryService, private toaster : ToastrService) { }

  ngOnInit() {
    this.getLinkedVendorListByItemId();
    this.defaultPermissions = AppApiConfig.DEFAULT_PERMISSIONS;
    const temp = JSON.parse(
      this.encryDecryService.get('perm', localStorage.getItem('logData'))
    );
    this.loggedUserDetails = temp.details;
    this.isAnalyticsScreenShow =this.loggedUserDetails.role.roleName == 'VendorManager' || this.loggedUserDetails.role.roleName == "CategoryManager" ;

    this.DEfAULT_OWN_PERMISSIONS_LIST = AppApiConfig.OWN_PERMISSIONS_LIST;
    this.loggedUserOwnPermissions = this.loggedUserDetails.ownPermissions || [];
    this.loggedUserPermissions = this.loggedUserDetails.listofPermission;
    this.pageRecordSize = AppApiConfig.GRID_PAGE_INFO.initpageSize;
    this.pageOptions = AppApiConfig.GRID_PAGE_INFO.pageOptions;
    this.roleName = this.loggedUserDetails.role.roleName;
    this.pageRecordSizeOne = AppApiConfig.GRID_PAGE_INFO.initpageSize;
    this.pageOptionsOne = AppApiConfig.GRID_PAGE_INFO.pageOptions;
  }

  linkNewVendorToItems() {
    this.modalDialog.open(VendorLinkingToItemModalComponent,  {
      width: '70%',
      maxHeight: '90vh',
      data: this.itemData
    }).afterClosed().subscribe((res) => {
      if (res['event'] = 'linked') {
        this.getLinkedVendorListByItemId();
       }
    });

  }

  getLinkedVendorListByItemId() {
    this.vendorList = []
    this.catService.getLinkedVendorByItemId({id: this.itemData.id}).subscribe((res) => {
      if (Array.isArray(res)) {
        res.forEach((element) => {
          element['isEdit'] = false;
          element['isSaved'] = false;
          element['uom'] = element['uom']['description'];
          element['status'] = element.status ? element['status']['uiDisplay'] : '';
          this.vendorList.push(element);
        })
      }
    });
  }

  onLinkTo(rowData){
    this.modalDialog.open(LinkClientModalComponent,  {
        width: '70%',
        maxHeight: '90vh',
        data: {"item" : this.itemData, "client":rowData}
      }).afterClosed().subscribe((res) => {
        if (res['event'] === 'linked') {
          this.getLinkedVendorListByItemId();
        }
      });
  }
  onVendorClientClick(rowData){
        this.selectedData = [rowData];
        let obj = {
            "vendor":{
                "id": rowData.vendorId
            },
            "item":{
                "id": this.itemData.id
            }
          }
        this.catService.getClientsListByItemAndVendor(obj).subscribe((data) => {
            if(Array.isArray(data)){
                this.linkedVendorsList = data
            }
        })
  }

  setclientsListByItem(res) {
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
        { field: 'companyName', header: 'Company Name', isLink: false,  width: '150px',  fieldType: 'text'},
      { field: 'city', header: 'City', isLink: false,  width: '150px',  fieldType: 'text'},
      { field: 'createdTS', header: 'Creation Date', isLink: false,  width: '130px',  fieldType: 'date'},
    ];
   this.clientsListByItem = {
    actionEvents: [...actionEvents],
    gridTopButtonActions  : [],
    gridColumnData: res || [],
    gridHeaders: [...gridHeaders],
    gridTitle: '',
    displayParentLabel: ' ',
    displayParentId: '',
    rowEventClickEventName: '',
    editableCells : [],
    gridSelectionCheckbox: {
      showSelction: false,
      allowMultipleSelection: false
    }
   };
  }

  delink(){
      let itemIdList:any[] = []
      this.selectedDataOne.forEach((data) => {
          itemIdList.push({"id" : data.itemId})
      })
    this.catService.delinkVendor(itemIdList).subscribe((res) => {
        this.successCallBack(res)
    })
}
  successCallBack(res: any) {
      if(res.status == "Success"){
          this.toaster.success(res.message, 'Success')
      }else{
          this.toaster.error(res.message, 'Error')
      }
    //   this.getAllSubCategoryList()
  }

  editVendorData(rowData, index, actionName) {
    switch (actionName) {
      case 'edit':
        this.vendorList[index]['isEdit'] = true;
        this.vendorList[index]['isSaved'] = false;
        break;
      case 'save':
        this.vendorList[index]['isEdit'] = false;
        this.vendorList[index]['isSaved'] = true;
        this.saveItemData(this.vendorList[index]);
        break;
      case 'reset':
        this.vendorList[index]['isEdit'] = false;
        this.vendorList[index]['isSaved'] = false;
        break;
      default:
    }
  }

  saveItemData(data) {
    let obj = {
        "item": {"id": this.itemData.id},
        "pricePerUnit": data.pricePerUnit,
        "vendor": {"id": data.vendorId}
    }
    this.catService.editItemByVendorRef(obj).subscribe((res:any) => {
      if (res['status'] === 'Success') {
        this.toaster.success(res.message, 'Success');
        this.getLinkedVendorListByItemId();
      }
    });
  }

  showAnalyticsForSelectedItem(rowData:any, isVendorLevel,  parentRowData?: any){
    let chartData;
    if(!isVendorLevel){
         chartData = {
            'itemId': rowData.id,
            'graphTitle': 'Price Trend For : '+`${rowData.vendorName}  `,
            'graphSubTitle': '',
            'isVendorLevel': isVendorLevel,
            'currentPrice': rowData.price,
            'priceFlag': rowData.priceFlag
        }
    }else{
        chartData = {
            'itemId': this.itemData.id,
            'vendorId': rowData.vendorId,
            'graphTitle': 'Price Trend For : '+`${rowData.vendorName} `,
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

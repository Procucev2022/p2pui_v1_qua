import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { EncryDecryService } from 'src/app/shared/services';
import { RfqService } from '../../vendor/services/rfq.service';
import { ToastrService } from 'ngx-toastr';
import { AppApiConfig } from 'src/app/shared/constants/app-api.config';
import { ViewRFQByIdModalComponent } from '../../vendor/components/view-rfq-by-id-modal/view-rfq-by-id-modal.component';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { SystemViewConfig } from 'src/app/app.config';
import { EditRfqByIdModalComponent } from '../../vendor/components/edit-rfq-by-id-modal/edit-rfq-by-id-modal.component';
@Component({
    selector: 'app-cat-mgr-client-gmt-rfqs',
    templateUrl: './cat-mgr-client-gmt-rfqs.component.html',
    styleUrls: ['./cat-mgr-client-gmt-rfqs.component.scss']
})
export class CatMgrClientGmtRfqsComponent implements OnInit {

  @ViewChild('raiseQueryRef') raiseQueryRef: any;
  @ViewChild('h1') h1:  ElementRef;
  rfqDataList: any = [];
  selectedData: any = [];
  paginatoryDetails: any;
  pageRecordSize: any;
  pageOptions: any;
  defaultPermissions: any;
  loggedUserPermissions: any;
  viewRFQByIdData: any;
  rfqTableHeaders = [];
  expandedRows: {} = {};

  @ViewChild('vendorInfoTemplate') vendorInfoTemplate: any;
  queryList: any = [];
  rfqsTableHeadersForGMTVendor: any = [
      { field: 'rfqId', header: 'RFQ Id', isLink: false, width: '120px', fieldType: 'text', isExceedContent: false },
      { field: 'desc', header: 'Description', isLink: false, width: '160px', fieldType: 'text', isExceedContent: true },
      { field: 'queryContent', header: 'Query', isLink: false, width: '160px', fieldType: 'text', isExceedContent: true },
      // { field: 'closureDate', header: 'Closure Date', isLink: false, width: '160px', fieldType: 'date', isExceedContent: false },
      // { field: 'createdTS', header: 'Creation Date', isLink: false, fieldType: 'date',  width: '180px', isExceedContent: false},
      // { field: 'rfqClosingDate', header: 'RFQ Due Date', isLink: false, fieldType: 'date',  width: '180px' , isExceedContent: false},
      { field: 'status_ui_display', header: 'Status', isLink: false, width: '100px', fieldType: 'text', isExceedContent: false }
  ];
  rfqsTableHeadersForCategoryManger: any = [
      // { field: 'rfqId', header: 'RFQ Id', isLink: false, width: '190px', fieldType: 'text', isExceedContent: false },
      // { field: 'description', header: 'Description', isLink: false, width: '150px', fieldType: 'text', isExceedContent: true },
      // { field: 'rfqClosingDate', header: 'Closure Date', isLink: false, width: '160px', fieldType: 'date', isExceedContent: false },
      // { field: 'createdTS', header: 'Creation Date', isLink: false, fieldType: 'date',  width: '180px', isExceedContent: false},
      // { field: 'status_ui_display', header: 'Status', isLink: false, width: '150px', fieldType: 'text', isExceedContent: false }
      { field: 'rfqId', header: 'RFQ Id', isLink: false, width: '190px', fieldType: 'text', isExceedContent: false },
      { field: 'projectDesc', header: 'Description', isLink: false, width: '150px', fieldType: 'text', isExceedContent: true },
      { field: 'companyName', header: 'Company Name', isLink: false, width: '180px', fieldType: 'text', isExceedContent: true },
      { field: 'phoneNumber', header: 'Contact', isLink: false, width: '180px', fieldType: 'text', isExceedContent: true },
       { field: 'createdBy', header: 'Created By', isLink: false, width: '160px', fieldType: 'text', isExceedContent: false },
      { field: 'createdTs', header: 'Creation Date', isLink: false, fieldType: 'date', width: '180px', isExceedContent: false },
      { field: 'status_ui_display', header: 'Status', isLink: false, width: '160px', fieldType: 'text', isExceedContent: false },
  ];

  vendorTableHeaders: any = [
      { field: 'vendorId', header: 'Company Id', isLink: false, width: '190px', fieldType: 'text', isExceedContent: false },
      { field: 'vendorName', header: 'Name', isLink: false, width: '150px', fieldType: 'text', isExceedContent: true },
      { field: 'status_ui_display', header: 'Status', isLink: false, width: '160px', fieldType: 'text', isExceedContent: false },
      { field: 'createdTS', header: 'Creation Date', isLink: false, fieldType: 'date', width: '180px', isExceedContent: false },
  ];
  itemsTableHeaders: any = [
      { field: 'description', header: 'Item Description', isLink: false, width: '190px', fieldType: 'text', isExceedContent: true },
      { field: 'brand', header: 'Brand', isLink: false, width: '150px', fieldType: 'text', isExceedContent: true },
      { field: 'unitofMeasures', header: 'UOM', isLink: false, width: '160px', fieldType: 'text', isExceedContent: false },
      { field: 'quantity', header: 'Quantity', isLink: false, width: '160px', fieldType: 'text', isExceedContent: false },
      { field: 'unitprice', header: 'Unit Price', isLink: false, width: '160px', fieldType: 'text', isExceedContent: false },
      { field: 'createdTS', header: 'Creation Date', isLink: false, fieldType: 'date', width: '180px', isExceedContent: false },
  ];
  loggedUserDetails: any;
  currentRole: any = '';
  selectedRfqData: any;
  rfqId: any;
  vendorsList: any = [];
  itemsList: any = [];
  dialogRef: any;
  queryDescContent: string = '';
  isChildGridShow: boolean;
  isGMTView: boolean;
  SYSTEM_VIEW_CONFIG: any = SystemViewConfig;
  GMT_VIEWS = [this.SYSTEM_VIEW_CONFIG.GMT_BASIC, this.SYSTEM_VIEW_CONFIG.GMT_BASIC_PLUS]
  isSendRFQ: boolean =false;
  selectedVendor: any;
  vendorInfo: any;
  constructor(private dialog: MatDialog,
      private encryDecryService: EncryDecryService,
      private rfqservice: RfqService,
      private toastrService: ToastrService,) { }

  ngOnInit() {
      this.pageRecordSize = AppApiConfig.GRID_PAGE_INFO.initpageSize;
      this.pageOptions = AppApiConfig.GRID_PAGE_INFO.pageOptions;
      this.defaultPermissions = AppApiConfig.DEFAULT_PERMISSIONS;
      const temp = JSON.parse(this.encryDecryService.get('perm', localStorage.getItem('logData')));
      this.loggedUserDetails = temp.details;
      this.loggedUserPermissions = temp.details.listofPermission;
      this.currentRole = this.loggedUserDetails.role.roleName;
      this.intialCall();
      this.isGMTView = localStorage.getItem('system-view') ? this.GMT_VIEWS.includes(localStorage.getItem('system-view')) : false;

  }

  intialCall() {
          this.rfqTableHeaders = this.rfqsTableHeadersForCategoryManger;
          this.getRfqsByCategoryManager();

  }
  getRfqsByCategoryManager() {
      this.selectedData = [];

      this.rfqservice.getAllClientRFQsByGMTForCMandCM2().subscribe(data => {
          if (Array.isArray(data)) {
              this.rfqDataList = data.map((ele: any) => {
                  const status_display = ele['clientStatus'] && ele['clientStatus']['uiDisplay'] ? ele.clientStatus.uiDisplay : ele.uiDisplay;
                  return { ...ele, status_ui_display: status_display }
              }) || [];
          } else {
              this.rfqDataList = [];
          }
      });
  }

  onViewRFQDetails(rowData , isEdit, isSendRFQ) {
      console.log(rowData);
      const temp = {
          'id': rowData.id
      };
      this.rfqservice.fetchRfqById(temp).subscribe((res: any) => {
          if (res) {
              this.viewRFQByIdData = res || {};
              if(isEdit){
                  this.onEditRfqDetails();
              }else{
                  this.viewRFQByIdModal();
              }

          } else {
              this.toastrService.error('Failed to Fetch data', 'Failure');
          }
      });
  }
  onEditRfqDetails(){
      const dialogConfig = new MatDialogConfig();

      // dialogConfig.disableClose = true;
      dialogConfig.autoFocus = true;
      dialogConfig.data = {...this.viewRFQByIdData, hiddenCategory: true};
      dialogConfig.minWidth = 400;
      dialogConfig.minHeight = 600;
      dialogConfig.maxWidth = 'none';
      dialogConfig.width = '80%';
      const dialogRef = this.dialog.open(EditRfqByIdModalComponent, dialogConfig).afterClosed().subscribe(result => { console.log(result);

          if(result.success){
              this.intialCall();
          }});

  }

  viewRFQByIdModal() {
      const dialogConfig = new MatDialogConfig();

      // dialogConfig.disableClose = true;
      dialogConfig.autoFocus = true;
      dialogConfig.data = { ...this.viewRFQByIdData, hiddenCategory: true, showItemsOnly: true };
      dialogConfig.minWidth = 400;
      dialogConfig.minHeight = 500;
      dialogConfig.maxWidth = 'none';
      dialogConfig.width = '80%';
      this.dialogRef = this.dialog.open(ViewRFQByIdModalComponent, dialogConfig).afterClosed().subscribe(result => {
          //this.intialCall()
      });
  }
  getRFQListByGMTVendor() {
      this.selectedData = [];
      const req = { "id": this.loggedUserDetails.org.id };
      this.rfqservice.getAllCategoryRFQByGMTVendors(req).subscribe(data => {
          // const data =[
          //     {
          //     "id": "a4de0d8b-7e62-49b3-951b-eab71c55379e",
          //     "rfqId": "ONE231107140613-R1002",
          //     "desc": "TestPR2_07_11",
          //     "closureDate": null,
          //     "status":{"id": "6", "createdBy": "venu", "lastModifiedBy": null, "createdTS": null, uiDisplay: 'New'},
          //     "deliveryLocation": null
          //     },
          //     {
          //     "id": "78b7172f-27a7-4f43-a415-c41c2cd31522",
          //     "rfqId": "ONE231107140613-R1001",
          //     "desc": "TestPR2_07_11",
          //     "closureDate": null,
          //     "status":{"id": "6", "createdBy": "venu", "lastModifiedBy": null, "createdTS": null, uiDisplay: 'New'},
          //     "deliveryLocation": null
          //     }]
          if (Array.isArray(data)) {
              this.rfqDataList = data.map((ele: any) => {
                  const desc = ele.query ? ele.query.split('|').join(" ") : '';
                  const status_display = ele['status'] && ele['status']['uiDisplay'] ? ele.status.uiDisplay : ele.status;
                  return { ...ele, status_ui_display: status_display, queryContent: desc }
              }) || [];
          } else {
              this.rfqDataList = [];
          }
      });


  }

  onRequestForRFQ(rowData: any) {
      if (rowData.status_ui_display == 'Requested') {
          this.toastrService.warning("RFQ Requested already!", 'Warning')
          return false;
      }
      const dates = this.rfqDataList.map(ele => { createdTs: ele.createdTS })

      const currentDateTimeStamp = new Date();
      const currentMonth = currentDateTimeStamp.getMonth();

      const cr = this.rfqDataList.filter(ele => {
          return ((new Date(ele.createdTS)).getMonth() == currentMonth || (new Date(ele.createdTs)).getMonth() == currentMonth) && ele.status_ui_display == 'Requested'
      })
      if (cr.length > 3) {
          this.toastrService.warning("you have reached your monthly limit. Please become a premium member to continue with RFQs", "Warning");
          return;
      }
      const req = [{
          "vendor": {
              "id": this.loggedUserDetails.org.id
          },
          "rfq": {
              "id": rowData.id
          }
      }]
      this.rfqservice.requestForRFQByGMTVendor(req).subscribe((res: any) => {
          if (res.status == 'Success') {
              this.toastrService.success(res.message, 'Success');
              this.intialCall();
          } else {
              this.toastrService.error(res.message, 'Error')
          }
      });

  }

  viewRFQDetails(rowData) {
      console.log(rowData);
      const temp = {
          'id': rowData.id
      };
      this.rfqservice.fetchRfqById(temp).subscribe((res: any) => {
          if (res) {
              this.viewRFQByIdData = res || {};
              this.viewRFQByIdModal();
          } else {
              this.toastrService.error('Failed to Fetch data', 'Failure');
          }
      });
  }



  viewCorresspondance(rowData) {
      // rowData['commentRootPath'] = 'CAT-RFQ-COMMENTS-MODAL';
      // const dialog = this.dialog.open(CorrespondenceComponent, { data: rowData,width: '60%', maxWidth: '40%',
  //    minHeight: 400 , maxHeight: '70vh'  });

      // dialog.afterClosed().subscribe(result => {
      //     // this.getRfqsByPr();
      // });
  }

  getLineItems(event) {

  }

  getRFQs(selectedRowData, event) {
      this.expandedRows = {};
      const thisRef = this;
      thisRef.expandedRows[selectedRowData.id] = 1;
      this.vendorsList =[];
      this.itemsList =[];
      this.selectedData = [selectedRowData];
      this.selectedRfqData = Object.assign({}, selectedRowData);
      this.rfqId = selectedRowData.rfqId;
      this.getVendorsByRfq();
      this.getLineItemsByRFQ();
  }

  getCloseRFQs(selectedRowData, event) {
      this.expandedRows = {};
  }

  getVendorsByRfq() {
      const obj = { "id": this.selectedRfqData.id }
      this.isChildGridShow = false;
      this.vendorsList = [];
      this.rfqservice.getVendorsByRFQIdForGMT(obj).subscribe((res: any) => {
          if (Array.isArray(res)) {
              this.vendorsList = res.map((ele: any) => {
                  const status_display = ele['status'] && ele['status']['uiDisplay'] ? ele.status.uiDisplay : ele.status;
                  return { ...ele, status_ui_display: status_display }
              }) || [];
          }
      });
      setTimeout(() => {
          this.isChildGridShow = true;
      }, 200);

      // this.vendorsList = [
      //     {
      //         "id": "140bb2f2-7154-4686-a7b6-03ca082ff153",
      //         "createdBy": null,
      //         "lastModifiedBy": null,
      //         "createdTS": null,
      //         "lastModifiedTS": null,
      //         "vendor": null,
      //         "rfq": null,
      //         "vendorUuid": "3b601125-e39d-483a-ada7-bed8794bc504",
      //         "vendorName": "soft world",
      //         "vendorId": "SOF220508165630",
      //         "status_ui_display": "New",
      //         "status": { "id": "102", "createdBy": "Harshitha", "lastModifiedBy": null, "createdTS": null, uiDisplay: 'New' }
      //     }, {
      //         "id": "140bb2f2-7154-4686-a7b6-03ca082ff154",
      //         "createdBy": null,
      //         "lastModifiedBy": null,
      //         "createdTS": null,
      //         "lastModifiedTS": null,
      //         "vendor": null,
      //         "rfq": null,
      //         "vendorUuid": "3b601125-e39d-483a-ada7-bed8794bc504",
      //         "vendorName": "soft world ltd",
      //         "vendorId": "SOF220508165632", "status_ui_display": "In Progress",
      //         "status": { "id": "102", "createdBy": "Harshitha", "lastModifiedBy": null, "createdTS": null, uiDisplay: 'New' }
      //     },
      // ]
  }

  getLineItemsByRFQ() {

      const obj = { "id": this.selectedRfqData.id }

      this.rfqservice.getItemsByRFQIdForGMT(obj).subscribe((res: any) => {
          if (Array.isArray(res)) {
              this.itemsList = res || [];
          }
      });

      // this.itemsList = [
      //     {
      //         brand
      //             :
      //             "Siemens",
      //         category
      //             :
      //             null,
      //         createdBy
      //             :
      //             null,
      //         createdTS
      //             :
      //             "2023-04-14T10:49:42.000+0000",
      //         description
      //             :
      //             "MCB 4POLE 30AMP-PR 592 - 15/07/2022 - 5170501005",
      //         id
      //             :
      //             "dc3565d7-895e-43cc-9609-0ea412787f3b",
      //         itemcode
      //             :
      //             null,
      //         lastModifiedBy
      //             :
      //             null,
      //         lastModifiedTS
      //             :
      //             "2023-04-14T10:49:42.000+0000",
      //         pritemId
      //             :
      //             "09f7f37f-4884-4bef-b548-5fb2553e89b1",
      //         quantity
      //             :
      //             25,
      //         remarks
      //             :
      //             null,
      //         serialNo
      //             :
      //             1001,
      //         totalamount
      //             :
      //             0,
      //         unitofMeasures
      //             :
      //             "Nos",
      //         unitprice
      //             :
      //             0
      //     }
      // ]
  }

  // Accept or Reject Vendor by CM
  onAcceptOrRejectVendor(rowData: any, isAccepted) {
      const obj = {
          "vendor": {
              "id": rowData.vendorUuid
          },
          "rfq": {
              "id": this.selectedRfqData.id
          },
      }
      if (isAccepted) {
          this.rfqservice.acceptVendorByCM(obj).subscribe((res: any) => {
              if (res && res.status == 'Success') {
                  this.toastrService.success('Vendor Request Accepted Successfully!', 'Success');
                  this.intialCall();
              } else {
                  this.toastrService.error(res.message, 'Error');
              }
          })
      } else {
          this.rfqservice.rejectVendorByCM(obj).subscribe((res: any) => {
              if (res && res.status == 'Success') {
                  this.toastrService.success('Vendor Request Rejected', 'Success');
                  this.intialCall();
              } else {
                  this.toastrService.error(res.message, 'Error');
              }
          })
      }
  }

  // ngOnDestroy(){
  //     this.dialogRef.afterCloseAll();
  // }

  onRiaseQueryOrIgnoreRFQ(rowData: any, isIgnored: boolean = false) {
      if (rowData.status_ui_display != 'Requested' && isIgnored) {
          this.toastrService.warning("Sorry, You're not allowed at this moment!", 'Warning')
          return false;
      } else {
          if (isIgnored == true) {
              const obj = [{
                  "vendor": {
                      "id": this.loggedUserDetails.org.id
                  },
                  "rfq": {
                      "id": rowData.id
                  }
              }]

              this.rfqservice.ignoreRFQByGTMVendor(obj).subscribe((res: any) => {
                  this.intialCall();
              })
          } else {
              this.selectedRfqData = rowData;
              this.queryDescContent = ''
              console.log('queryList', this.selectedRfqData.queryContent.split("|"))
              this.queryList = this.selectedRfqData.query ? this.selectedRfqData.query.split("|") : [];
              // this.queryList = "Hello|HI|How|Are|You!".split("|")

              this.dialog.open(this.raiseQueryRef, {
                  width: "30%",
                  minHeight: "250px",
                  data: "Su",
              }).afterClosed().subscribe((res: any) => {
                  this.queryDescContent = ''
              })

          }
      }
  }

  onRaiseQuery() {
      if (!this.queryDescContent) {
          this.toastrService.warning("Please Enter Query Details", 'Warning');
          return;
      }
      const queryData: string = "Hello|HI|How|Are|You!"
      const newQueryCont = this.selectedRfqData.query ? this.selectedRfqData.query.concat("|").concat(this.queryDescContent) : this.queryDescContent;
      const newQueryCont1 = queryData ? (queryData + '|') + (this.queryDescContent) : queryData;
      const obj = {
          "vendor": {
              "id": this.loggedUserDetails.org.id
          },
          "rfq": {
              "id": this.selectedRfqData.id
          },
          "query": newQueryCont
      };


      this.rfqservice.riaseQueryRFQByGTMVendor(obj).subscribe((res: any) => {
          if (res.status == 'Success') {
              this.toastrService.success(res.message, 'Success');
              this.dialog.closeAll();
              this.intialCall();
          } else {
              this.toastrService.warning(res.message, 'Warning');

          }
      })


  }

  onForwardRFQ(rowData:any){
      this.selectedRfqData = null;
      this.isSendRFQ =true;
      setTimeout(()=>{
          this.selectedRfqData = rowData;
      },100)

  }

  closeForwardRFQScreen(value){
      this.intialCall();
      this.selectedData = null;
      this.isSendRFQ = false;
  }

  getVendorInfo(rowData:any){
      this.selectedVendor = rowData;
      this.rfqservice.getVendorInfoById({id: rowData.vendorUuid}).subscribe((res:any)=>{
          if(res ){
              this.dialog.closeAll();
              this.vendorInfo = res;
              this.dialog.open(this.vendorInfoTemplate, {
                  width: "30%",
                  minHeight: "250px",
                  data: "Su",
              }).afterClosed().subscribe((res: any) => {
                  this.vendorInfo = null;
                  this.selectedVendor = null;
              })
          }
      })
  }
}

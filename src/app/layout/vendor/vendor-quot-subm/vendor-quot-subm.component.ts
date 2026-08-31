import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
 import { AppApiConfig } from 'src/app/shared/constants/app-api.config';
import { EncryDecryService } from 'src/app/shared/services';
import { VendorQuotService } from '../services/vendor-quot.service';
import { CorrespondenceComponent } from 'src/app/shared/modules/common-share/components/correspondence/correspondence.component';
import { QuotViewDetailsComponent } from 'src/app/shared/modules/common-share/components/quot-view-details/quot-view-details.component';
import { trigger, state, style, transition, animate } from '@angular/animations';

@Component({
  selector: 'app-vendor-quot-subm',
  templateUrl: './vendor-quot-subm.component.html',
  styleUrls: ['./vendor-quot-subm.component.scss'],
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
export class VendorQuotSubmComponent implements OnInit {

  quotDataList: any = [];
  selectedData: any;
  paginatoryDetails: any;
  selectedQuotData: any;
  pageRecordSize: any;
  pageOptions: any;
  quotId: any;
  defaultPermissions: any;
  loggedUserPermissions: any;
  expandedRows: {} = {};

  quotTableHeaders: any = [
    { field: 'quotationId', header: 'Quotation Id', isLink: false, width: '330px' },
    { field: 'description', header: 'Description', isLink: false, width: '280px' },
    // { field: 'quotationIteamId', header: 'quotation I Id'  , isLink: false},
    { field: 'vendorStatus', header: 'Status', isLink: false, width: '280px' },

    { field: 'createdTS', header: 'Creation Date', isLink: false, fieldType: 'date', width: '280px' }
  ];

  constructor(private dialog: MatDialog,
    private encryDecryService: EncryDecryService,
    private vendorServices: VendorQuotService,
    private modalDialog: MatDialog, ) { }

  ngOnInit() {
    this.pageRecordSize = AppApiConfig.GRID_PAGE_INFO.initpageSize;
    this.pageOptions = AppApiConfig.GRID_PAGE_INFO.pageOptions;
    this.defaultPermissions = AppApiConfig.DEFAULT_PERMISSIONS;
    const temp = JSON.parse(this.encryDecryService.get(localStorage.getItem('logData')));

    this.loggedUserPermissions = temp.details.listofPermission;


    this.getQuotationLists();
  }

  // getQuotationLists FROM REST CALL
  getQuotationLists() {
    const reqObj = {
      // "id":"d1a179df-8c9a-405d-a081-c4099ef422d6"
      'id': localStorage.getItem('orgId')
    };
    this.vendorServices
      .getAllQuotation(reqObj)
      .subscribe(data => {
        this.quotDataList = Array.isArray(data) ? data : [];
      });
    // console.log('this.pre', this.quotDataList);
  }

  // getQuotLine list
  getQuotLine(selectedRowData, event) {
    this.expandedRows = {};
    const thisRef = this;
    thisRef.expandedRows[selectedRowData.id] = 1;

    this.selectedData = [selectedRowData];
    this.selectedQuotData = Object.assign({}, selectedRowData);
    this.quotId = this.selectedQuotData.quotationId;
    console.log('event data', this.selectedQuotData.quotationId);
  }
  getCloseQuotLine() {
    this.expandedRows = {};
  }

  viewCorresspondance(rowData) {
    rowData['commentRootPath'] = 'QUOTES-COMMENTS-MODAL';
    const dialog = this.modalDialog.open(CorrespondenceComponent, { data: rowData,width: '60%', maxWidth: '40%',
    minHeight: 297 , maxHeight: '70vh'  });

    dialog.afterClosed().subscribe(result => {
      this.getQuotationLists();
    });
  }




  // IF quotDataList is available from rest call then comment below code
  //   quotDataList = [
  //       {
  //           "rfq_number":"1234",
  //           "rfqReceived_date":"15/05/2020",
  //           "status":"New",
  //           "rfqDue_date":"28/05/2020"
  //       },
  //       {
  //         "rfq_number":"4534",
  //         "rfqReceived_date":"14/05/2020",
  //         "status":"New",
  //         "rfqDue_date":"29/05/2020"
  //     }

  //   ]

  getLineItems(event) {
    // alert('helel');
    console.log('clicked tab lienitmes', event);

  }

  onPage(event) {
    this.paginatoryDetails = event;
  }


  viewQuotDetails(rowData) {

    const quotModalDialog = this.modalDialog.open(QuotViewDetailsComponent, { width: '80%', data: rowData });
  }

}

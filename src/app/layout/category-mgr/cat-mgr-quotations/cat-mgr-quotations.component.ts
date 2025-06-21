import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { CatProcuRequestsService } from '../services/cat-procu-requests.service';
import { AppConfig } from 'src/app/app.config';
import { CatProcuQuotationsService } from '../services';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { QuotViewDetailsComponent } from 'src/app/shared/modules/common-share/components/quot-view-details/quot-view-details.component';
import { trigger, state, style, transition, animate } from '@angular/animations';


@Component({
  selector: 'app-cat-mgr-quotations',
  templateUrl: './cat-mgr-quotations.component.html',
  styleUrls: ['./cat-mgr-quotations.component.scss'],
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
export class CatMgrQuotationsComponent implements OnInit  {
  quotationsList: any;
  selectedQuots: any;
  @ViewChild('h1')
  h1: ElementRef;
  quotTableHeaders: any = [
      { field: 'quotationId', header: 'Quotation Id'  , isLink: false, width: '240px', fieldType: 'text', isExceedContent: false},
      { field: 'companyName', header: 'Vendor Name' , isLink: false, width: '150px', fieldType: 'text', isExceedContent: true},
      { field: 'totalAmount', header: 'Total Amount'  , isLink: false, width: '150px', fieldType: 'text', isExceedContent: false},
    //   { field: 'createdBy', header: 'Submitted By' , isLink: false,width:'150px', fieldType: 'text', isExceedContent: false},
      { field: 'createdTS', header: 'Creation Date' , isLink: false, width: '205px', fieldType: 'date', isExceedContent: false}
  ];

  paginatoryDetails: any;


  selectedQuotData: any;
  rfqsList: Object;
  pageRecordSize: any;
  pageOptions: any;
  expandedRows: {} = {};


  constructor(
      private procuReqService: CatProcuRequestsService,
       private quotsService: CatProcuQuotationsService,
       private modalDialog: MatDialog) {}

  ngOnInit() {
      this.pageRecordSize = AppConfig.GRID_PAGE_INFO.initpageSize;
      this.pageOptions = AppConfig.GRID_PAGE_INFO.pageOptions;
      this.getQuotsList();
  }

  getQuotsList() {
      this.quotsService
          .getQuotsList()
          .subscribe(data => {
              this.quotationsList = Array.isArray(data) ? data : [];
              console.log('this.pre', this.quotationsList);
          });

  }

  // getRFQs list
  getRFQs(selectedQuots) {
    this.expandedRows = {};
    const thisRef = this;
    thisRef.expandedRows[selectedQuots.id] = 1;

      this.selectedQuots = [selectedQuots];
      this.selectedQuotData = Object.assign({}, selectedQuots);
      if(this.h1)
      this.h1.nativeElement.scrollIntoView({behavior: 'smooth'});
  }

  getCloseRFQs(selectedRowData, event) {
    this.expandedRows = {};
}

  getLineItems(event) {
      // alert('helel');
      console.log('clicked tab lienitmes', event);

  }

  onPage(event) {
      this.paginatoryDetails = event;
    }


    viewQuotDetails(rowData) {
        const quotModalDialog = this.modalDialog.open(QuotViewDetailsComponent,  {data: rowData, width: '80%'});
    }


}


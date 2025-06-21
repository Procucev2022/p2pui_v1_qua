import { Component, OnInit, Input, OnChanges } from '@angular/core';
import { CatProcuRequestsService } from '../../services/cat-procu-requests.service';
import { AppConfig } from 'src/app/app.config';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { VendorSearchComponent } from 'src/app/shared/modules/common-share/components/vendor-search/vendor-search.component';
import { ToastrService } from 'ngx-toastr';
import { CorrespondenceComponent } from 'src/app/shared/modules/common-share/components/correspondence/correspondence.component';
import { QuotViewDetailsComponent } from 'src/app/shared/modules/common-share/components/quot-view-details/quot-view-details.component';

@Component({
  selector: 'app-cat-mgr-quotations-sub-tab',
  templateUrl: './cat-mgr-quotations-sub-tab.component.html',
  styleUrls: ['./cat-mgr-quotations-sub-tab.component.scss']
})
export class CatMgrQuotationsSubTabComponent implements OnInit , OnChanges {



  @Input('rfqData') rfqData: any;
  @Input('rfqId') rfqId: any;
  quotsList: any =  [];
  selectedData: any;
  selectedQuotData: any;
  paginatoryDetails: any;
  pageRecordSize: any;
  pageOptions: any;
  constructor(private procuReqService: CatProcuRequestsService, private modalDialog: MatDialog, private toastService: ToastrService) { }
  quotsTableHeaders: any = [
    { field: 'quotationId', header: 'Quotation Id'  , isLink: false, width:'155px', fieldType: 'text'},
    { field: 'companyName', header: 'Vendor Name' , isLink: false, width:'155px', fieldType: 'text'},
    { field: 'totalAmount', header: 'Total Amount'  , isLink: false, width:'155px', fieldType: 'text'},
    { field: 'createdBy', header: 'Submitted By' , isLink: false, width:'155px', fieldType: 'text'},
    { field: 'createdTS', header: 'Creation Date' , isLink: false, width:'205px', fieldType: 'date'}
  ];



  ngOnInit() {
    this.pageRecordSize = AppConfig.GRID_PAGE_INFO.initpageSize;
    this.pageOptions = AppConfig.GRID_PAGE_INFO.pageOptions;
    this.getQuotationsByRfq();
  }

  getQuotationsByRfq() {
    this.quotsList  = [];
    const reqObj = {
      'id': this.rfqData.id
    };
    this.procuReqService.getQuotationsByRfq(reqObj).subscribe( (data: any[] ) => {
        if (Array.isArray(data)) {
          this.quotsList = data || [];
        } else {
          this.toastService.warning(data['errorMessage'], 'Warning');
          this.quotsList = [];
        }
    });
   }

   ngOnChanges() {
    if (this.rfqId) {
      this.getQuotationsByRfq();
    }
  }

  getRFQs(rowData) {
    this.selectedQuotData = rowData;
    this.selectedData = [rowData];
  }


  onPage(event) {
    this.paginatoryDetails = event;
  }

  sendRfqToVendors(rowData) {
    this.modalDialog.open(VendorSearchComponent, { data: rowData });
  }

  getTabData(event) {

  }

  viewCorresspondance(rowData) {
    rowData['commentRootPath'] = 'QUOTES-COMMENTS-MODAL';
    const dialog =  this.modalDialog.open(CorrespondenceComponent, { data: rowData ,width: '60%', maxWidth: '40%',
    minHeight: 297 , maxHeight: '70vh' });

    dialog.afterClosed().subscribe(result => {
            this.getQuotationsByRfq();
    });
}


viewQuotDetails(rowData) {
    if(( rowData.totalAmount && rowData.totalAmount != '' && rowData.totalAmount != 'null' )){
        const quotModalDialog = this.modalDialog.open(QuotViewDetailsComponent,
            {
              data: rowData,
              width: '80%'
            });
    }else{
        this.toastService.warning("Not allowed at this moment ", "Warning");
        return;
    }

}



}

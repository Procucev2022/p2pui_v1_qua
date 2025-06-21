import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { AppApiConfig } from 'src/app/shared/constants/app-api.config';
import { CorrespondenceComponent } from 'src/app/shared/modules/common-share/components/correspondence/correspondence.component';
import { EncryDecryService } from 'src/app/shared/services';
import { ViewRFQByIdModalComponent } from '../../vendor/components/view-rfq-by-id-modal/view-rfq-by-id-modal.component';
import { RfqService } from '../../vendor/services/rfq.service';

@Component({
  selector: 'app-cat-mgr-rfqs',
  templateUrl: './cat-mgr-rfqs.component.html',
  styleUrls: ['./cat-mgr-rfqs.component.scss']
})
export class CatMgrRfqsComponent implements OnInit {

  rfqDataList: any = [];
  selectedData: any = [];
  paginatoryDetails: any;
  pageRecordSize: any;
  pageOptions: any;
  defaultPermissions: any;
  loggedUserPermissions: any;
  viewRFQByIdData: any;

  rfqsTableHeaders: any = [
      { field: 'rfqId', header: 'RFQ Id', isLink: false,  width: '190px', fieldType: 'text' , isExceedContent: false},
      { field: 'description', header: 'Description', isLink: false,  width: '150px', fieldType: 'text' , isExceedContent: true},
      { field: 'numberOfItems', header: 'Number Of Items', isLink: false,  width: '160px', fieldType: 'text' , isExceedContent: false},
      { field: 'createdTS', header: 'Creation Date', isLink: false, fieldType: 'date',  width: '180px', isExceedContent: false},
      { field: 'rfqClosingDate', header: 'RFQ Due Date', isLink: false, fieldType: 'date',  width: '180px' , isExceedContent: false},
      { field: 'status', header: 'Status', isLink: false,  width: '150px', fieldType: 'text', isExceedContent: false }
  ];

  constructor(private dialog: MatDialog,
      private encryDecryService: EncryDecryService,
      private rfqservice: RfqService,
      private toastrService: ToastrService, ) { }

  ngOnInit() {
      this.pageRecordSize = AppApiConfig.GRID_PAGE_INFO.initpageSize;
      this.pageOptions = AppApiConfig.GRID_PAGE_INFO.pageOptions;
      this.defaultPermissions = AppApiConfig.DEFAULT_PERMISSIONS;
      const temp = JSON.parse(this.encryDecryService.get('perm', localStorage.getItem('logData')));
      this.loggedUserPermissions = temp.details.listofPermission;
      this.getRFQList();
  }

  getRFQList() {
    this.selectedData = [];
    this.rfqservice.getAllCategoryRFQdata().subscribe(data => {this.rfqDataList = data || []; });
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

    viewRFQByIdModal() {
        const dialogConfig = new MatDialogConfig();

        // dialogConfig.disableClose = true;
        dialogConfig.autoFocus = true;
        dialogConfig.data = this.viewRFQByIdData;
        dialogConfig.minWidth = 400;
        dialogConfig.minHeight = 500;
        dialogConfig.maxWidth = 'none';
        dialogConfig.width = '80%';
        const dialogRef = this.dialog.open(ViewRFQByIdModalComponent, dialogConfig).afterClosed().subscribe(result => {console.log(result); });
    }

    viewCorresspondance(rowData) {
      rowData['commentRootPath'] = 'CAT-RFQ-COMMENTS-MODAL';
      const dialog = this.dialog.open(CorrespondenceComponent, { data: rowData ,width: '60%', maxWidth: '40%',
      minHeight: 297 , maxHeight: '70vh' });

      dialog.afterClosed().subscribe(result => {
          // this.getRfqsByPr();
      });
  }

}

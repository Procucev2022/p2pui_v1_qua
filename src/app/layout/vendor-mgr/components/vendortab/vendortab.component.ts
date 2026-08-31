import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { AppConfig } from 'src/app/app.config';
import { VendorMgrService } from '../../services/vendor-mgr.service';
import { ToastrService } from 'ngx-toastr';
import { VendorViewModelService } from '../../services/vendor-view-model.service';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { VendorAssignRankModelComponent } from '../vendor-assign-rank-model/vendor-assign-rank-model.component';
import { EncryDecryService } from 'src/app/shared/services';
import { VendorViewModelComponent } from '../../../../shared/modules/common-share/components/vendor-view-model/vendor-view-model.component';

@Component({
  selector: 'app-vendortab',
  templateUrl: './vendortab.component.html',
  styleUrls: ['./vendortab.component.scss'],
  encapsulation:ViewEncapsulation.None
})
export class VendortabComponent implements OnInit {

  vendorNameRequestList: any;

    vendorsTableHeaders: any = [
        { field: 'vendorName', header: 'Name'  , isLink: true, width:'165px', titleHead: 'Vendor Name'},
        { field: 'companyId', header: 'Vendor ID',  width:'165px', titleHead: 'Vendor ID' },
        { field: 'vendorRank', header: 'Class'  , isLink: true, width:'145px', titleHead: 'Vendor Class'},
        { field: 'rfqSent', header: 'RFQs'  , isLink: false, width:'145px', titleHead: 'RFQs Sent'},
        { field: 'quotationsRecieved', header: 'Quotations' , isLink: false, width:'145px', titleHead: 'Quotations Recieved'},
        { field: 'pposGenerated', header: 'PPOS' , isLink: false, width:'145px', titleHead: 'PPOS Generated'},

    ];

    paginatoryDetails: any;


    pageRecordSize: any;
    pageOptions: any;
    vendorRegData: any;
  selectedData: any[] = [];
  loggedUserDetails: any;
  loggedUserPermissions: any;

    constructor(private vendMgrSer:VendorMgrService,
        private toaster: ToastrService,
         private vendorViewService: VendorViewModelService,
         private dialog:MatDialog,
         private encryDecryService: EncryDecryService) {}

    ngOnInit() {
        this.pageRecordSize = AppConfig.GRID_PAGE_INFO.initpageSize;
        this.pageOptions = AppConfig.GRID_PAGE_INFO.pageOptions;
        const temp =  JSON.parse(this.encryDecryService.get(localStorage.getItem('logData')) );
        this.loggedUserDetails = temp.details;

        this.loggedUserPermissions = this.loggedUserDetails.listofPermission;
        this.getAllVendorsByVendorApproved();
    }

    getAllVendorsByVendorApproved() {
      if(this.loggedUserDetails.role.roleName!=='VendorManager2') {
      this.vendMgrSer
                        .getAllVendorsByVendorApproved()
                        .subscribe(res => {
                          if (Array.isArray(res)) {
                            res.forEach(element => {
                              element['status'] = element['status']['uiDisplay'];
                            });
                            this.vendorNameRequestList = res;
                          }
                          });
                        } else { this.vendorNameRequestList = [];}
    }


    onPage(event) {
        this.paginatoryDetails = event;
      }

    viewVendor(data) {
        const temp = {
            id: data.id
          };
          this.vendorViewService.getVendorById(temp).subscribe((res:any) => {

            if (res) {
              this.vendorRegData = res;
              this.viewVendorModal();
            } else {
              this.toaster.error('Failed to Fetch data', 'Failure');
            }
          });
    }

        viewVendorModal() {
        const dialogConfig = new MatDialogConfig();

        dialogConfig.autoFocus = false;
        dialogConfig.data = this.vendorRegData;
        dialogConfig.minHeight = 500;
        // dialogConfig.minWidth = '962px !important'
          dialogConfig.width = '80%';
          dialogConfig.maxWidth = 'none';
        const dialogRef = this.dialog.open(VendorViewModelComponent, dialogConfig);

        dialogRef.afterClosed().subscribe(result => {
          console.log(result);
        });
      }

      AssignRank() {
        const dialogConfig = new MatDialogConfig();

        dialogConfig.autoFocus = false;
        dialogConfig.data = this.selectedData;
        dialogConfig.height = '40%';
        dialogConfig.width = '50%';
        // dialogConfig.minWidth = '962px !important'

        const dialogRef = this.dialog.open(VendorAssignRankModelComponent, dialogConfig);

        dialogRef.afterClosed().subscribe(result => {
          console.log(result);
        });
      }

}


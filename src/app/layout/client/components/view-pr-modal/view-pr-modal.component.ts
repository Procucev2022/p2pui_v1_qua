import { Component, OnInit, ViewEncapsulation, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AppApiConfig } from 'src/app/shared/constants/app-api.config';
import { AppConfig } from 'src/app/app.config';
import { EncryDecryService } from 'src/app/shared/services';

@Component({
  selector: 'app-view-pr-modal',
  templateUrl: './view-pr-modal.component.html',
  styleUrls: ['./view-pr-modal.component.scss'],
  encapsulation:ViewEncapsulation.None
})
export class ViewPrModalComponent implements OnInit {

    //viewPrByIdList: any = [];
    selectedData: any;
  selectedPRData: any;
  paginatoryDetails: any;
  pageRecordSize: any;
  pageOptions: any;
  modalGridpageOptions: any;
  modalGridpageRecordSize: any;
  loggedUserPermissions: any;
  defaultPermissions;
    loggedUser: any;

  constructor( private encryDecryService: EncryDecryService,
      private dialogRef: MatDialogRef<ViewPrModalComponent>,
    @Inject(MAT_DIALOG_DATA) data) {
        this.viewPrByIdList = [
            {
                "id":data.id,
                "deptName":data.deptName,
                "estimatedPrvalue":data.estimatedPrvalue,
                "futureRequirement":data.futureRequirement,
                "prCorrespond":data.prCorrespond,
                "rateCardAvailable":data.rateCardAvailable
            }

        ]
        console.log(data)
      }

      viewPrByIdList
      viewPRByIdDetailHeaders: any = [
        { field: 'id', header: 'id', isLink: false },
        { field: 'deptName', header: 'Department Name', isLink: false },
        { field: 'estimatedPrvalue', header: 'Estimated PR Value', isLink: false },
        { field: 'futureRequirement', header: 'Future Requirements' },
        { field: 'prCorrespond', header: 'PR Correspond', isLink: false },
        { field: 'rateCardAvailable', header: 'Rate Card Available', isLink: false }

      ]

  closeDialog(){
    this.dialogRef.close({event:'Cancel'});
  }


  ngOnInit() {
    this.pageRecordSize = AppApiConfig.GRID_PAGE_INFO.initpageSize;
    this.pageOptions = AppApiConfig.GRID_PAGE_INFO.pageOptions;
    this.defaultPermissions = AppApiConfig.DEFAULT_PERMISSIONS;
    let temp = JSON.parse(this.encryDecryService.get(localStorage.getItem('logData')));
    this.loggedUser = temp.details;
    this.loggedUserPermissions = temp.details.listofPermission;

    this.modalGridpageRecordSize = AppConfig.GRID_PAGE_INFO.initpageSize;
    this.modalGridpageOptions = AppConfig.GRID_PAGE_INFO.pageOptions;
  }

}

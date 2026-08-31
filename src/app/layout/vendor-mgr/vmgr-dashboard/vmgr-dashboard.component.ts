import { Component, OnInit, ViewChild } from '@angular/core';
import { VendortabComponent } from '../components/vendortab/vendortab.component';
import { VendorRegistrationPendingComponent } from '../components/vendor-registration-pending/vendor-registration-pending.component';
import { ApprovalpendingTabComponent } from '../components/approvalpending-tab/approvalpending-tab.component';
import { EncryDecryService } from 'src/app/shared/services';
import { AppApiConfig } from 'src/app/shared/constants/app-api.config';
import { VendorRejectedComponent } from '../components/vendor-rejected/vendor-rejected.component';

@Component({
  selector: 'app-vmgr-dashboard',
  templateUrl: './vmgr-dashboard.component.html',
  styleUrls: ['./vmgr-dashboard.component.scss']
})
export class VmgrDashboardComponent implements OnInit {

  @ViewChild(VendortabComponent) private VenTab: VendortabComponent;
  @ViewChild(VendorRegistrationPendingComponent) private venRegTab: VendorRegistrationPendingComponent;
  @ViewChild(ApprovalpendingTabComponent) private venPendTab: ApprovalpendingTabComponent ;
  @ViewChild(VendorRejectedComponent) private venRejectedTab: VendorRejectedComponent;
  defaultPermissions: any;
  loggedUserPermissions: any;


  constructor(private encryDecryService: EncryDecryService) { }

  ngOnInit() {
    this.defaultPermissions = AppApiConfig.DEFAULT_PERMISSIONS;
        let temp =  JSON.parse(this.encryDecryService.get(localStorage.getItem('logData')) );

        this.loggedUserPermissions = temp.details.listofPermission;
  }

  onTabClick(event){
    let i = event.index;
    // if(i == 0){
    //   this.VenTab.getAllVendorsByVendorApproved();
    // }
    // if(i == 1){
    //   this.venPendTab.getAllVendorsByVendorApprovalPending()
    // }
    // if(i == 2){
    //   this.venRegTab.getVendorPendingRegistrationData();
    // }
    // if(i == 3){
    //     this.venRejectedTab.getVendorRejectedData();
    // }
  }

}

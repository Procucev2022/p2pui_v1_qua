import { Component, OnInit, Input } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AppApiConfig } from 'src/app/shared/constants/app-api.config';
import { EncryDecryService } from 'src/app/shared/services';
import { ClientLinkingToItemModalComponent } from '../client-linking-to-item-modal/client-linking-to-item-modal.component';
import { CategoryService } from '../services/category.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-linked-client-list',
  templateUrl: './linked-client-list.component.html',
  styleUrls: ['./linked-client-list.component.scss']
})
export class LinkedClientListComponent implements OnInit {

  @Input('itemData') itemData;
  paginatoryDetails: any;
  clientHeaders = [
    { field: 'clientName',  header: 'Client Name',  isLink: false, width: '220px', fieldType: 'text' },
    { field: 'clientItemCode',  header: 'Client Item Code',  isLink: false, width: '220px', fieldType: 'text' },
    { field: 'monthlyConsumpution',  header: 'Monthly Consumption',  isLink: false, width: '220px', fieldType: 'text' },
    { field: 'clientAnualConsum',  header: 'Annual Consumption ',  isLink: false, width: '220px', fieldType: 'text' }
  ];
  clientList = [];
  selectedData = [];
  defaultPermissions: any;
  loggedUserDetails: any;
  loggedUserPermissions: any;
  pageRecordSize: number;
  pageOptions: number[];
  roleName:any;
  constructor(private encryDecryService: EncryDecryService,
    private modalDialog: MatDialog, private catService: CategoryService, private toastr: ToastrService) { }

  ngOnInit() {
    this.getLinkedClientListByItemId();
    this.defaultPermissions = AppApiConfig.DEFAULT_PERMISSIONS;
    const temp = JSON.parse(
      this.encryDecryService.get('perm', localStorage.getItem('logData'))
    );
    this.loggedUserDetails = temp.details;
    this.roleName = this.loggedUserDetails.role.roleName;
    this.loggedUserPermissions = this.loggedUserDetails.listofPermission;
    this.pageRecordSize = AppApiConfig.GRID_PAGE_INFO.initpageSize;
    this.pageOptions = AppApiConfig.GRID_PAGE_INFO.pageOptions;
  }

  linkNewClientToItems() {
    this.modalDialog.open(ClientLinkingToItemModalComponent,  {
      width: '70%',
      maxHeight: '90vh',
      data: this.itemData
    }).afterClosed().subscribe((res) => {
      if (res['event'] === 'linked') {
        this.getLinkedClientListByItemId();
      }
    });
  }

  getLinkedClientListByItemId() {

    this.catService.getLinkedClientByItemId({id: this.itemData.id}).subscribe((res) => {
      if (Array.isArray(res)) {
        this.clientList = res;
      }
    });
  }

}

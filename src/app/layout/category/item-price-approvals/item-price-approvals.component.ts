import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { AppConfig } from 'src/app/app.config';
import { AppApiConfig } from 'src/app/shared/constants/app-api.config';
import { EncryDecryService } from 'src/app/shared/services';
import { CategoryService } from '../services/category.service';

@Component({
  selector: 'app-item-price-approvals',
  templateUrl: './item-price-approvals.component.html',
  styleUrls: ['./item-price-approvals.component.scss']
})
export class ItemPriceApprovalsComponent implements OnInit {
    itemApprovalsList: any[] = [];
    selectedData:any;
    itemHeaders = [
      { field: 'description', header: 'Item Description', isLink: false,  width: '150px',  fieldType: 'text', isExceedContent: true},
      { field: 'vendorName', header: 'Vendor Name', isLink: false,  width: '150px',  fieldType: 'text', isExceedContent: true},
      { field: 'pricePerUnit', header: 'Price Per Unit', isLink: false,  width: '150px',  fieldType: 'text', isExceedContent: false},
      { field: 'status', header: 'Status', isLink: false,  width: '130px',  fieldType: 'text', isExceedContent: false},
      { field: 'createdTS', header: 'Creation Date', isLink: false,  width: '130px',  fieldType: 'date', isExceedContent: false},
    ];
      pageRecordSize: any;
      pageOptions: any;
      paginatoryDetails: any;
    defaultPermissions: any;
    loggedUserDetails: any;
    loggedUserPermissions: any;
  constructor(private catService: CategoryService,private toaster: ToastrService,private encryDecryService: EncryDecryService) { }

  ngOnInit() {
    this.pageRecordSize = AppConfig.GRID_PAGE_INFO.initpageSize;
    this.pageOptions = AppConfig.GRID_PAGE_INFO.pageOptions;
    this.defaultPermissions = AppApiConfig.DEFAULT_PERMISSIONS;
    const temp = JSON.parse(
      this.encryDecryService.get('perm', localStorage.getItem('logData'))
    );
    this.loggedUserDetails = temp.details;
    this.loggedUserPermissions = this.loggedUserDetails.listofPermission;
    this.getAllApprovalItem()
  }

    getAllApprovalItem() {
        this.catService.getAllItemPriceApprovals().subscribe((res) => {
        if (Array.isArray(res)) {
            this.itemApprovalsList = []
            res.forEach((data) => {
                data['status'] = data.status.uiDisplay
                this.itemApprovalsList.push(data)
            })
        } else {
            this.itemApprovalsList = []
        }
        });
    }

    onPage(event) {
        this.paginatoryDetails = event;
    }

    approve(data){
        console.log(data);
        let obj = {
            id : data.id,
            item:{
              "id": data.itemId
            },
            vendor:{
              "id": data.vendorId
            },
            pricePerUnit:data.pricePerUnit,
            approvedBy: this.loggedUserDetails.username,
            // approvedTime: new Date().toLocaleString()
        }
        this.catService.approveItemPrice(obj).subscribe((res) => {
            this.successCallBack(res)
        })
    }

    successCallBack(res: any) {
        if(res.status == "Success"){
            this.toaster.success(res.message, 'Success')
        }else{
            this.toaster.error(res.message, 'Error')
        }
        this.getAllApprovalItem()
    }

}

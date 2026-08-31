import { Component, OnInit } from '@angular/core';
import { AppApiConfig } from 'src/app/shared/constants/app-api.config';
import { EncryDecryService } from 'src/app/shared/services';
import { CategoryService } from '../../category/services/category.service';

@Component({
    selector: 'app-dynamic-pricing-items',
    templateUrl: './dynamic-pricing-items.component.html',
    styleUrls: ['./dynamic-pricing-items.component.scss'],
})
export class DynamicPricingItemsComponent implements OnInit {
    roleName:any;
    loggedUserDetails:any;
    itemPricingTableHeaders: any = [
        {
            field: 'itemNumber',
            header: 'Item Number',
            isLink: true,
            width: '120px',
            fieldType: 'text',
        },
        {
            field: 'description',
            header: 'Description',
            isLink: false,
            width: '320px',
            fieldType: 'text',
        },
        {
            field: 'specification',
            header: 'Brand',
            isLink: false,
            width: '160px',
            fieldType: 'text',
        },
        {
            field: 'dynamicPricingEnabled',
            header: 'Is Dynamic Pricing Enabled?',
            isLink: false,
            width: '160px',
            fieldType: 'text',
        },
    ];
    itemsList: any = [];
    paginatoryDetails: any;
    pageRecordSize: any;
    pageOptions: any;
    expandedRows: {} = {};
    selectedData: any = [];
    defaultPermissions: any;
    loggedUserPermissions: any;
    linkedVendorListByItem: any[];
    
    vendorHeaders = [
        {
            field: 'vendorName',
            header: 'Vendor Name',
            isLink: false,
            width: '160px',
            fieldType: 'text',
        },
        {
            field: 'city',
            header: 'City',
            isLink: false,
            width: '90px',
            fieldType: 'text',
        },
        {
            field: 'rank',
            header: 'Rank',
            isLink: false,
            width: '60px',
            fieldType: 'text',
        },
        {
            field: 'uom',
            header: 'UOM',
            isLink: false,
            width: '90px',
            fieldType: 'text',
        },
        {
            field: 'pricePerUnit',
            header: 'Price Per Unit',
            isLink: false,
            width: '90px',
            fieldType: 'text',
        },
        {
          field: 'vDynamicPricingEnabled',
          header: 'Is Dynamic Pricing Enabled?',
          isLink: false,
          width: '120px',
          fieldType: 'text',
      },

    ];
  

    constructor(
        private encryDecryService: EncryDecryService,
        private catService: CategoryService
    ) {}

    ngOnInit() {
        this.pageRecordSize = AppApiConfig.GRID_PAGE_INFO.initpageSize;
        this.pageOptions = AppApiConfig.GRID_PAGE_INFO.pageOptions;
        this.defaultPermissions = AppApiConfig.DEFAULT_PERMISSIONS;
        const temp = JSON.parse(
            this.encryDecryService.get(localStorage.getItem('logData'))
        );
        this.loggedUserDetails = temp.details;
        this.roleName = this.loggedUserDetails.role.roleName;
        this.loggedUserPermissions = temp.details.listofPermission;
        this.getDynamicPricingItems();
    }

    getDynamicPricingItems() {
        if(this.roleName != 'VendorManager'){
            this.catService.getDynamicPricingItemsForCM().subscribe((res: any) => {
                if (Array.isArray(res)) {
                    res.forEach((ele) => {
                            ele.dynamicPricingEnabled = ele.dynamicPricingEnabled === true ? 'Yes' : 'No';
                            this.itemsList.push(ele);
                        });
                    }
                });
        }else{
           this.catService.getDynamicPricingItems().subscribe((res: any) => {
            if (Array.isArray(res)) {
                res.forEach((ele) => {
                        ele.dynamicPricingEnabled = ele.dynamicPricingEnabled === true ? 'Yes' : 'No';
                        this.itemsList.push(ele);
                    });
                }
            }); 
        }
        
    }

    getVendorsByItem(rowData, event) {
        this.selectedData = rowData;
        this.linkedVendorListByItem = [];
        const obj = {
            id: rowData.id,
        };
        this.catService.getVendorsByItem(obj).subscribe((res) => {
            if (res && Array.isArray(res)) {
                this.linkedVendorListByItem = [];
                for (let i = 0; i < res.length; i++) {
                    const data = res[i];
                    data['uom'] = data['uom']['description'];
                    data['status'] = data.status ? data['status']['uiDisplay'] : '';
                    data['vDynamicPricingEnabled'] = data['vDynamicPricingEnabled'] === true ? 'Yes' : 'No';
                    this.linkedVendorListByItem.push(data);
                }
            }
        });
    }

    getCloseVendors(rowData, event) {}
}

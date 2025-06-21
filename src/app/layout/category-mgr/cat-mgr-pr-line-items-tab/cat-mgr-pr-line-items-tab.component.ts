import { Component, OnInit, Input, OnChanges, EventEmitter, Output } from '@angular/core';
import { CatProcuRequestsService } from '../services/cat-procu-requests.service';
import { AppConfig } from 'src/app/app.config';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { LinkedPrPpoCreateComponent } from 'src/app/shared/modules/common-share/components/linked-pr-ppo-create/linked-pr-ppo-create.component';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-cat-mgr-pr-line-items-tab',
  templateUrl: './cat-mgr-pr-line-items-tab.component.html',
  styleUrls: ['./cat-mgr-pr-line-items-tab.component.scss']
})
export class CatMgrPrLineItemsTabComponent implements OnInit , OnChanges {


  @Input('prData') prData: any;
  @Input('prId') prId: any;
  @Output() ppoCreated = new EventEmitter<{ created: boolean }>();
  prLineItemsList: any =  [];
  paginatoryDetails: any;
  pageRecordSize: any;
  pageOptions: any;
  selectedData: any[] = [];
  linkendFilterValue: any;
  linkedPrValues = ['All', 'Catalogue items', 'Non-catalogue items'];
  tempPrLineItemsList: any[];
  procucevItemCode: any;
    nonSelectedLinkItem: any;
  constructor(private procuReqService: CatProcuRequestsService, private modalDialog: MatDialog, private toast: ToastrService) { }
  prLineItemsTableHeaders: any = [
    { field: 'serialNo', header: 'S.No', isLink: false, width: '80px' , isExceedContent: false},
    { field: 'description', header: 'Item Description'  , isLink: false, width: '225px', isExceedContent: true},
      { field: 'brand', header: 'Specifications'  , isLink: false, width: '140px', isExceedContent: true},
      { field: 'unitofMeasures', header: 'UOM'  , isLink: false, width: '100px', isExceedContent: false},
      { field: 'quantity', header: 'Quantity'  , isLink: false, width: '100px', isExceedContent: false},
      { field: 'linkedItemPrice', header: 'Price'  , isLink: false, width: '140px', isExceedContent: false},
      { field: 'vendorName', header: 'Vendor Name'  , isLink: false, width: '140px', isExceedContent: false},
      // { field: 'createdTS', header: 'Creation Date.'  , isLink: false, width:'205px'},
      // { field: 'createdBy', header: 'created By'  , isLink: false, width:'140px'},
  ];

  ngOnInit() {
      this.linkendFilterValue = undefined;
    this.pageRecordSize = AppConfig.GRID_PAGE_INFO.initpageSize;
    this.pageOptions = AppConfig.GRID_PAGE_INFO.pageOptions;
    this.getLineItems();
  }

  getLineItems() {
    const reqObj = {
      'id': this.prData.id
    };
    this.procuReqService.getLineItemsByPr(reqObj).subscribe( (data: any[] ) => {
      if (data && Array.isArray(data)) {
        this.prLineItemsList = data || [];
        this.tempPrLineItemsList = data || [];
      }
    });
   }

   filterPrList() {
       if (this.linkendFilterValue === 'Catalogue items') {
           this.prLineItemsList = [];
           this.tempPrLineItemsList.forEach(element => {
               if (element.linkedItemStatus) {
                   this.prLineItemsList.push(element);
               }
           });
       } else if (this.linkendFilterValue === 'Non-catalogue items') {
        this.prLineItemsList = [];
        this.tempPrLineItemsList.forEach(element => {
            if (!element.linkedItemStatus) {
                this.prLineItemsList.push(element);
            }
        });
       } else {
           this.prLineItemsList = this.tempPrLineItemsList;
       }
   }

   createPpo() {
       let itemCheck = false;
       this.selectedData.forEach(element => {
           if (!element.linkedItemStatus) {
               itemCheck = true;
            this.toast.error('Please select catalogue items only', 'Failed');
            return;
           }
       });
       if (!itemCheck) {
        let quotTotal = 0;
        this.selectedData.forEach(element => {
             quotTotal = quotTotal + (element.id ? element.linkedItemPrice * element.quantity : 0);
         });
         setTimeout(() => {
           const ppoData = {
             'prId':  this.prData,
             'ppoitems': this.selectedData,
             'ppoValue': quotTotal
           };
           const dialog =  this.modalDialog.open(LinkedPrPpoCreateComponent, { data: ppoData, width: '80%', height: '80%' });

           dialog.afterClosed().subscribe(result => {
              if (result.event === 'ppoCreated') {
                this.ppoCreated.emit({ created: true });
              }
             this.selectedData = [];
            });

         }, 100);
       }
   }


   ngOnChanges() {
     if (this.prId) {
      this.getLineItems();
     }
  }

  onPage(event) {
    this.paginatoryDetails = event;
  }

  onLinkNow(link, data) {
      this.nonSelectedLinkItem = data;
    const  config: MatDialogConfig = {
       width: ' 762px'
     };
   const dialog =  this.modalDialog.open(link, config);
    dialog.afterClosed().subscribe(result => {
     });
  }

  onlinkNowSubmit() {
      const obj = {
          'id': this.nonSelectedLinkItem.id,
          'procucevItemCode': this.procucevItemCode
        };
    this.procuReqService.linkNowReq(obj).subscribe((data) => {
        this.successCallBack(data);
    });
  }
  successCallBack(data: any) {
    if (data.status === 'Success') {
        this.toast.success(data.message, 'Success');
    } else {
        this.toast.error(data.message, 'Error');
    }
    this.modalDialog.closeAll();
    this.getLineItems();
}

}

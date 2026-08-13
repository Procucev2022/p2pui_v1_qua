import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { CatProcuRequestsService } from 'src/app/layout/category-mgr/services';
import { CategoryService } from 'src/app/layout/category/services/category.service';
import { CreateAuctionModalComponent } from '../create-auction-modal/create-auction-modal.component';

@Component({
    selector: 'app-capex-cat-mgr-quote-compar',
    templateUrl: './capex-cat-mgr-quote-compar.component.html',
    styleUrls: ['./capex-cat-mgr-quote-compar.component.scss']
})
export class CapexCatMgrQuoteComparComponent implements OnInit {
    prList_forAll: any = [];
    showQuoteComp: boolean;
    quoteComGeneratedData: any;
    finalPPOData: any = [];
    selectedPrStatus: any;
    isPageLoad: boolean;
    constructor(private modalDialog: MatDialog, private procService: CatProcuRequestsService,
        private toastrService: ToastrService, private catService: CategoryService) { }

    selectedPr: any;
    itemArray: any = [];
    vendorColHeaders: any = [];
    itemRowHeaders: any = [];
    filteredprList: any = [];
    prList: any[] = [];
    quoteCompareItemList: any = [];
    displayMessageTextBox: boolean;
    ngOnInit() {
        this.getPrsListForAll();
        this.displayMessageTextBox = false;
    }

    filterPr(event) {
        console.log('test...', event.query)
        // in a real application, make a request to a remote url with the query and return filtered results, for demo we filter at client side
        const filtered: any[] = [];
        const query = event.query.trim();
        for (let i = 0; i < this.prList.length; i++) {
            const prItem = this.prList[i];
            if (prItem.prId && prItem.prId.toLowerCase().includes(query.toLowerCase())) {
                filtered.push(prItem);
            }
        }
        this.filteredprList = filtered;
        if(this.filteredprList.length==1){
            console.log('list ', this.filteredprList[0]);
            this.selectedPr = this.filteredprList[0];
        }
    }


    getPrsListForAll() {
        this.procService.getCapexPRidsList().subscribe((res) => {
            if (Array.isArray(res)) {
                this.prList_forAll = res;
            } else {
                this.prList_forAll = [];
            }
            this.prList = this.prList_forAll;
        });


    }

    createQuoteComparision() {

        this.showQuoteComp = false;
        this.itemArray = [];
        this.vendorColHeaders = [];
        this.itemRowHeaders = [];
        if (true) {
            const requestObj = {
                "id": this.selectedPr.id.trim()
            }
            this.catService.createQuoteComparisionCAPEX(requestObj).subscribe((res: any) => {
                this.quoteComGeneratedData = res;
                this.quoteComGeneratedData.vendorHeaders.forEach(element => {
                    element['quoteId'] = 'quoteId_perUnit_' + element.vendorId; 2
                    const x = { ...element }
                    this.quoteComGeneratedData.vendorHeaders.push({ ...x, 'quoteId': 'quoteId_perQty_' + element.vendorId })
                    this.quoteComGeneratedData.totalItems.forEach((element: any) => {
                        element['pricePerUnit'] = isNaN(element['pricePerUnit']) ? 0 : parseInt(element['pricePerUnit']);
                        element['quantity'] = isNaN(element['quantity']) ? 0 : parseInt(element['quantity']);
                        // element['quantity'] = 10;
                    });
                });
                setTimeout(() => {
                    this.itemArray = this.quoteComGeneratedData.totalItems;
                    this.vendorColHeaders = this.quoteComGeneratedData.itemsHeaders;
                    this.itemRowHeaders = this.quoteComGeneratedData.totalItems;
                    this.showQuoteComp = true;
                }, 300);
            })

        } else {
            // this.toastr.warning("Items OR Linked Vendors not selected/available..!", "Warning")
        }
    }

    updateQuoteComparisonData(event) {

    }


    onCreate(actionType) {
        this.displayMessageTextBox = true;
        this.finalPPOData = [];
        let quotTotal = 0;
        let excludetax = 0;
        const selectedItems = [];
        this.itemArray.forEach(element => {

            if (element.isActive) {
                selectedItems.push(element);
                if (element.pritemId !== 'quotTotId123') {
                    excludetax = excludetax + (element.id ? element.excludetaxamount : 0);
                    quotTotal = quotTotal + (element.id ? element.totalamount : 0);
                    this.finalPPOData.push(element);
                }
            }
            // console.log('items array '+this.itemArray)
        });

        // if (selectedItems.length >= this.itemRowHeaders.length - 3) {
        //   for (let i = 0; i < selectedItems.length; i++) {
        //     if (selectedItems[i].description !== 'BasicAmount' && selectedItems[i].description !== 'GSTValue' &&
        //     selectedItems[i].description !== 'total') {
        //       if (!this.checkL1Selected(selectedItems[i])) {
        //         this.displayMessageTextBox = true;
        //         break;
        //       }
        //     }
        //   }
        // } else {
        //   this.displayMessageTextBox = true;
        // }
        // if (this.finalPPOData.length === 0 && actionType === 'PPO') {
        //   this.toastrService.warning('Please select the items & create PPO', 'Warning');
        //   return;
        // }
        console.log('this.finalPPOData', this.finalPPOData);

        console.log('final PPO', this.finalPPOData);
        console.log('final PPO quotTotal', quotTotal);


        console.log('final PPO', this.finalPPOData);
        console.log('final PPO quotTotal', quotTotal);

        // if (actionType === 'PPO') {
        //   setTimeout(() => {
        //     const ppoData = {
        //       'ppoValue': quotTotal,
        //       'rfq':  '',// tbd
        //       'prId': this.selectedPr.id,
        //       'ppoitems': this.finalPPOData,
        //       'prData': this.prList.filter(item => item.id  === this.selectedPr.id)[0],
        //       'pposVendors': this.vendorColHeaders,
        //       'displayMessageTextBox': this.displayMessageTextBox
        //     };
        //     const dialog =  this.modalDialog.open(PpoCreateComponent, { data: ppoData, width: '80%', height: '80%' });

        //     dialog.afterClosed().subscribe(result => {
        //       this.displayMessageTextBox = false;
        //      });

        //   }, 100);
        // }

        if (actionType === 'Auction') {
            const ppoData = {
                'ppoValue': quotTotal,
                'prId': '' ,//this.selectedPr.id,
                'ppoitems': [], // tbd
                'vendorsList': this.vendorColHeaders,
                'prItemsList': this.itemRowHeaders,
                'prData': this.prList.filter(item => item.id === this.selectedPr.id)[0],
                'quotCompareCategory': '',// tbd
                'quotCompareRFQId': '',// tbd
                'rfqList': [],// tbd
                'isAdd': true,
                'isCapex': true
            };
            const config: MatDialogConfig = {
                width: '80%',
                maxWidth: 'none',
                data: ppoData
            };
            const actionDialogue = this.modalDialog.open(CreateAuctionModalComponent, config);
        }

    }

    resetContainer() {
        this.vendorColHeaders = [];
        this.itemRowHeaders = [];
        this.itemArray = [];
    }
    prChange(event) {
        this.selectedPr = event;
        console.log(event);
        this.prList.forEach(ele => {
            if (this.selectedPr.id === ele.id) {
                this.selectedPrStatus = ele.Status;
            }
        });
        this.procService.getVendorsByPRIdForCapex(this.selectedPr);
        this.resetContainer();

    }

}

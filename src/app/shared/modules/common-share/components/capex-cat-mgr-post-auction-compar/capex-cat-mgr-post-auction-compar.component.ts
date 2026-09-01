import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { CatProcuRequestsService } from 'src/app/layout/category-mgr/services';
import { CategoryService } from 'src/app/layout/category/services/category.service';
import { AppApiConfig } from 'src/app/shared/constants/app-api.config';
import * as xlsx from 'xlsx';
import { ClientService } from 'src/app/layout/client/services/client-service.service';
import { EncryDecryService } from 'src/app/shared/services';
import { PpoCreateComponent } from '../ppo-create/ppo-create.component';
@Component({
    selector: 'app-capex-cat-mgr-post-auction-compar',
    templateUrl: './capex-cat-mgr-post-auction-compar.component.html',
    styleUrls: ['./capex-cat-mgr-post-auction-compar.component.scss']
})
export class CapexCatMgrPostAuctionComparComponent implements OnInit {
    prList_forAll: any = [];
    showQuoteComp: boolean;
    quoteComGeneratedData: any;
    finalPPOData: any = [];
    selectedPrStatus: any;
    isPageLoad: boolean;
    pageRecordSize: any;
    pageOptions: any;
    auctionCategoryList: any;
    selectedAuc: any[];
    auctionWiseList: any[];
    filteredAuctionList: any[];
    selectedAucType: any;
    viewPrByData: any;
    itemData: any;
    auctionDetails: any;
    @ViewChild('exportTable') exportTable: ElementRef;
    prId: any;
    selectedVendor:any;
    loggedUserDetails: any;
    loggedUserPermissions: any;
    constructor(private modalDialog: MatDialog, private procService: CatProcuRequestsService,
        private toastrService: ToastrService,   private clientService: ClientService,
         private encryDecryService: EncryDecryService) {
        this.pageRecordSize = AppApiConfig.GRID_PAGE_INFO.initpageSize;
        this.pageOptions = AppApiConfig.GRID_PAGE_INFO.pageOptions;

        const temp = JSON.parse(this.encryDecryService.get(localStorage.getItem('logData')));
        this.loggedUserDetails = temp.details;
        this.loggedUserPermissions = this.loggedUserDetails.listofPermission;
    }

    selectedAucCategoryId:any;
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
        // in a real application, make a request to a remote url with the query and return filtered results, for demo we filter at client side
        const filtered: any[] = [];
        const query = event.query;
        for (let i = 0; i < this.prList.length; i++) {
            const prItem = this.prList[i];
            if (prItem.prId && prItem.prId.toLowerCase().includes(query.toLowerCase())) {
                filtered.push(prItem);
            }
        }
        this.filteredprList = filtered;
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
    prChange(event) {
        this.selectedPr = event;
        console.log(event);
        this.prList.forEach(ele => {
            if (this.selectedPr.id === ele.id) {
                this.selectedPrStatus = ele.Status;
            }
        });
        this.getData();
    }

    successCallBack(data) {
        console.log(data);
        this.auctionCategoryList = data;
    }
    auctionIdChange(data) {
        this.selectedAuc = [];
        this.auctionWiseList = [];
        this.filteredAuctionList = [];
        console.log(data);
        console.log(this.selectedAucCategoryId);
        this.auctionCategoryList.forEach(element => {
            if (element.id === this.selectedAucCategoryId) {
                this.selectedAuc = element;
                if (element.auctionCategory === 'rfq total wise') {
                    this.selectedAucType = element.auctionCategory;

                        this.clientService.getCapexExcelSummary(element).subscribe((res: any) => {
                            this.itemData = res;
                        })


                } else {

                    this.clientService.getCapexExcelSummary(element).subscribe((res: any) => {
                        this.itemData = res;
                    })

                }
            }
        });
    }


    exportAsXLSX(): void {
        const ws: xlsx.WorkSheet =
            xlsx.utils.table_to_sheet(this.exportTable.nativeElement);
        const wb: xlsx.WorkBook = xlsx.utils.book_new();
        xlsx.utils.book_append_sheet(wb, ws, 'Sheet1');
        const filename = 'sample_' + new Date().getTime() + '.xlsx';
        xlsx.writeFile(wb, filename);
    }
    getData() {

        const temp = {
            id: this.selectedPr.id
        };
        this.clientService.getPrById(temp).subscribe((res: any) => {

            if (res) {
                this.viewPrByData = res;
                console.log('this.viewPrByData', this.viewPrByData);
                const reqObj = {
                    'id': this.prId
                };
                this.clientService.getRfqwiseAuctionIdsByPR(temp).subscribe((data) => this.successCallBack(data));


            } else {
                this.toastrService.error('Failed to Fetch data', 'Failure')
            }
        });
    }

    showCheckBox(vendor){
        return vendor&& vendor.vid && vendor.vid.split('-').includes('auctionprice');
    }

    selectVendor(vendor){

        if(vendor&& vendor.vid && vendor.vid.split('-').includes('auctionprice')){
            this.selectedVendor = vendor;
          this.itemData.headers.forEach((ele:any) => {
            if(vendor.vid ==  ele.vid){
                ele['selected']= true;
            }else{
                ele['selected']= false;
            }
        })}else{
            this.toastrService.warning("This selection not allowed, Please select for Auction Price")
        }
        // this.itemData.headers[index]['selected'] = true;
    }

    onCreatePPO(){
        if(this.selectedAucType && this.selectedAucCategoryId && this.selectedPr && this.selectedVendor){
            let ppoItemsSelected: any =[];
            let ppoValueAMount = 0;
            this.itemData.items.forEach((item:any)=>{
                item.data.forEach((v_item:any) => {
                    if(this.selectedVendor.vid == v_item.vendorid){
                        ppoItemsSelected.push({...v_item, ...{
                            description: item.description,
                            uom: item.unitofMeasures,
                            totalBasicAmount: item.quantity *  Number(v_item.totalamount),
                            unitPrice: v_item.totalamount,
                            "serialNo": v_item.serialNo,
                            quantity: item.quantity,
                            unitofMeasures: item.unitofMeasures,
                            "vendorId": this.selectedVendor.vendorId,
                            "org": {
                                "id": this.loggedUserDetails.org.id
                              },
                            "vendorName":  this.selectedVendor.vendorId,
                            "pritemId": item.pritemId,

                        }})
                        ppoValueAMount = ppoValueAMount+ (item.quantity *  Number(v_item.totalamount))
                    }
                });

            });



            console.log('ppo', ppoItemsSelected, ppoValueAMount)
            const obj = {
                "ppoValue": ppoValueAMount,
                "pr": {
                  "id":  this.selectedPr.id
                },
                "createdBy": "Jaswanth kumar",
                "documents": [],
                "org": {
                  "id":  this.loggedUserDetails.org.id
                },
                "pritemId": "aac17b5f-8dc7-4a88-a75e-0cdd93e3e4d1",
                "ppoitems":  ppoItemsSelected,
                "vendor": this.selectedVendor.vendorId,
                // [
                //   {
                //     "createdBy": null,
                //     "lastModifiedBy": null,
                //     "createdTS": "2022-05-28T09:02:13.000+0000",
                //     "brand": "test",
                //     "category": null,
                //     "description": "JIO WIFI",
                //     "estimatedItemValue": 0,
                //     "excludetaxamount": 1188,
                //     "gstValue": 0,
                //     "itemcode": null,
                //     "lastModifiedTS": "2022-05-28T09:02:13.000+0000",
                //     "linkedItemId": "10e33496-7690-4c82-a577-7b07d36255e2",
                //     "linkedItemPrice": 99,
                //     "linkedItemStatus": true,
                //     "org": {
                //       "id": "b216f016-b05d-48f9-bf1a-f2e170ea346a"
                //     },
                //     "pritemId": "aac17b5f-8dc7-4a88-a75e-0cdd93e3e4d1",
                //     "procucevItemCode": null,
                //     "quantity": 12,
                //     "serialNo": 1002,
                //     "specification": null,
                //     "status": null,
                //     "totalBasicAmount": 1188,
                //     "unitofMeasures": "pcs",
                //     "unitprice": 99,
                //     "uom": null,
                //     "vendorId": "b216f016-b05d-48f9-bf1a-f2e170ea346a",
                //     "vendorName": "JioTele",
                //     "vendorPrice": null
                //   }
                // ],
                "submittedBy": "Jaswanth kumar"
              }

              let capexPpoData:any ={
                data: obj, isCapex: true, prData: this.selectedPr
              }
              setTimeout(() => {
                const dialog =  this.modalDialog.open(PpoCreateComponent, { data: capexPpoData, width: '80%', height: '80%' });

                dialog.afterClosed().subscribe(result => {
                this.displayMessageTextBox = false;
                });
              }, 200);




        }else{
            this.toastrService.warning("Please Select PR Id, Auction details");
        }
    }

}

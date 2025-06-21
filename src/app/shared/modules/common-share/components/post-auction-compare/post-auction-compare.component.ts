import { ElementRef, Output , EventEmitter} from '@angular/core';
import { ViewChild } from '@angular/core';
import { Component, Input, OnInit } from '@angular/core';
import { ClientService } from 'src/app/layout/client/services/client-service.service';
import { AppApiConfig } from 'src/app/shared/constants/app-api.config';
import { ExcelService } from '../../services/excel.service';
import * as xlsx from 'xlsx';

@Component({
  selector: 'app-post-auction-compare',
  templateUrl: './post-auction-compare.component.html',
  styleUrls: ['./post-auction-compare.component.scss']
})
export class PostAuctionCompareComponent implements OnInit {
  @Input('prId') prId ;
  @Input ('ppoData') ppoData ;
  selectedData: any = [];
  @ViewChild('exportTable') exportTable: ElementRef;
  pageRecordSize: any;
  pageOptions: any;
  auctionCategoryList: any;
  selectedAucCategoryId: any;
  selectedAuc: any;
  rfqWiseList: any[] = [];
  itemWiseList: any[] = [];
  auctionWiseList: any[] = [];
  @Output() public auctionDetails =   new EventEmitter<any>();
  itemData: any;
  auctionItemsHeaders = [
    { field: 'desc', header: 'ItemName', width: '145px' },
    { field: 'venodorName', header: 'Vendor Name', width: '145px' },
    { field: 'quotePrice', header: 'Pre Auction', width: '145px' },
    { field: 'auctionPrice', header: 'Post Auction', width: '145px' },
  ];
  filteredAuctionList: any[] = [];
  selectedAucType: any;
    viewPrByData: any;
  constructor(private clientService: ClientService,
    private excelService: ExcelService) { }

  ngOnInit() {
    this.pageRecordSize = AppApiConfig.GRID_PAGE_INFO.initpageSize;
    this.pageOptions = AppApiConfig.GRID_PAGE_INFO.pageOptions;
    console.log(this.ppoData);
    const reqObj = {
      'id': this.prId
    };
    this.clientService.getRfqwiseAuctionIdsByPR(reqObj).subscribe((data) => this.successCallBack(data));


    const temp = {
        id: this.prId
      };
      this.clientService.getPrById(temp).subscribe((res: any) => {

        if (res) {
            this.viewPrByData= res || {};
            console.log('this.viewPrByData', this.viewPrByData);
        } else {
        //   this.toaster.error('Failed to Fetch data', 'Failure')
        }
      });
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
        if(this.viewPrByData.isCapex == true){
            this.clientService.getCapexExcelSummary(element).subscribe((res:any)=>{
                this.itemData = data || {};
                this.auctionDetails.emit(this.itemData);
            })
        }else{
            this.clientService.getRFQWiseSummary(element).subscribe((data: any) => {
                this.itemData = data || {};
                this.auctionDetails.emit(this.itemData);
              });
        }

        } else {
            if(this.viewPrByData.isCapex == true){
                this.clientService.getCapexExcelSummary(element).subscribe((data:any)=>{
                    this.itemData = data || {};
                    this.auctionDetails.emit(this.itemData);
                })
            }else{
                this.selectedAucType = element.auctionCategory;
                this.clientService.getItemWiseSummary(element).subscribe((data: any) => {
                this.itemData = data || {};
                this.auctionDetails.emit(this.itemData);

              });
            }

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

}

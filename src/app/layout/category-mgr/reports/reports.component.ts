import { Component, OnInit } from '@angular/core';
import { CatProcuRequestsService } from 'src/app/layout/category-mgr/services';
import { ClientService } from 'src/app/layout/client/services/client-service.service';
import { ViewChild, ElementRef } from '@angular/core';
import * as xlsx from 'xlsx';

@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.scss']
})
export class ReportsComponent implements OnInit {

  selectedPr: any;
  selectedAuction: any;
  prList: any [] = [];
  auctionItemList: any [] = [];
  filteredprList: any = [];
  filteredauctionList: any = [];
  auctionDetails: any ;
  @ViewChild('exportTable') exportTable: ElementRef;

  constructor(private procService: CatProcuRequestsService, private clientService: ClientService) { }

  ngOnInit() {
    this.getPrsList();
  }

  prChange() {
    // get Auctions for selected PR.
    this.selectedAuction = '';
    const reqObj = {
      'id': this.selectedPr.id
    };
    this.clientService.getRfqwiseAuctionIdsByPR(reqObj).subscribe((data) => {
      if (Array.isArray(data)) {
        this.auctionItemList = data;
      } else {
        this.auctionItemList = [];
      }

    });
  }
  auctionItemChange() {

    if (this.selectedAuction) {
      const reqObj = {
        'id': this.selectedAuction.id
      };
      this.clientService.getItemWiseSummary(reqObj).subscribe((data: any) => {
        this.auctionDetails = data || {};
      });
    }

  }

  getPrsList() {
    const reqObj = {
          'masterStatus': ['PC_PR_ACCEPTED']
    };
      this.procService.getPRIdsList().subscribe((res) => {
      if (Array.isArray(res)) {
        this.prList = res;
      } else {
        this.prList = [];
      }

    });
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

  filterAuction(event) {
    const filtered: any[] = [];
    const query = event.query;
    for (let i = 0; i < this.auctionItemList.length; i++) {
        const auctionItem = this.auctionItemList[i];
        if (auctionItem.auctionId && auctionItem.auctionId.toLowerCase().includes(query.toLowerCase())) {
            filtered.push(auctionItem);
        }
    }
    this.filteredauctionList = filtered;
  }

  exportToExcel() {
    const ws: xlsx.WorkSheet = xlsx.utils.table_to_sheet(this.exportTable.nativeElement);
    const wb: xlsx.WorkBook = xlsx.utils.book_new();
    xlsx.utils.book_append_sheet(wb, ws, 'Sheet1');
    xlsx.writeFile(wb, this.selectedAuction.auctionId + '.xlsx');
  }

}

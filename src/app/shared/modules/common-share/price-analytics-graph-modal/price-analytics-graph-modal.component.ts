import { DatePipe } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ClientService } from 'src/app/layout/client/services/client-service.service';

@Component({
    selector: 'app-price-analytics-graph-modal',
    templateUrl: './price-analytics-graph-modal.component.html',
    styleUrls: ['./price-analytics-graph-modal.component.scss']
})
export class PriceAnalyticsGraphModalComponent implements OnInit {
    rowData: any;
    apiData: any;
    isShowChart: boolean;
    options: { title: { display: boolean; text: string; fontSize: number; }; legend: { position: string; }; showAllTooltips: boolean; tooltips: { enabled: boolean; callbacks: { label: (tooltipItem: any, data: any) => any; }; }; };
    chartData: { labels: any; datasets: { label: any; data: any; fill: boolean; borderColor: string; }[]; };
    graphTitle: any;

    constructor(@Inject(MAT_DIALOG_DATA) public data: any, private client: ClientService, private datePipe: DatePipe) {
        this.rowData = data;
        const title = this.rowData.graphTitle.split(':')[1];
      this.graphTitle = title ;
        let obj;
        // if (this.rowData.isVendorLevel) {
        //     obj = {
        //         "item": { id: this.rowData.itemId },
        //         "vendor": { id: this.rowData.vendorId }
        //     }
        //     this.client.getPriceTrendByItemIdAndVendorId(obj).subscribe((res: any) => {
        //         if (res) {
        //             this.apiData = res;
        //             if (res.dates) {
        //                 this.apiData['dates'] = res.dates.map((ele: any) => { return this.datePipe.transform(new Date(ele), 'dd-MM-yyyy') });
        //             }
        //             this.generateChart();
        //         }
        //     })
        // } else {
        //     obj = { id: this.rowData.itemId };
        //     this.client.getPriceTrendByItemId(obj).subscribe((res: any) => {
        //         if (res) {
        //             this.apiData = res;
        //             if (res.dates) {
        //                 this.apiData['dates'] = res.dates.map((ele: any) => { return this.datePipe.transform(new Date(ele), 'dd-MM-yyyy') });
        //             }
        //             this.generateChart();
        //         }
        //     })
        // }
    }

    ngOnInit() {
        // this.generateChart();
    }
    generateChart() {
        const trimTitle = this.rowData.graphTitle.length > 150 ? this.rowData.graphTitle.substr(0, 40) + '...' : this.rowData.graphTitle;
        this.isShowChart = true;
        const lineColor = this.rowData.priceFlag === 'GT' ? '#ff5d5d' : (this.rowData.priceFlag === 'LT' ? '#85d046' : '#6363de')
        this.options = {
            title: {
                display: true,
                text: 'Current Price : ' + this.rowData.currentPrice,
                fontSize: 16
            },
            legend: {
                position: 'bottom'
            },
            showAllTooltips: true,
            tooltips: {
                enabled: true,
                callbacks: {
                    label: function (tooltipItem, data) {
                        return (data.tooltips[tooltipItem.index]).split('#');
                    },
                }
            }
        };
        this.chartData = {
            labels: this.apiData['dates'],
            datasets: [
                {
                    label: trimTitle,
                    data: this.apiData['prices'],
                    fill: false,
                    borderColor: lineColor
                }
            ]
        }
        console.log(
            'apiData', this.chartData
        )
    }


}

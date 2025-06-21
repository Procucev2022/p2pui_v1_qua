import { Component, OnInit, OnChanges, SimpleChanges, Input, OnDestroy, Inject } from '@angular/core';
import { ClientService } from '../services/client-service.service';
import { DatePipe } from '@angular/common';

@Component({
    selector: 'app-price-trend-chart',
    templateUrl: './price-trend-chart.component.html',
    styleUrls: ['./price-trend-chart.component.scss']
})
export class PriceTrendChartComponent implements OnInit, OnChanges, OnDestroy {
    options: any;
    chartData: any;

    @Input() rowData: any;
    @Input() isItemLevel: boolean;
    isShowChart: boolean;
    dataSet: any = {
        dates: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'Aug', 'Sep', 'OCt', 'Nov', 'Dec'],
        data: [65, 59, 80, 81, 56, 55, 0, 80, 81, 56, 55]
    }
    apiData: any;
    activeBtnPosition: number = 0;
    constructor(private client: ClientService, private datePipe: DatePipe,
    ) { }
    ngOnChanges(changes: SimpleChanges) {
        console.log(changes.rowData, 'rowdata...');
        this.isShowChart = false;
        this.apiData = null;
        if (changes.rowData && changes.rowData.currentValue != changes.rowData.previousValue) {
            let obj: any;
            if (this.rowData.isVendorLevel) {
                obj = {
                    "item": { id: this.rowData.itemId },
                    "vendor": { id: this.rowData.vendorId },
                    "priceTrendType": "DD"
                }
              this.getPriceDataAndVendorId(obj,true)
            } else {
                obj = { id: this.rowData.itemId, "priceTrendType": "DD" };
                this.getPriceData(obj, true);
            }


        }

    }

    getPriceDataAndVendorId(obj:any, isDaily){
        this.client.getPriceTrendByItemIdAndVendorId(obj).subscribe((res: any) => {
            if (res) {
                this.apiData = res;
                if (res.dates && isDaily) {
                    this.apiData['dates'] =  res.dates.map((ele: any) => { return this.datePipe.transform(new Date(ele), 'dd-MM-yyyy') });
                }
                if(res.xKeys && !isDaily){
                    this.apiData['dates'] =  res.xKeys;
                }

                this.generateChart({});
            }
        })
    }


    getPriceData(obj, isDaily) {
        this.client.getPriceTrendByItemId(obj).subscribe((res: any) => {
            if (res) {
                this.apiData = res;
                if (res.dates && isDaily) {
                    this.apiData['dates'] =  res.dates.map((ele: any) => { return this.datePipe.transform(new Date(ele), 'dd-MM-yyyy') });
                }
                if(res.xKeys && !isDaily){
                    this.apiData['dates'] =  res.xKeys;
                }
            }
            this.generateChart({});
        })

    }
    ngOnInit() {


    }

    generateChart(rowData) {
        const trimTitle = this.rowData.graphTitle.length > 150 ? this.rowData.graphTitle.substr(0, 40) + '...' : this.rowData.graphTitle;
        this.dataSet.data.push(this.rowData.currentPrice)
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
            labels: this.apiData.dates,
            datasets: [
                {
                    label: trimTitle,
                    data: this.apiData.prices,
                    fill: false,
                    borderColor: lineColor
                }
            ]
        }
        console.log(
            'apiData', this.apiData
        )
    }

    ngOnDestroy(): void {
        this.isShowChart = false;
    }


    getData(byValue: string) {
        let obj;
        let type = 'DD';
        if (byValue === 'daily') {
            this.activeBtnPosition = 0;
            type = 'DD';
        } else if (byValue === 'monthly') {
            type = 'MM';
            this.activeBtnPosition = 1;
        } else {
            this.activeBtnPosition = 2;
            type = 'YY';
        }
        const isDaily = type == 'DD'? true: false;

        if (this.rowData.isVendorLevel) {
            obj = {
                "item": { id: this.rowData.itemId },
                "vendor": { id: this.rowData.vendorId },
                "priceTrendType": type
            }
          this.getPriceDataAndVendorId(obj,isDaily)
        } else {
            obj = { id: this.rowData.itemId, "priceTrendType": type };
            this.getPriceData(obj, isDaily);
        }

    }
}

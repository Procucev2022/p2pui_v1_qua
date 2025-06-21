import { Component, OnInit, Input } from '@angular/core';
import { AppConfig } from 'src/app/app.config';

@Component({
    selector: 'app-doc-grid',
    templateUrl: './doc-grid.component.html',
    styleUrls: ['./doc-grid.component.scss']
})
export class DocGridComponent implements OnInit {

    @Input('docList') docList;
    selectedData: any[] = [];
    pageRecordSize: any;
    pageOptions: any;
    itempageOptions: any;
    paginatoryDetails: any;

    docHeaders: any = [
        { field: 'fileName', header: 'File Name', isLink: false },
        { field: 'createdTS', header: 'Creation Date', isLink: false }
    ]

    constructor() { }

    ngOnInit() {
        this.pageRecordSize = AppConfig.GRID_PAGE_INFO.initpageSize;
        this.pageOptions = AppConfig.GRID_PAGE_INFO.pageOptions;
        this.itempageOptions = AppConfig.GRID_PAGE_INFO.pageOptions;
        console.log(this.docList);

    }

}

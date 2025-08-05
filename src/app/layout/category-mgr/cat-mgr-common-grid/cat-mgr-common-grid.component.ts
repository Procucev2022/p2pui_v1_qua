import { Component, Input, OnChanges, OnInit, SimpleChanges, EventEmitter, Output, DoCheck } from '@angular/core';
import { SystemViewConfig } from 'src/app/app.config';

@Component({
    selector: 'app-cat-mgr-common-grid',
    templateUrl: './cat-mgr-common-grid.component.html',
    styleUrls: ['./cat-mgr-common-grid.component.scss']
})
export class CatMgrCommonGridComponent implements OnInit, OnChanges {

    commonGridTableHeaders: any = [];
    commonGridList: any = [];
    commonGridActions:any =[];
    @Input() gridData: any;
    @Output() onGridAction: EventEmitter<any> = new EventEmitter()
    currentView: any;
    isGMTView: boolean;
    isShowGrid:boolean =false;
    constructor() { }

    ngOnInit() {
        this.currentView = !localStorage.getItem('system-view') ? JSON.parse(localStorage.getItem('system-view')): localStorage.getItem('system-view');
        this.isGMTView = [SystemViewConfig.GMT_BASIC , SystemViewConfig.GMT_BASIC_PLUS].includes(this.currentView)? true: false;


    }

    ngOnChanges(changes: SimpleChanges): void {
        this.isShowGrid = false;
        if (changes && changes.gridData.currentValue != changes.gridData.previousValue) {
            this.commonGridTableHeaders= changes.gridData.currentValue.gridHeaders;
            this.commonGridList = changes.gridData.currentValue.gridValue;
            this.commonGridActions = changes.gridData.currentValue.actionsList || [];
            this.isShowGrid = true;
        }
    }



    onActionEvent(eventData:any, rowData:any){
        const obj = {'rowData': rowData, 'eventData': eventData};
        this.onGridAction.emit(obj);
    }

}

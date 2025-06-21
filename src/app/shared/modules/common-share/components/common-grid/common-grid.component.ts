import { ChangeDetectorRef, Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { AppApiConfig } from 'src/app/shared/constants/app-api.config';

@Component({
  selector: 'app-common-grid',
  templateUrl: './common-grid.component.html',
  styleUrls: ['./common-grid.component.scss']
})
export class CommonGridComponent implements OnInit, OnChanges  {
  pageRecordSize: any;
  paginatoryDetails: any;
  selectedParentId: any;
  selectedParenLabel: any;
  gridActionEvents: any = [];
  rowClickEventName: any;
  showSelctionCheckBox: boolean;
  allowRowMultipleSelction: any;
  gridShow: any;
  scrollHeight: any;
  constructor(private cdRef: ChangeDetectorRef) { }
  gridHeaders: any = [];
  gridColumnData = [];
  gridTitle: string;
  exportFileName: string;
  actionEvents: any = [];
  selectedData = [];
  editableCells = [];
  pageOptions = {};
  @Input('gridData') gridData;
  @Input('parentId') parentId;
  @Input('compName') parentCompName;
  @Output() actionEvent: EventEmitter<any> = new EventEmitter();
  ngOnInit() {
    console.log('called common oninit', this.gridData);
    this.pageRecordSize = AppApiConfig.GRID_PAGE_INFO.initpageSize;
    this.pageOptions    = AppApiConfig.GRID_PAGE_INFO.pageOptions;
    this.buildGridData();
  }

  onClickButton(button) {
    const eventData = {
      rowData: this.selectedData, eventName: button.btnEventName, rowIndex: 0, evenData: button
    };
    this.actionEvent.emit(eventData);
  }


  buildGridData() {
    this.gridShow = true;
    this.scrollHeight = this.gridData && this.gridData ['scrollHeight'] ? this.gridData ['scrollHeight'] : null;

    this.showSelctionCheckBox = false;
    this.allowRowMultipleSelction = true;
    this.selectedData  = [];
    if (this.gridData) {
      this.showSelctionCheckBox = this.gridData ? this.gridData.gridSelectionCheckbox.showSelction : false;
      this.allowRowMultipleSelction = this.gridData ? this.gridData.gridSelectionCheckbox.allowMultipleSelection ? 'multiple' : 'single' : true;
      this.gridColumnData = this.gridData.gridColumnData;
      this.gridHeaders = this.gridData.gridHeaders;
      this.gridTitle = this.gridData.gridTitle;
      this.selectedParentId = this.gridData.displayParentId;
      this.selectedParenLabel = this.gridData.displayParentLabel;
      this.gridActionEvents = this.gridData.actionEvents;
      this.rowClickEventName = this.gridData.rowEventClickEventName;
      this.editableCells = this.gridData.editableCells;
      this.actionEvents  = this.gridData.gridTopButtonActions;
    } else {
      this.gridColumnData = [];
      this.gridHeaders = [];
      this.gridTitle = '';
      this.selectedParentId = '';
      this.selectedParenLabel = '';
      this.gridActionEvents = [];
      this.rowClickEventName = null;
      this.editableCells = [];
      this.actionEvents  = [];

    }
    this.cdRef.detectChanges();
  }

  onSelectedActionEvent(rowData, eventName, rowIndex) {
    this.selectedData = [rowData];
    if (eventName !== '') {
    this.actionEvent.emit({rowData: rowData, eventName: eventName, rowIndex: rowIndex});
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    console.log('changes', changes);
    if (changes.gridData.previousValue  && changes.gridData.previousValue.gridColumnData.length !== changes.gridData.currentValue.gridColumnData.length) {
      this.buildGridData();
      }
 
  }

}

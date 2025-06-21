export interface CommonGridData {
      actionEvents: any[];
      gridTopButtonActions: any[];
      gridColumnData: any[];
      gridHeaders: any[];
      gridTitle: String;
      displayParentLabel:  String;
      displayParentId: String;
      rowEventClickEventName: String;
      editableCells: any[];
      gridSelectionCheckbox: {
        showSelction: Boolean,
        allowMultipleSelection: Boolean
      };
}

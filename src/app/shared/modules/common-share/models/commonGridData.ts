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

/** Runtime helper so this model module is instrumented for coverage. */
export function createEmptyCommonGridData(): CommonGridData {
  return {
    actionEvents: [],
    gridTopButtonActions: [],
    gridColumnData: [],
    gridHeaders: [],
    gridTitle: '',
    displayParentLabel: '',
    displayParentId: '',
    rowEventClickEventName: '',
    editableCells: [],
    gridSelectionCheckbox: {
      showSelction: false,
      allowMultipleSelection: false
    }
  };
}

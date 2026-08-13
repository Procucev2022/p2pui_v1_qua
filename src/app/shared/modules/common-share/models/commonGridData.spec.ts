import {
  CommonGridData,
  createEmptyCommonGridData,
} from './commonGridData';

describe('CommonGridData', () => {
  it('should accept a conforming grid config object', () => {
    const data: CommonGridData = {
      actionEvents: [],
      gridTopButtonActions: [],
      gridColumnData: [],
      gridHeaders: ['id'],
      gridTitle: 'Title',
      displayParentLabel: 'Parent',
      displayParentId: '1',
      rowEventClickEventName: 'rowClick',
      editableCells: [],
      gridSelectionCheckbox: {
        showSelction: true,
        allowMultipleSelection: false,
      },
    };
    expect(data.gridTitle).toBe('Title');
    expect(data.gridSelectionCheckbox.showSelction).toBe(true);
  });

  it('should create an empty grid data via factory', () => {
    const empty = createEmptyCommonGridData();
    expect(empty.actionEvents).toEqual([]);
    expect(empty.gridSelectionCheckbox.showSelction).toBe(false);
    expect(empty.gridSelectionCheckbox.allowMultipleSelection).toBe(false);
    expect(empty.gridTitle).toBe('');
  });
});

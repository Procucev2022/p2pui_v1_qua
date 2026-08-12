import { CommonGridData } from './commonGridData';

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
        allowMultipleSelection: false
      }
    };
    expect(data.gridTitle).toBe('Title');
    expect(data.gridSelectionCheckbox.showSelction).toBe(true);
  });
});

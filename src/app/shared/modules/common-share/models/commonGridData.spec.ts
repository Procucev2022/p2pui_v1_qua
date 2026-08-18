import { createEmptyCommonGridData, CommonGridData } from './commonGridData';

describe('commonGridData model', () => {
  it('createEmptyCommonGridData should return valid object', () => {
    const data: CommonGridData = createEmptyCommonGridData();
    expect(data).toBeTruthy();
    expect(data.actionEvents).toEqual([]);
    expect(data.gridTopButtonActions).toEqual([]);
    expect(data.gridColumnData).toEqual([]);
    expect(data.gridHeaders).toEqual([]);
    expect(data.gridTitle).toBe('');
    expect(data.displayParentLabel).toBe('');
    expect(data.displayParentId).toBe('');
    expect(data.rowEventClickEventName).toBe('');
    expect(data.editableCells).toEqual([]);
    expect(data.gridSelectionCheckbox.showSelction).toBe(false);
    expect(data.gridSelectionCheckbox.allowMultipleSelection).toBe(false);
  });
});

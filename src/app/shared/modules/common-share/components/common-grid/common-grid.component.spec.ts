import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA, ChangeDetectorRef, SimpleChange } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CommonGridComponent } from './common-grid.component';
import { defaultAppConfig } from 'src/testing/test-helpers';
import { APP_CONFIG } from 'src/app/app.config';

describe('CommonGridComponent', () => {
  let component: CommonGridComponent;
  let fixture: ComponentFixture<CommonGridComponent>;

  const mockGridData = {
    scrollHeight: '400px',
    gridSelectionCheckbox: {
      showSelction: true,
      allowMultipleSelection: true
    },
    gridColumnData: [{ id: 1, name: 'Test 1' }],
    gridHeaders: [{ field: 'name', header: 'Name' }],
    gridTitle: 'Test Grid',
    displayParentId: 'P-1',
    displayParentLabel: 'Parent Label',
    actionEvents: [{ name: 'edit' }],
    rowEventClickEventName: 'rowClick',
    editableCells: ['name'],
    gridTopButtonActions: [{ btnEventName: 'create' }]
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CommonGridComponent],
      imports: [CommonModule],
      providers: [
        { provide: APP_CONFIG, useValue: defaultAppConfig },
        { provide: ChangeDetectorRef, useValue: { markForCheck: () => undefined, detectChanges: () => undefined } }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    })
      .overrideTemplate(CommonGridComponent, '')
      .overrideComponent(CommonGridComponent, { set: { providers: [] } })
      .compileComponents();

    fixture = TestBed.createComponent(CommonGridComponent);
    component = fixture.componentInstance;
  });

  it('should create and build grid data with full configuration', () => {
    component.gridData = { ...mockGridData };
    component.ngOnInit();
    expect(component).toBeTruthy();
    expect(component.scrollHeight).toBe('400px');
    expect(component.showSelctionCheckBox).toBeTrue();
    expect(component.allowRowMultipleSelction).toBe('multiple');
    expect(component.gridTitle).toBe('Test Grid');
  });

  it('should build grid data with null/partial gridData and single selection', () => {
    // Single selection
    component.gridData = {
      ...mockGridData,
      scrollHeight: null,
      gridSelectionCheckbox: {
        showSelction: false,
        allowMultipleSelection: false
      }
    };
    component.buildGridData();
    expect(component.showSelctionCheckBox).toBeFalse();
    expect(component.allowRowMultipleSelction).toBe('single');

    // Null gridData
    component.gridData = null;
    component.buildGridData();
    expect(component.gridColumnData).toEqual([]);
    expect(component.gridHeaders).toEqual([]);
  });

  it('should handle onClickButton and onSelectedActionEvent', () => {
    spyOn(component.actionEvent, 'emit');

    component.selectedData = [{ id: 1 }];
    component.onClickButton({ btnEventName: 'export' });
    expect(component.actionEvent.emit).toHaveBeenCalledWith({
      rowData: [{ id: 1 }],
      eventName: 'export',
      rowIndex: 0,
      evenData: { btnEventName: 'export' }
    });

    // onSelectedActionEvent with eventName
    component.onSelectedActionEvent({ id: 1 }, 'edit', 0);
    expect(component.actionEvent.emit).toHaveBeenCalledWith({
      rowData: { id: 1 },
      eventName: 'edit',
      rowIndex: 0
    });

    // onSelectedActionEvent with empty eventName
    component.onSelectedActionEvent({ id: 1 }, '', 0);
  });

  it('should handle ngOnChanges when column data length changes', () => {
    spyOn(component, 'buildGridData');

    const prevGrid = { gridColumnData: [1] };
    const currGrid = { gridColumnData: [1, 2] };

    component.ngOnChanges({
      gridData: new SimpleChange(prevGrid, currGrid, false)
    });

    expect(component.buildGridData).toHaveBeenCalled();
  });
});

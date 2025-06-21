import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PrItemsGridPanelCapexComponent } from './pr-items-grid-panel-capex.component';

describe('PrItemsGridPanelCapexComponent', () => {
  let component: PrItemsGridPanelCapexComponent;
  let fixture: ComponentFixture<PrItemsGridPanelCapexComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PrItemsGridPanelCapexComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PrItemsGridPanelCapexComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

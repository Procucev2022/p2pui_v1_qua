import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PrItemsGridPanelComponent } from './pr-items-grid-panel.component';

describe('PrItemsGridPanelComponent', () => {
  let component: PrItemsGridPanelComponent;
  let fixture: ComponentFixture<PrItemsGridPanelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PrItemsGridPanelComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PrItemsGridPanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

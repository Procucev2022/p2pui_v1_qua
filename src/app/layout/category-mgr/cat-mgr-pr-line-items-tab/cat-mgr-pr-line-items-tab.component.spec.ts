import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CatMgrPrLineItemsTabComponent } from './cat-mgr-pr-line-items-tab.component';

describe('CatMgrPrLineItemsTabComponent', () => {
  let component: CatMgrPrLineItemsTabComponent;
  let fixture: ComponentFixture<CatMgrPrLineItemsTabComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CatMgrPrLineItemsTabComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CatMgrPrLineItemsTabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

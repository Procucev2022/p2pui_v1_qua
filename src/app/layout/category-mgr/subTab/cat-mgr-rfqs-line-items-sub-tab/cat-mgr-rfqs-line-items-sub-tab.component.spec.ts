import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CatMgrRfqsLineItemsSubTabComponent } from './cat-mgr-rfqs-line-items-sub-tab.component';

describe('CatMgrRfqsLineItemsSubTabComponent', () => {
  let component: CatMgrRfqsLineItemsSubTabComponent;
  let fixture: ComponentFixture<CatMgrRfqsLineItemsSubTabComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CatMgrRfqsLineItemsSubTabComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CatMgrRfqsLineItemsSubTabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

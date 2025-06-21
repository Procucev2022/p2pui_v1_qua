import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CatMgrQuotSubTabLineItemsComponent } from './cat-mgr-quot-sub-tab-line-items.component';

describe('CatMgrQuotSubTabLineItemsComponent', () => {
  let component: CatMgrQuotSubTabLineItemsComponent;
  let fixture: ComponentFixture<CatMgrQuotSubTabLineItemsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CatMgrQuotSubTabLineItemsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CatMgrQuotSubTabLineItemsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

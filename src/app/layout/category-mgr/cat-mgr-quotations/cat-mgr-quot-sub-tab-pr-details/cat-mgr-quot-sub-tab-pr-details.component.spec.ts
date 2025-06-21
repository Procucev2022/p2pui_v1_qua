import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CatMgrQuotSubTabPrDetailsComponent } from './cat-mgr-quot-sub-tab-pr-details.component';

describe('CatMgrQuotSubTabPrDetailsComponent', () => {
  let component: CatMgrQuotSubTabPrDetailsComponent;
  let fixture: ComponentFixture<CatMgrQuotSubTabPrDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CatMgrQuotSubTabPrDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CatMgrQuotSubTabPrDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

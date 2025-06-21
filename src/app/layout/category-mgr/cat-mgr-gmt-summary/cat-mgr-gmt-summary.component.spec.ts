import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CatMgrGmtSummaryComponent } from './cat-mgr-gmt-summary.component';

describe('CatMgrGmtSummaryComponent', () => {
  let component: CatMgrGmtSummaryComponent;
  let fixture: ComponentFixture<CatMgrGmtSummaryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CatMgrGmtSummaryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CatMgrGmtSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

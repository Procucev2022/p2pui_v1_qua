import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CatMgrQuotSubTabRfqsComponent } from './cat-mgr-quot-sub-tab-rfqs.component';

describe('CatMgrQuotSubTabRfqsComponent', () => {
  let component: CatMgrQuotSubTabRfqsComponent;
  let fixture: ComponentFixture<CatMgrQuotSubTabRfqsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CatMgrQuotSubTabRfqsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CatMgrQuotSubTabRfqsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

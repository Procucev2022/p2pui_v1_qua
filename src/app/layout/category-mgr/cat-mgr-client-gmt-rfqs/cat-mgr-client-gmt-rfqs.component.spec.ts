import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CatMgrClientGmtRfqsComponent } from './cat-mgr-client-gmt-rfqs.component';

describe('CatMgrClientGmtRfqsComponent', () => {
  let component: CatMgrClientGmtRfqsComponent;
  let fixture: ComponentFixture<CatMgrClientGmtRfqsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CatMgrClientGmtRfqsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CatMgrClientGmtRfqsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

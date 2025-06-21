import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CatMgrVendorRfqsComponent } from './cat-mgr-vendor-rfqs.component';

describe('CatMgrVendorRfqsComponent', () => {
  let component: CatMgrVendorRfqsComponent;
  let fixture: ComponentFixture<CatMgrVendorRfqsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CatMgrVendorRfqsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CatMgrVendorRfqsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

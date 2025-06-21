import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CatMgrCreateRfqVendorDetailsComponent } from './cat-mgr-create-rfq-vendor-details.component';

describe('CatMgrCreateRfqVendorDetailsComponent', () => {
  let component: CatMgrCreateRfqVendorDetailsComponent;
  let fixture: ComponentFixture<CatMgrCreateRfqVendorDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CatMgrCreateRfqVendorDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CatMgrCreateRfqVendorDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

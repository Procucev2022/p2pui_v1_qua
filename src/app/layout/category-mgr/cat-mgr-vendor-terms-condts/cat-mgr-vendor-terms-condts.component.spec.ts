import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CatMgrVendorTermsCondtsComponent } from './cat-mgr-vendor-terms-condts.component';

describe('CatMgrVendorTermsCondtsComponent', () => {
  let component: CatMgrVendorTermsCondtsComponent;
  let fixture: ComponentFixture<CatMgrVendorTermsCondtsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CatMgrVendorTermsCondtsComponent]
    });
    fixture = TestBed.createComponent(CatMgrVendorTermsCondtsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

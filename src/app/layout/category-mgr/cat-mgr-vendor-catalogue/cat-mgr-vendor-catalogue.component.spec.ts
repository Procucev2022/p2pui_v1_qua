import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CatMgrVendorCatalogueComponent } from './cat-mgr-vendor-catalogue.component';

describe('CatMgrVendorCatalogueComponent', () => {
  let component: CatMgrVendorCatalogueComponent;
  let fixture: ComponentFixture<CatMgrVendorCatalogueComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CatMgrVendorCatalogueComponent]
    });
    fixture = TestBed.createComponent(CatMgrVendorCatalogueComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

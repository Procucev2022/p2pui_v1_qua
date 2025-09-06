import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CategoryMgrVendorSummaryComponent } from './category-mgr-vendor-summary.component';

describe('CategoryMgrVendorSummaryComponent', () => {
  let component: CategoryMgrVendorSummaryComponent;
  let fixture: ComponentFixture<CategoryMgrVendorSummaryComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CategoryMgrVendorSummaryComponent]
    });
    fixture = TestBed.createComponent(CategoryMgrVendorSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

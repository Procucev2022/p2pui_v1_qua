import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CatMgrVendorSearchComponent } from './cat-mgr-vendor-search.component';

describe('CatMgrVendorSearchComponent', () => {
  let component: CatMgrVendorSearchComponent;
  let fixture: ComponentFixture<CatMgrVendorSearchComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CatMgrVendorSearchComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CatMgrVendorSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

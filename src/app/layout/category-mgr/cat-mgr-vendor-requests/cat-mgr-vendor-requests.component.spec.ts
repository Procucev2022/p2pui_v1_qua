import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CatMgrVendorRequestsComponent } from './cat-mgr-vendor-requests.component';

describe('CatMgrVendorRequestsComponent', () => {
  let component: CatMgrVendorRequestsComponent;
  let fixture: ComponentFixture<CatMgrVendorRequestsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CatMgrVendorRequestsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CatMgrVendorRequestsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VmgrVendorSearchComponent } from './vmgr-vendor-search.component';

describe('VmgrVendorSearchComponent', () => {
  let component: VmgrVendorSearchComponent;
  let fixture: ComponentFixture<VmgrVendorSearchComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VmgrVendorSearchComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VmgrVendorSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

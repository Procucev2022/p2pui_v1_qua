import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewPreVendorDetailsComponent } from './view-pre-vendor-details.component';

describe('ViewPreVendorDetailsComponent', () => {
  let component: ViewPreVendorDetailsComponent;
  let fixture: ComponentFixture<ViewPreVendorDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewPreVendorDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewPreVendorDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

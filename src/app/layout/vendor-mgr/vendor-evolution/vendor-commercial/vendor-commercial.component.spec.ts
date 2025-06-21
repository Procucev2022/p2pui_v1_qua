import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VendorCommercialComponent } from './vendor-commercial.component';

describe('VendorCommercialComponent', () => {
  let component: VendorCommercialComponent;
  let fixture: ComponentFixture<VendorCommercialComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VendorCommercialComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VendorCommercialComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

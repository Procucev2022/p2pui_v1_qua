import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VendorRFQComponent } from './vendor-rfq.component';

describe('VendorRFQComponent', () => {
  let component: VendorRFQComponent;
  let fixture: ComponentFixture<VendorRFQComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VendorRFQComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VendorRFQComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

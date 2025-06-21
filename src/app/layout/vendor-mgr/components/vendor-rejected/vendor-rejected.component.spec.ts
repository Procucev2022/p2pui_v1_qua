import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VendorRejectedComponent } from './vendor-rejected.component';

describe('VendorRejectedComponent', () => {
  let component: VendorRejectedComponent;
  let fixture: ComponentFixture<VendorRejectedComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VendorRejectedComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VendorRejectedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

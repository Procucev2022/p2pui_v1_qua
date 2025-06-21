import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VendorReqModalComponent } from './vendor-req-modal.component';

describe('VendorReqModalComponent', () => {
  let component: VendorReqModalComponent;
  let fixture: ComponentFixture<VendorReqModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VendorReqModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VendorReqModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

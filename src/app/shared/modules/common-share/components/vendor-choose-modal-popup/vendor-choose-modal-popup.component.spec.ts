import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VendorChooseModalPopupComponent } from './vendor-choose-modal-popup.component';

describe('VendorChooseModalPopupComponent', () => {
  let component: VendorChooseModalPopupComponent;
  let fixture: ComponentFixture<VendorChooseModalPopupComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [VendorChooseModalPopupComponent]
    });
    fixture = TestBed.createComponent(VendorChooseModalPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

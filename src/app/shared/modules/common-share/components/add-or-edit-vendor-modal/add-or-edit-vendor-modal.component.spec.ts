import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddOrEditVendorModalComponent } from './add-or-edit-vendor-modal.component';

describe('AddOrEditVendorModalComponent', () => {
  let component: AddOrEditVendorModalComponent;
  let fixture: ComponentFixture<AddOrEditVendorModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddOrEditVendorModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddOrEditVendorModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

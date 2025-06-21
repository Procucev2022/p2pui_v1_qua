import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditVendorLinkingToItemModalComponent } from './edit-vendor-linking-to-item-modal.component';

describe('EditVendorLinkingToItemModalComponent', () => {
  let component: EditVendorLinkingToItemModalComponent;
  let fixture: ComponentFixture<EditVendorLinkingToItemModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditVendorLinkingToItemModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditVendorLinkingToItemModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

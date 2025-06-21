import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VendorLinkingToItemModalComponent } from './vendor-linking-to-item-modal.component';

describe('VendorLinkingToItemModalComponent', () => {
  let component: VendorLinkingToItemModalComponent;
  let fixture: ComponentFixture<VendorLinkingToItemModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VendorLinkingToItemModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VendorLinkingToItemModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

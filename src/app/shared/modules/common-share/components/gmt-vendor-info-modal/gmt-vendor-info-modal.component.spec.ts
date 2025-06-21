import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GmtVendorInfoModalComponent } from './gmt-vendor-info-modal.component';

describe('GmtVendorInfoModalComponent', () => {
  let component: GmtVendorInfoModalComponent;
  let fixture: ComponentFixture<GmtVendorInfoModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GmtVendorInfoModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GmtVendorInfoModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

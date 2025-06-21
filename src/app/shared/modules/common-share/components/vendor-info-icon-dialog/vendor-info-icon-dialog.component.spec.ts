import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VendorInfoIconDialogComponent } from './vendor-info-icon-dialog.component';

describe('VendorInfoIconDialogComponent', () => {
  let component: VendorInfoIconDialogComponent;
  let fixture: ComponentFixture<VendorInfoIconDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VendorInfoIconDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VendorInfoIconDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

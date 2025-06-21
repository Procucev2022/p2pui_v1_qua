import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VendorQuotSubmComponent } from './vendor-quot-subm.component';

describe('VendorQuotSubmComponent', () => {
  let component: VendorQuotSubmComponent;
  let fixture: ComponentFixture<VendorQuotSubmComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VendorQuotSubmComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VendorQuotSubmComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

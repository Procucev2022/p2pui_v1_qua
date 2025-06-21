import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VendorQualityComponent } from './vendor-quality.component';

describe('VendorQualityComponent', () => {
  let component: VendorQualityComponent;
  let fixture: ComponentFixture<VendorQualityComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VendorQualityComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VendorQualityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

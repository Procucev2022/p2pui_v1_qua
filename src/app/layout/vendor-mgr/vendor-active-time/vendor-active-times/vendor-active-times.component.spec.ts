import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VendorActiveTimesComponent } from './vendor-active-times.component';

describe('VendorActiveTimesComponent', () => {
  let component: VendorActiveTimesComponent;
  let fixture: ComponentFixture<VendorActiveTimesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VendorActiveTimesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VendorActiveTimesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LinkedVendorListComponent } from './linked-vendor-list.component';

describe('LinkedVendorListComponent', () => {
  let component: LinkedVendorListComponent;
  let fixture: ComponentFixture<LinkedVendorListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LinkedVendorListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LinkedVendorListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

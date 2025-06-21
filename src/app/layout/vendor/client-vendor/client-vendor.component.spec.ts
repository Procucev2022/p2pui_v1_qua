import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ClientVendorComponent } from './client-vendor.component';

describe('ClientVendorComponent', () => {
  let component: ClientVendorComponent;
  let fixture: ComponentFixture<ClientVendorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ClientVendorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ClientVendorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

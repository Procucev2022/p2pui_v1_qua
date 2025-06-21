import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VendorClientComponent } from './vendor-client.component';

describe('VendorClientComponent', () => {
  let component: VendorClientComponent;
  let fixture: ComponentFixture<VendorClientComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VendorClientComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VendorClientComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

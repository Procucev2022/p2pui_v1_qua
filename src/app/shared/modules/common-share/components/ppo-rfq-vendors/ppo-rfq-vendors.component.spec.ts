import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PpoRfqVendorsComponent } from './ppo-rfq-vendors.component';

describe('PpoRfqVendorsComponent', () => {
  let component: PpoRfqVendorsComponent;
  let fixture: ComponentFixture<PpoRfqVendorsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PpoRfqVendorsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PpoRfqVendorsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

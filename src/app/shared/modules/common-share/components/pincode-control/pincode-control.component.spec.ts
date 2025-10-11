import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PincodeControlComponent } from './pincode-control.component';

describe('PincodeControlComponent', () => {
  let component: PincodeControlComponent;
  let fixture: ComponentFixture<PincodeControlComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PincodeControlComponent]
    });
    fixture = TestBed.createComponent(PincodeControlComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

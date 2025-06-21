import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PpoTermsConditionsComponent } from './ppo-terms-conditions.component';

describe('PpoTermsConditionsComponent', () => {
  let component: PpoTermsConditionsComponent;
  let fixture: ComponentFixture<PpoTermsConditionsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PpoTermsConditionsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PpoTermsConditionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

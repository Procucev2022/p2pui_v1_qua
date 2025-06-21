import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FormControlErrorsMessagesDisplayComponent } from './form-control-errors-messages-display.component';

describe('FormControlErrorsMessagesDisplayComponent', () => {
  let component: FormControlErrorsMessagesDisplayComponent;
  let fixture: ComponentFixture<FormControlErrorsMessagesDisplayComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FormControlErrorsMessagesDisplayComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FormControlErrorsMessagesDisplayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

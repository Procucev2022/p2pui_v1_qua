import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddClientRefComponent } from './add-client-ref.component';

describe('AddClientRefComponent', () => {
  let component: AddClientRefComponent;
  let fixture: ComponentFixture<AddClientRefComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddClientRefComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddClientRefComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

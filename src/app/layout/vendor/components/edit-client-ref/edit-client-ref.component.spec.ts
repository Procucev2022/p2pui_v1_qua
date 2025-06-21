import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditClientRefComponent } from './edit-client-ref.component';

describe('EditClientRefComponent', () => {
  let component: EditClientRefComponent;
  let fixture: ComponentFixture<EditClientRefComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditClientRefComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditClientRefComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

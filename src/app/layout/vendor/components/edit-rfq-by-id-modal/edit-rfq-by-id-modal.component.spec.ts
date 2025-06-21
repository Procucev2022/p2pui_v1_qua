import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditRfqByIdModalComponent } from './edit-rfq-by-id-modal.component';

describe('EditRfqByIdModalComponent', () => {
  let component: EditRfqByIdModalComponent;
  let fixture: ComponentFixture<EditRfqByIdModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditRfqByIdModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditRfqByIdModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

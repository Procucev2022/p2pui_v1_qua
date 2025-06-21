import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreatePrModalNewComponent } from './create-pr-modal-new.component';

describe('CreatePrModalNewComponent', () => {
  let component: CreatePrModalNewComponent;
  let fixture: ComponentFixture<CreatePrModalNewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreatePrModalNewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreatePrModalNewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

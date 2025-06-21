import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreatePrModalComponent } from './create-pr-modal.component';

describe('CreatePrModalComponent', () => {
  let component: CreatePrModalComponent;
  let fixture: ComponentFixture<CreatePrModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreatePrModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreatePrModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

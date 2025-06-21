import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateRFQSharedComponent } from './create-rfq-shared.component';

describe('CreateRFQSharedComponent', () => {
  let component: CreateRFQSharedComponent;
  let fixture: ComponentFixture<CreateRFQSharedComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateRFQSharedComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateRFQSharedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

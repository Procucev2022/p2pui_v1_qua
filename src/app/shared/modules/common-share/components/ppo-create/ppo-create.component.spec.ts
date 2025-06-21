import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PpoCreateComponent } from './ppo-create.component';

describe('PpoCreateComponent', () => {
  let component: PpoCreateComponent;
  let fixture: ComponentFixture<PpoCreateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PpoCreateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PpoCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

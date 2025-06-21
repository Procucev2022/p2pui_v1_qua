import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LinkedPrPpoCreateComponent } from './linked-pr-ppo-create.component';

describe('LinkedPrPpoCreateComponent', () => {
  let component: LinkedPrPpoCreateComponent;
  let fixture: ComponentFixture<LinkedPrPpoCreateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LinkedPrPpoCreateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LinkedPrPpoCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

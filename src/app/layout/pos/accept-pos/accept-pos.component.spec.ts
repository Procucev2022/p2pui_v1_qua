import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AcceptPosComponent } from './accept-pos.component';

describe('AcceptPosComponent', () => {
  let component: AcceptPosComponent;
  let fixture: ComponentFixture<AcceptPosComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AcceptPosComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AcceptPosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

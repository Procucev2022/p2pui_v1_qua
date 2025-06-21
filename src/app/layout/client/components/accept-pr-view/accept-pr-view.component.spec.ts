import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AcceptPrViewComponent } from './accept-pr-view.component';

describe('AcceptPrViewComponent', () => {
  let component: AcceptPrViewComponent;
  let fixture: ComponentFixture<AcceptPrViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AcceptPrViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AcceptPrViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RfqSupportQueryComponent } from './rfq-support-query.component';

describe('RfqSupportQueryComponent', () => {
  let component: RfqSupportQueryComponent;
  let fixture: ComponentFixture<RfqSupportQueryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RfqSupportQueryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RfqSupportQueryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

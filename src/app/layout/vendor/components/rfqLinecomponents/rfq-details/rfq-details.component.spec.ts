import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RfqDetailsComponent } from './rfq-details.component';

describe('RfqDetailsComponent', () => {
  let component: RfqDetailsComponent;
  let fixture: ComponentFixture<RfqDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RfqDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RfqDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

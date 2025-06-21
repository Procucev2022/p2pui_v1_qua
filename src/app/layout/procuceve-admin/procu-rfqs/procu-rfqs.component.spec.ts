import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProcuRfqsComponent } from './procu-rfqs.component';

describe('ProcuRfqsComponent', () => {
  let component: ProcuRfqsComponent;
  let fixture: ComponentFixture<ProcuRfqsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProcuRfqsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProcuRfqsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

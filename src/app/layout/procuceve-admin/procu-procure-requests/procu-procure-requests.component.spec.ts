import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProcuProcureRequestsComponent } from './procu-procure-requests.component';

describe('ProcuProcureRequestsComponent', () => {
  let component: ProcuProcureRequestsComponent;
  let fixture: ComponentFixture<ProcuProcureRequestsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProcuProcureRequestsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProcuProcureRequestsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

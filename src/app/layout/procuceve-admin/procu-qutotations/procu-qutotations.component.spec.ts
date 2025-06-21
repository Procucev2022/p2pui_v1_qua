import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProcuQutotationsComponent } from './procu-qutotations.component';

describe('ProcuQutotationsComponent', () => {
  let component: ProcuQutotationsComponent;
  let fixture: ComponentFixture<ProcuQutotationsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProcuQutotationsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProcuQutotationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

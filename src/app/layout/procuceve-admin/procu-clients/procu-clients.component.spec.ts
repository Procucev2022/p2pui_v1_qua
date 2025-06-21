import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProcuClientsComponent } from './procu-clients.component';

describe('ProcuClientsComponent', () => {
  let component: ProcuClientsComponent;
  let fixture: ComponentFixture<ProcuClientsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProcuClientsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProcuClientsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

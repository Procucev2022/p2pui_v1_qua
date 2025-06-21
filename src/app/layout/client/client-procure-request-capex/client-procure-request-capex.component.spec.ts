import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ClientProcureRequestCapexComponent } from './client-procure-request-capex.component';

describe('ClientProcureRequestCapexComponent', () => {
  let component: ClientProcureRequestCapexComponent;
  let fixture: ComponentFixture<ClientProcureRequestCapexComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ClientProcureRequestCapexComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ClientProcureRequestCapexComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

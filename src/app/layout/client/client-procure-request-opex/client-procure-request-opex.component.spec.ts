import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ClientProcureRequestOpexComponent } from './client-procure-request-opex.component';

describe('ClientProcureRequestOpexComponent', () => {
  let component: ClientProcureRequestOpexComponent;
  let fixture: ComponentFixture<ClientProcureRequestOpexComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ClientProcureRequestOpexComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ClientProcureRequestOpexComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

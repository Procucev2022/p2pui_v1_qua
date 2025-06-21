import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ClientProcureRequestComponent } from './client-procure-request.component';

describe('ClientProcureRequestComponent', () => {
  let component: ClientProcureRequestComponent;
  let fixture: ComponentFixture<ClientProcureRequestComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ClientProcureRequestComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ClientProcureRequestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ClientPposComponent } from './client-ppos.component';

describe('ClientPposComponent', () => {
  let component: ClientPposComponent;
  let fixture: ComponentFixture<ClientPposComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ClientPposComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ClientPposComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ClientAnalyticsInfoComponent } from './client-analytics-info.component';

describe('ClientAnalyticsInfoComponent', () => {
  let component: ClientAnalyticsInfoComponent;
  let fixture: ComponentFixture<ClientAnalyticsInfoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ClientAnalyticsInfoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ClientAnalyticsInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

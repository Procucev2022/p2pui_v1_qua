import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ClientSearchForLinkingComponent } from './client-search-for-linking.component';

describe('ClientSearchForLinkingComponent', () => {
  let component: ClientSearchForLinkingComponent;
  let fixture: ComponentFixture<ClientSearchForLinkingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ClientSearchForLinkingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ClientSearchForLinkingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

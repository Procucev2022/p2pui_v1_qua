import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ClientLinkingToItemModalComponent } from './client-linking-to-item-modal.component';

describe('ClientLinkingToItemModalComponent', () => {
  let component: ClientLinkingToItemModalComponent;
  let fixture: ComponentFixture<ClientLinkingToItemModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ClientLinkingToItemModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ClientLinkingToItemModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

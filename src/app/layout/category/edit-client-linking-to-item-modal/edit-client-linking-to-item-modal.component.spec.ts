import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditClientLinkingToItemModalComponent } from './edit-client-linking-to-item-modal.component';

describe('EditClientLinkingToItemModalComponent', () => {
  let component: EditClientLinkingToItemModalComponent;
  let fixture: ComponentFixture<EditClientLinkingToItemModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditClientLinkingToItemModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditClientLinkingToItemModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

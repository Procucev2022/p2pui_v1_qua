import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VenReqViewModalComponent } from './ven-req-view-modal.component';

describe('VenReqViewModalComponent', () => {
  let component: VenReqViewModalComponent;
  let fixture: ComponentFixture<VenReqViewModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VenReqViewModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VenReqViewModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

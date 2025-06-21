import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PoViewDeliveryComponent } from './po-view-delivery.component';

describe('PoViewDeliveryComponent', () => {
  let component: PoViewDeliveryComponent;
  let fixture: ComponentFixture<PoViewDeliveryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PoViewDeliveryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PoViewDeliveryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

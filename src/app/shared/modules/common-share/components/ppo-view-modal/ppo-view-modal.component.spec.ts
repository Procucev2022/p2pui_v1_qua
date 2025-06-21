import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PpoViewModalComponent } from './ppo-view-modal.component';

describe('PpoViewModalComponent', () => {
  let component: PpoViewModalComponent;
  let fixture: ComponentFixture<PpoViewModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PpoViewModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PpoViewModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

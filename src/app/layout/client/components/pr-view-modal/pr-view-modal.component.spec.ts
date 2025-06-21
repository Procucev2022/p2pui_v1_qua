import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PrViewModalComponent } from './pr-view-modal.component';

describe('PrViewModalComponent', () => {
  let component: PrViewModalComponent;
  let fixture: ComponentFixture<PrViewModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PrViewModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PrViewModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

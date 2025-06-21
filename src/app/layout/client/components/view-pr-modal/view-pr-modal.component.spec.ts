import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewPrModalComponent } from './view-pr-modal.component';

describe('ViewPrModalComponent', () => {
  let component: ViewPrModalComponent;
  let fixture: ComponentFixture<ViewPrModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewPrModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewPrModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

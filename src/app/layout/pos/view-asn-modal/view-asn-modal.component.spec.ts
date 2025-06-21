import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewAsnModalComponent } from './view-asn-modal.component';

describe('ViewAsnModalComponent', () => {
  let component: ViewAsnModalComponent;
  let fixture: ComponentFixture<ViewAsnModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewAsnModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewAsnModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

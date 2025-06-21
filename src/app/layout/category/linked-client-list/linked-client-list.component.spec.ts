import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LinkedClientListComponent } from './linked-client-list.component';

describe('LinkedClientListComponent', () => {
  let component: LinkedClientListComponent;
  let fixture: ComponentFixture<LinkedClientListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LinkedClientListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LinkedClientListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

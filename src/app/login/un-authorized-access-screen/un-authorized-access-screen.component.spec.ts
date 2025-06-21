import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UnAuthorizedAccessScreenComponent } from './un-authorized-access-screen.component';

describe('UnAuthorizedAccessScreenComponent', () => {
  let component: UnAuthorizedAccessScreenComponent;
  let fixture: ComponentFixture<UnAuthorizedAccessScreenComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UnAuthorizedAccessScreenComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UnAuthorizedAccessScreenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

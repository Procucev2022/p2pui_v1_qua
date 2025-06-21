import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ForwardedVendorsTabComponent } from './forwarded-vendors-tab.component';

describe('ForwardedVendorsTabComponent', () => {
  let component: ForwardedVendorsTabComponent;
  let fixture: ComponentFixture<ForwardedVendorsTabComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ForwardedVendorsTabComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ForwardedVendorsTabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

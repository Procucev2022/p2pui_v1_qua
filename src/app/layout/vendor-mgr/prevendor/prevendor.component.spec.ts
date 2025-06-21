import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PrevendorComponent } from './prevendor.component';

describe('PrevendorComponent', () => {
  let component: PrevendorComponent;
  let fixture: ComponentFixture<PrevendorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PrevendorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PrevendorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

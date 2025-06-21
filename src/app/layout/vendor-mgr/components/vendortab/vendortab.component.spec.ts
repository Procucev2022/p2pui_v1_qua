import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VendortabComponent } from './vendortab.component';

describe('VendortabComponent', () => {
  let component: VendortabComponent;
  let fixture: ComponentFixture<VendortabComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VendortabComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VendortabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

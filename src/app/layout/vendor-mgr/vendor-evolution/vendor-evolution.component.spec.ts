import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VendorEvolutionComponent } from './vendor-evolution.component';

describe('VendorEvolutionComponent', () => {
  let component: VendorEvolutionComponent;
  let fixture: ComponentFixture<VendorEvolutionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VendorEvolutionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VendorEvolutionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VendorAssignRankModelComponent } from './vendor-assign-rank-model.component';

describe('VendorAssignRankModelComponent', () => {
  let component: VendorAssignRankModelComponent;
  let fixture: ComponentFixture<VendorAssignRankModelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VendorAssignRankModelComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VendorAssignRankModelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

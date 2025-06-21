import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GmtVendorsListComponent } from './gmt-vendors-list.component';

describe('GmtVendorsListComponent', () => {
  let component: GmtVendorsListComponent;
  let fixture: ComponentFixture<GmtVendorsListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GmtVendorsListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GmtVendorsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

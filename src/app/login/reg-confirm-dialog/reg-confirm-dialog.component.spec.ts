import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RegConfirmDialogComponent } from './reg-confirm-dialog.component';

describe('RegConfirmDialogComponent', () => {
  let component: RegConfirmDialogComponent;
  let fixture: ComponentFixture<RegConfirmDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RegConfirmDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RegConfirmDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

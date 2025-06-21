import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CatMgrCreateRfqListComponent } from './cat-mgr-create-rfq-list.component';

describe('CatMgrCreateRfqListComponent', () => {
  let component: CatMgrCreateRfqListComponent;
  let fixture: ComponentFixture<CatMgrCreateRfqListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CatMgrCreateRfqListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CatMgrCreateRfqListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

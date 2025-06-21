import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CatMgrClientRegstrComponent } from './cat-mgr-client-regstr.component';

describe('CatMgrClientRegstrComponent', () => {
  let component: CatMgrClientRegstrComponent;
  let fixture: ComponentFixture<CatMgrClientRegstrComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CatMgrClientRegstrComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CatMgrClientRegstrComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

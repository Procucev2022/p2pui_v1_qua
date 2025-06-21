import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CatMgrItemCatalogueComponent } from './cat-mgr-item-catalogue.component';

describe('CatMgrItemCatalogueComponent', () => {
  let component: CatMgrItemCatalogueComponent;
  let fixture: ComponentFixture<CatMgrItemCatalogueComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CatMgrItemCatalogueComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CatMgrItemCatalogueComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

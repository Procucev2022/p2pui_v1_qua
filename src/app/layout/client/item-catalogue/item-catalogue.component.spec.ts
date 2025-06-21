import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ItemCatalogueComponent } from './item-catalogue.component';

describe('ItemCatalogueComponent', () => {
  let component: ItemCatalogueComponent;
  let fixture: ComponentFixture<ItemCatalogueComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ItemCatalogueComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ItemCatalogueComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

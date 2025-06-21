import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PoItemsComponent } from './po-items.component';

describe('PoItemsComponent', () => {
  let component: PoItemsComponent;
  let fixture: ComponentFixture<PoItemsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PoItemsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PoItemsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

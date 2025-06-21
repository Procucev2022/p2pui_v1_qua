import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PpoItemsComponent } from './ppo-items.component';

describe('PpoItemsComponent', () => {
  let component: PpoItemsComponent;
  let fixture: ComponentFixture<PpoItemsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PpoItemsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PpoItemsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

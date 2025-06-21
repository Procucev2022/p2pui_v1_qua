import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BfsMyItemsComponent } from './bfs-my-items.component';

describe('BfsMyItemsComponent', () => {
  let component: BfsMyItemsComponent;
  let fixture: ComponentFixture<BfsMyItemsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BfsMyItemsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BfsMyItemsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

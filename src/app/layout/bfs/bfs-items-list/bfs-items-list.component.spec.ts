import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BfsItemsListComponent } from './bfs-items-list.component';

describe('BfsItemsListComponent', () => {
  let component: BfsItemsListComponent;
  let fixture: ComponentFixture<BfsItemsListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BfsItemsListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BfsItemsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

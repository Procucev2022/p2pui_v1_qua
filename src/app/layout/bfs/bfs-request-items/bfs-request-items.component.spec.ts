import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BfsRequestItemsComponent } from './bfs-request-items.component';

describe('BfsRequestItemsComponent', () => {
  let component: BfsRequestItemsComponent;
  let fixture: ComponentFixture<BfsRequestItemsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BfsRequestItemsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BfsRequestItemsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

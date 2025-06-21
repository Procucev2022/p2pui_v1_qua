import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BfsCreateItemComponent } from './bfs-create-item.component';

describe('BfsCreateItemComponent', () => {
  let component: BfsCreateItemComponent;
  let fixture: ComponentFixture<BfsCreateItemComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BfsCreateItemComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BfsCreateItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

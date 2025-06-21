import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BFSCommonGridComponent } from './bfs-common-grid.component';

describe('BFSCommonGridComponent', () => {
  let component: BFSCommonGridComponent;
  let fixture: ComponentFixture<BFSCommonGridComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BFSCommonGridComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BFSCommonGridComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

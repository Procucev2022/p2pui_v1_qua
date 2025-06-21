import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PoCreateAsnComponent } from './po-create-asn.component';

describe('PoCreateAsnComponent', () => {
  let component: PoCreateAsnComponent;
  let fixture: ComponentFixture<PoCreateAsnComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PoCreateAsnComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PoCreateAsnComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

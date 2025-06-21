import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LinkClientModalComponent } from './link-client-modal.component';

describe('LinkClientModalComponent', () => {
  let component: LinkClientModalComponent;
  let fixture: ComponentFixture<LinkClientModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LinkClientModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LinkClientModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GeneratedPposComponent } from './generated-ppos.component';

describe('GeneratedPposComponent', () => {
  let component: GeneratedPposComponent;
  let fixture: ComponentFixture<GeneratedPposComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GeneratedPposComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GeneratedPposComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { NumbersOnlyDirective } from './numbers-only.directive';
import { ElementRef } from '@angular/core';

describe('NumbersOnlyDirective', () => {
  let directive: NumbersOnlyDirective;
  let el: ElementRef;

  beforeEach(() => {
    el = { nativeElement: { value: '' } } as any;
    directive = new NumbersOnlyDirective(el);
  });

  it('should create', () => { expect(directive).toBeTruthy(); });

  it('should strip non-numeric characters', () => {
    el.nativeElement.value = '12a3b';
    const event = jasmine.createSpyObj('event', ['stopPropagation']);
    directive.onInputChange(event);
    expect(el.nativeElement.value).toBe('123');
    expect(event.stopPropagation).toHaveBeenCalled();
  });

  it('should not call stopPropagation when value unchanged', () => {
    el.nativeElement.value = '123';
    const event = jasmine.createSpyObj('event', ['stopPropagation']);
    directive.onInputChange(event);
    expect(event.stopPropagation).not.toHaveBeenCalled();
  });
});

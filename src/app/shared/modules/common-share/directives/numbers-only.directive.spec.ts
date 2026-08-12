import { NumbersOnlyDirective } from './numbers-only.directive';

describe('NumbersOnlyDirective', () => {
  let directive: NumbersOnlyDirective;
  let el: { nativeElement: { value: string } };

  beforeEach(() => {
    el = { nativeElement: { value: '' } };
    directive = new NumbersOnlyDirective(el as any);
  });

  it('should create an instance', () => {
    expect(directive).toBeTruthy();
  });

  it('should strip non-numeric characters and stop propagation', () => {
    el.nativeElement.value = '12a3b';
    const event = { stopPropagation: jasmine.createSpy('stopPropagation') };
    directive.onInputChange(event);
    expect(el.nativeElement.value).toBe('123');
    expect(event.stopPropagation).toHaveBeenCalled();
  });

  it('should not stop propagation when value is already numeric', () => {
    el.nativeElement.value = '987';
    const event = { stopPropagation: jasmine.createSpy('stopPropagation') };
    directive.onInputChange(event);
    expect(el.nativeElement.value).toBe('987');
    expect(event.stopPropagation).not.toHaveBeenCalled();
  });
});

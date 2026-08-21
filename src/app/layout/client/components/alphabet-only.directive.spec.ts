import { AlphabetOnlyDirective } from './alphabet-only.directive';

describe('AlphabetOnlyDirective', () => {
  let directive: AlphabetOnlyDirective;

  beforeEach(() => {
    directive = new AlphabetOnlyDirective();
  });

  it('should create an instance', () => {
    expect(directive).toBeTruthy();
  });

  it('should prevent default for disallowed key codes', () => {
    const event = {
      keyCode: 50,
      preventDefault: jasmine.createSpy('preventDefault')
    } as any;
    directive.onKeydown(event);
    expect(directive.key).toBe(50);
    expect(event.preventDefault).toHaveBeenCalled();
  });

  it('should allow alphabet key codes', () => {
    const event = {
      keyCode: 65,
      preventDefault: jasmine.createSpy('preventDefault')
    } as any;
    directive.onKeydown(event);
    expect(event.preventDefault).not.toHaveBeenCalled();
  });

  it('should prevent default for numpad keys', () => {
    const event = {
      keyCode: 100,
      preventDefault: jasmine.createSpy('preventDefault')
    } as any;
    directive.onKeydown(event);
    expect(event.preventDefault).toHaveBeenCalled();
  });

  it('should prevent default for high key codes', () => {
    const event = {
      keyCode: 130,
      preventDefault: jasmine.createSpy('preventDefault')
    } as any;
    directive.onKeydown(event);
    expect(event.preventDefault).toHaveBeenCalled();
  });
});

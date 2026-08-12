import { BlockCopyPasteDirective } from './block-copy-paste.directive';

describe('BlockCopyPasteDirective', () => {
  let directive: BlockCopyPasteDirective;

  beforeEach(() => {
    directive = new BlockCopyPasteDirective();
  });

  it('should create an instance', () => {
    expect(directive).toBeTruthy();
  });

  it('should prevent paste', () => {
    const event = { preventDefault: jasmine.createSpy('preventDefault') } as any;
    directive.blockPaste(event);
    expect(event.preventDefault).toHaveBeenCalled();
  });

  it('should prevent copy', () => {
    const event = { preventDefault: jasmine.createSpy('preventDefault') } as any;
    directive.blockCopy(event);
    expect(event.preventDefault).toHaveBeenCalled();
  });

  it('should prevent cut', () => {
    const event = { preventDefault: jasmine.createSpy('preventDefault') } as any;
    directive.blockCut(event);
    expect(event.preventDefault).toHaveBeenCalled();
  });
});

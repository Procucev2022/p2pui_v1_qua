import { BlockCopyPasteDirective } from './block-copy-paste.directive';

describe('BlockCopyPasteDirective', () => {
  let directive: BlockCopyPasteDirective;

  beforeEach(() => {
    directive = new BlockCopyPasteDirective();
  });

  it('should create', () => {
    expect(directive).toBeTruthy();
  });

  it('blockPaste should call preventDefault', () => {
    const event = jasmine.createSpyObj('event', ['preventDefault']);
    directive.blockPaste(event);
    expect(event.preventDefault).toHaveBeenCalled();
  });

  it('blockCopy should call preventDefault', () => {
    const event = jasmine.createSpyObj('event', ['preventDefault']);
    directive.blockCopy(event);
    expect(event.preventDefault).toHaveBeenCalled();
  });

  it('blockCut should call preventDefault', () => {
    const event = jasmine.createSpyObj('event', ['preventDefault']);
    directive.blockCut(event);
    expect(event.preventDefault).toHaveBeenCalled();
  });
});

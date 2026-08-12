import { DragDirective } from './dragAndDropDirective';
import { DomSanitizer } from '@angular/platform-browser';

describe('DragDirective', () => {
  let directive: DragDirective;
  let sanitizer: jasmine.SpyObj<DomSanitizer>;

  beforeEach(() => {
    sanitizer = jasmine.createSpyObj('DomSanitizer', ['bypassSecurityTrustUrl']);
    directive = new DragDirective(sanitizer);
  });

  it('should create an instance', () => {
    expect(directive).toBeTruthy();
  });

  it('should handle dragover', () => {
    const evt = {
      preventDefault: jasmine.createSpy('preventDefault'),
      stopPropagation: jasmine.createSpy('stopPropagation')
    } as any;
    directive.onDragOver(evt);
    expect(evt.preventDefault).toHaveBeenCalled();
    expect(evt.stopPropagation).toHaveBeenCalled();
  });

  it('should handle dragleave', () => {
    const evt = {
      preventDefault: jasmine.createSpy('preventDefault'),
      stopPropagation: jasmine.createSpy('stopPropagation')
    } as any;
    directive.onDragLeave(evt);
    expect(evt.preventDefault).toHaveBeenCalled();
  });

  it('should emit files on drop', () => {
    const emitSpy = jasmine.createSpy('emit');
    directive.files.emit = emitSpy;
    const fileList = { length: 1, 0: new File(['x'], 'a.txt') } as any;
    const evt = {
      preventDefault: jasmine.createSpy('preventDefault'),
      stopPropagation: jasmine.createSpy('stopPropagation'),
      dataTransfer: { files: fileList }
    } as any;
    directive.onDrop(evt);
    expect(emitSpy).toHaveBeenCalledWith(fileList);
  });
});

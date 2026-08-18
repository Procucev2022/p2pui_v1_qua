import { DragDirective } from './dragAndDropDirective';
import { DomSanitizer } from '@angular/platform-browser';
import { TestBed } from '@angular/core/testing';

describe('DragDirective', () => {
  let directive: DragDirective;
  let sanitizer: DomSanitizer;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    sanitizer = TestBed.inject(DomSanitizer);
    directive = new DragDirective(sanitizer);
  });

  it('should create', () => { expect(directive).toBeTruthy(); });

  it('onDragOver should set background', () => {
    const evt = jasmine.createSpyObj('DragEvent', ['preventDefault', 'stopPropagation']);
    directive.onDragOver(evt);
    expect((directive as any).background).toBe('#999');
  });

  it('onDragLeave should reset background', () => {
    const evt = jasmine.createSpyObj('DragEvent', ['preventDefault', 'stopPropagation']);
    directive.onDragLeave(evt);
    expect((directive as any).background).toBe('#eee');
  });

  it('onDrop should emit files', () => {
    const mockFiles = [new File([''], 'test.txt')];
    const evt = { preventDefault: jasmine.createSpy(), stopPropagation: jasmine.createSpy(), dataTransfer: { files: mockFiles } } as any;
    spyOn(directive.files, 'emit');
    directive.onDrop(evt);
    expect(directive.files.emit).toHaveBeenCalledWith(mockFiles);
    expect((directive as any).background).toBe('#eee');
  });

  it('onDrop should not emit if no files', () => {
    const evt = { preventDefault: jasmine.createSpy(), stopPropagation: jasmine.createSpy(), dataTransfer: { files: null } } as any;
    spyOn(directive.files, 'emit');
    directive.onDrop(evt);
    expect(directive.files.emit).not.toHaveBeenCalled();
  });
});

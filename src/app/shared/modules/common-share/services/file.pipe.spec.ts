import { FilePipe } from './file.pipe';
import { DomSanitizer } from '@angular/platform-browser';
import { TestBed } from '@angular/core/testing';

describe('FilePipe', () => {
  let pipe: FilePipe;
  let sanitizer: DomSanitizer;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    sanitizer = TestBed.inject(DomSanitizer);
    pipe = new FilePipe(sanitizer);
  });

  it('should create', () => {
    expect(pipe).toBeTruthy();
  });

  it('should transform a url to a safe resource url', () => {
    const result = pipe.transform('http://example.com/file.pdf');
    expect(result).toBeTruthy();
  });

  it('should handle empty string', () => {
    const result = pipe.transform('');
    expect(result).toBeTruthy();
  });
});

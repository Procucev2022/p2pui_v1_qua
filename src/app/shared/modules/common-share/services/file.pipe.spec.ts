import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { FilePipe } from './file.pipe';

describe('FilePipe', () => {
  let pipe: FilePipe;
  let sanitizer: jasmine.SpyObj<DomSanitizer>;

  beforeEach(() => {
    sanitizer = jasmine.createSpyObj('DomSanitizer', ['bypassSecurityTrustResourceUrl']);
    sanitizer.bypassSecurityTrustResourceUrl.and.callFake((url: string) => `safe:${url}` as unknown as SafeResourceUrl);
    pipe = new FilePipe(sanitizer);
  });

  it('should create an instance', () => {
    expect(pipe).toBeTruthy();
  });

  it('should bypass security for resource urls', () => {
    const result = pipe.transform('http://example.com/file.pdf');
    expect(sanitizer.bypassSecurityTrustResourceUrl).toHaveBeenCalledWith('http://example.com/file.pdf');
    expect(result).toBe('safe:http://example.com/file.pdf' as any);
  });
});

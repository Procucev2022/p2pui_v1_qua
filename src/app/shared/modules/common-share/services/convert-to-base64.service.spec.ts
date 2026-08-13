import { TestBed } from '@angular/core/testing';
import { ConvertToBase64Service } from './convert-to-base64.service';

describe('ConvertToBase64Service', () => {
  let service: ConvertToBase64Service;
  let OriginalFileReader: typeof FileReader;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ConvertToBase64Service],
    });
    service = TestBed.inject(ConvertToBase64Service);
    OriginalFileReader = (window as any).FileReader;
  });

  afterEach(() => {
    (window as any).FileReader = OriginalFileReader;
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should resolve with FileReader result on load', async () => {
    // Service assigns onload AFTER readAsDataURL — defer callback.
    (window as any).FileReader = function MockFileReader(this: any) {
      this.result = null;
      this.onload = null;
      this.onerror = null;
      this.readAsDataURL = jasmine
        .createSpy('readAsDataURL')
        .and.callFake(() => {
          this.result = 'data:text/plain;base64,YWJj';
          setTimeout(() => {
            if (this.onload) {
              this.onload();
            }
          }, 0);
        });
    };

    const file = new Blob(['abc'], { type: 'text/plain' });
    const result = await service.getBase64(file);
    expect(result).toBe('data:text/plain;base64,YWJj');
  });

  it('should reject when FileReader errors', async () => {
    const readError = new Error('read failed');
    (window as any).FileReader = function MockFileReader(this: any) {
      this.result = null;
      this.onload = null;
      this.onerror = null;
      this.readAsDataURL = jasmine
        .createSpy('readAsDataURL')
        .and.callFake(() => {
          setTimeout(() => {
            if (this.onerror) {
              this.onerror(readError);
            }
          }, 0);
        });
    };

    const file = new Blob(['abc'], { type: 'text/plain' });
    await expectAsync(service.getBase64(file)).toBeRejectedWith(readError);
  });
});

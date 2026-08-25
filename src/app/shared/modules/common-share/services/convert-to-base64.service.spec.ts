import { ConvertToBase64Service } from './convert-to-base64.service';

describe('ConvertToBase64Service', () => {
  let service: ConvertToBase64Service;

  beforeEach(() => {
    service = new ConvertToBase64Service();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('getBase64 should resolve with base64 string for valid file', async () => {
    const blob = new Blob(['hello'], { type: 'text/plain' });
    const file = new File([blob], 'test.txt', { type: 'text/plain' });
    const result = await service.getBase64(file);
    expect((result as string)).toContain('data:text/plain;base64,');
  });

  it('getBase64 should reject on error', async () => {
    const origFileReader = (window as any).FileReader;
    class MockFileReader {
      onload: any;
      onerror: any;
      result: any;
      readAsDataURL(file: any) {
        setTimeout(() => {
          if (this.onerror) {
            this.onerror(new Error('Read failed'));
          }
        }, 0);
      }
    }
    (window as any).FileReader = MockFileReader;
    try {
      const file = new File(['test'], 'test.txt');
      await service.getBase64(file);
      fail('should have rejected');
    } catch (e) {
      expect(e).toBeDefined();
    } finally {
      (window as any).FileReader = origFileReader;
    }
  });

  it('getBase64 should handle empty file', async () => {
    const blob = new Blob([], { type: 'text/plain' });
    const file = new File([blob], 'empty.txt', { type: 'text/plain' });
    const result = await service.getBase64(file);
    expect(result).toBeTruthy();
  });
});

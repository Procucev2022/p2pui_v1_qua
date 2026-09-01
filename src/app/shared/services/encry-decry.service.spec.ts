import { EncryDecryService } from './encry-decry.service';
import { environment } from 'src/environments/environment';

describe('EncryDecryService', () => {
  let service: EncryDecryService;

  beforeEach(() => {
    service = new EncryDecryService();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should encrypt and decrypt a string roundtrip with explicit key', () => {
    const key = '1234567890123456';
    const plain = 'hello-world-secret';
    const encrypted = service.set(key, plain);

    expect(encrypted).toBeTruthy();
    expect(encrypted).not.toEqual(plain);

    const decrypted = service.get(key, encrypted);
    expect(decrypted).toEqual(plain);
  });

  it('should encrypt and decrypt using default environment key when key is omitted', () => {
    const plain = 'test-default-key-payload';
    const encrypted = service.set(plain);

    expect(encrypted).toBeTruthy();
    expect(encrypted).not.toEqual(plain);

    const decrypted = service.get(encrypted);
    expect(decrypted).toEqual(plain);
  });

  it('should encrypt and decrypt JSON payload roundtrip', () => {
    const key = 'permpermpermperm';
    const payload = JSON.stringify({ details: { id: 1, name: 'test' } });
    const encrypted = service.set(key, payload);
    const decrypted = service.get(key, encrypted);
    expect(JSON.parse(decrypted)).toEqual(JSON.parse(payload));
  });

  describe('legacy key fallback', () => {
    const originalKey = environment.storageEncryptionKey;

    afterEach(() => {
      environment.storageEncryptionKey = originalKey;
    });

    it('should decrypt legacy perm-encrypted data when configured key differs', () => {
      const plain = 'legacy-session-payload';
      const legacyEncrypted = service.set('perm', plain);

      environment.storageEncryptionKey = 'new-configured-key';
      const decrypted = service.get(legacyEncrypted);
      expect(decrypted).toEqual(plain);
    });

    it('should return empty string when value cannot be decrypted with any key', () => {
      environment.storageEncryptionKey = 'new-configured-key';
      const decrypted = service.get('not-a-valid-ciphertext');
      expect(decrypted).toEqual('');
    });

    it('should not fall back to legacy key when an explicit key is provided', () => {
      const plain = 'explicit-key-payload';
      const legacyEncrypted = service.set('perm', plain);
      const decrypted = service.get('another-explicit-key', legacyEncrypted);
      expect(decrypted).not.toEqual(plain);
    });
  });
});

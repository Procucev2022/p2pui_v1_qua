import { EncryDecryService } from './encry-decry.service';

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
});

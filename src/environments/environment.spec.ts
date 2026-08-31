import { environment } from './environment';
import { environment as prodEnvironment } from './environment.prod';

describe('environment configuration', () => {
  describe('development environment', () => {
    it('should have production set to false', () => {
      expect(environment.production).toBe(false);
    });

    it('should have baseURL and apiEndpoint defined', () => {
      expect(environment.baseURL).toBeTruthy();
      expect(environment.apiEndpoint).toBeTruthy();
      expect(environment.apiEndpoint).toBe(environment.baseURL);
    });

    it('should have storageEncryptionKey and basicAuthToken properties', () => {
      expect(environment.storageEncryptionKey).toBeTruthy();
      expect(environment.basicAuthToken).toBeDefined();
    });
  });

  describe('production environment', () => {
    it('should have production set to true', () => {
      expect(prodEnvironment.production).toBe(true);
    });

    it('should have baseURL and apiEndpoint defined', () => {
      expect(prodEnvironment.baseURL).toBeTruthy();
      expect(prodEnvironment.apiEndpoint).toBeTruthy();
      expect(prodEnvironment.apiEndpoint).toBe(prodEnvironment.baseURL);
    });

    it('should have storageEncryptionKey and basicAuthToken properties', () => {
      expect(prodEnvironment.storageEncryptionKey).toBeTruthy();
      expect(prodEnvironment.basicAuthToken).toBeDefined();
    });
  });
});

import { environment } from './environment';

describe('environment', () => {
  it('should have production set to false', () => {
    expect(environment.production).toBe(false);
  });

  it('should define baseURL', () => {
    expect(environment.baseURL).toBeDefined();
    expect(typeof environment.baseURL).toBe('string');
    expect(environment.baseURL.length).toBeGreaterThan(0);
  });
});

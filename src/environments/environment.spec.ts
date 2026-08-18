import { environment } from './environment';

describe('environment', () => {
  it('should have production set to false', () => {
    expect(environment.production).toBe(false);
  });

  it('should have a baseURL defined', () => {
    expect(environment.baseURL).toBeTruthy();
  });
});

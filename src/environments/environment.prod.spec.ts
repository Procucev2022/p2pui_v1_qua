import { environment } from './environment.prod';

describe('environment.prod', () => {
  it('should have production set to true', () => {
    expect(environment.production).toBe(true);
  });

  it('should be defined', () => {
    expect(environment).toBeTruthy();
  });
});

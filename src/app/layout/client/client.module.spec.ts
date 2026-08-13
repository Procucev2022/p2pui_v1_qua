import { ClientModule } from './client.module';

describe('ClientModule', () => {
  it('should create an instance', () => {
    expect(new ClientModule()).toBeTruthy();
  });

  it('should be constructible multiple times', () => {
    const a = new ClientModule();
    const b = new ClientModule();
    expect(a).toBeTruthy();
    expect(b).toBeTruthy();
  });
});

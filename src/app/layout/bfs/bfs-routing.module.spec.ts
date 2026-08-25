import { BfsRoutingModule } from './bfs-routing.module';

describe('BfsRoutingModule', () => {
  it('should create an instance', () => {
    expect(new BfsRoutingModule()).toBeTruthy();
  });

  it('should be constructible multiple times', () => {
    const a = new BfsRoutingModule();
    const b = new BfsRoutingModule();
    expect(a).toBeTruthy();
    expect(b).toBeTruthy();
  });
});

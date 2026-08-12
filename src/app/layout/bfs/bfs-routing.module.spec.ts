import { BfsRoutingModule } from './bfs-routing.module';

describe('BfsRoutingModule', () => {
  let module: BfsRoutingModule;

  beforeEach(() => {
    module = new BfsRoutingModule();
  });

  it('should create an instance', () => {
    expect(module).toBeTruthy();
  });
});

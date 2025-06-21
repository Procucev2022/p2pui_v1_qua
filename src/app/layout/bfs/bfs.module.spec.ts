import { BfsModule } from './bfs.module';

describe('BfsModule', () => {
  let bfsModule: BfsModule;

  beforeEach(() => {
    bfsModule = new BfsModule();
  });

  it('should create an instance', () => {
    expect(bfsModule).toBeTruthy();
  });
});

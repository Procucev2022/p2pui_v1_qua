import { CommonShareRoutingModule } from './common-share-routing.module';

describe('CommonShareRoutingModule', () => {
  let module: CommonShareRoutingModule;

  beforeEach(() => {
    module = new CommonShareRoutingModule();
  });

  it('should create an instance', () => {
    expect(module).toBeTruthy();
  });
});

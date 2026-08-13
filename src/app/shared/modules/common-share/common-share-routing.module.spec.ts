import { CommonShareRoutingModule } from './common-share-routing.module';

describe('CommonShareRoutingModule', () => {
  it('should create an instance', () => {
    expect(new CommonShareRoutingModule()).toBeTruthy();
  });

  it('should be constructible multiple times', () => {
    const a = new CommonShareRoutingModule();
    const b = new CommonShareRoutingModule();
    expect(a).toBeTruthy();
    expect(b).toBeTruthy();
  });
});

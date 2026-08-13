import { NotFoundRoutingModule } from './not-found-routing.module';

describe('NotFoundRoutingModule', () => {
  it('should create an instance', () => {
    expect(new NotFoundRoutingModule()).toBeTruthy();
  });

  it('should be constructible multiple times', () => {
    const a = new NotFoundRoutingModule();
    const b = new NotFoundRoutingModule();
    expect(a).toBeTruthy();
    expect(b).toBeTruthy();
  });
});

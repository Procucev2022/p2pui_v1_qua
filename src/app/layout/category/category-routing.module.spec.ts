import { CategoryRoutingModule } from './category-routing.module';

describe('CategoryRoutingModule', () => {
  it('should create an instance', () => {
    expect(new CategoryRoutingModule()).toBeTruthy();
  });

  it('should be constructible multiple times', () => {
    const a = new CategoryRoutingModule();
    const b = new CategoryRoutingModule();
    expect(a).toBeTruthy();
    expect(b).toBeTruthy();
  });
});

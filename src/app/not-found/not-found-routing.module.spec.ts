import { NotFoundRoutingModule } from './not-found-routing.module';

describe('NotFoundRoutingModule', () => {
  let module: NotFoundRoutingModule;

  beforeEach(() => {
    module = new NotFoundRoutingModule();
  });

  it('should create an instance', () => {
    expect(module).toBeTruthy();
  });
});

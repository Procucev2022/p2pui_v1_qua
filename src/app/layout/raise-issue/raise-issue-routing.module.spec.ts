import { RaiseIssueRoutingModule } from './raise-issue-routing.module';

describe('RaiseIssueRoutingModule', () => {
  let module: RaiseIssueRoutingModule;

  beforeEach(() => {
    module = new RaiseIssueRoutingModule();
  });

  it('should create an instance', () => {
    expect(module).toBeTruthy();
  });
});

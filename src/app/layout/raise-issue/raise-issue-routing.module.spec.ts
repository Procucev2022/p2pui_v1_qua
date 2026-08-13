import { RaiseIssueRoutingModule } from './raise-issue-routing.module';

describe('RaiseIssueRoutingModule', () => {
  it('should create an instance', () => {
    expect(new RaiseIssueRoutingModule()).toBeTruthy();
  });

  it('should be constructible multiple times', () => {
    const a = new RaiseIssueRoutingModule();
    const b = new RaiseIssueRoutingModule();
    expect(a).toBeTruthy();
    expect(b).toBeTruthy();
  });
});

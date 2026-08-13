import { RaiseIssueModule } from './raise-issue.module';

describe('RaiseIssueModule', () => {
  it('should create an instance', () => {
    expect(new RaiseIssueModule()).toBeTruthy();
  });

  it('should be constructible multiple times', () => {
    const a = new RaiseIssueModule();
    const b = new RaiseIssueModule();
    expect(a).toBeTruthy();
    expect(b).toBeTruthy();
  });
});

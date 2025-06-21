import { RaiseIssueModule } from './raise-issue.module';

describe('RaiseIssueModule', () => {
  let raiseIssueModule: RaiseIssueModule;

  beforeEach(() => {
    raiseIssueModule = new RaiseIssueModule();
  });

  it('should create an instance', () => {
    expect(raiseIssueModule).toBeTruthy();
  });
});

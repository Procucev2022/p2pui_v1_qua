import { TestBed, inject } from '@angular/core/testing';

import { RaiseIssuesService } from './raise-issues.service';

describe('RaiseIssuesService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [RaiseIssuesService]
    });
  });

  it('should be created', inject([RaiseIssuesService], (service: RaiseIssuesService) => {
    expect(service).toBeTruthy();
  }));
});

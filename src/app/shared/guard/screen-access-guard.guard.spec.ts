import { TestBed, async, inject } from '@angular/core/testing';

import { ScreenAccessGuardGuard } from './screen-access-guard.guard';

describe('ScreenAccessGuardGuard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ScreenAccessGuardGuard]
    });
  });

  it('should ...', inject([ScreenAccessGuardGuard], (guard: ScreenAccessGuardGuard) => {
    expect(guard).toBeTruthy();
  }));
});

import { TestBed, inject } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { ToastrModule } from 'ngx-toastr';

import { ScreenAccessGuardGuard } from './screen-access-guard.guard';

describe('ScreenAccessGuardGuard', () => {
  let guard: ScreenAccessGuardGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule, ToastrModule.forRoot()],
      providers: [ScreenAccessGuardGuard]
    });
    guard = TestBed.inject(ScreenAccessGuardGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });

  describe('isUrlAllowed', () => {
    it('should return true for exact match', () => {
      expect(guard.isUrlAllowed('/categorymgr/buyer-vendors', ['/categorymgr/buyer-vendors'])).toBe(true);
    });

    it('should return true for child route (prefix match)', () => {
      expect(guard.isUrlAllowed('/categorymgr/buyer-vendors/new', ['/categorymgr/buyer-vendors'])).toBe(true);
    });

    it('should return true for deep child route', () => {
      expect(guard.isUrlAllowed('/categorymgr/buyer-vendors/abc123/edit', ['/categorymgr/buyer-vendors'])).toBe(true);
    });

    it('should return false for non-matching url', () => {
      expect(guard.isUrlAllowed('/categorymgr/unknown', ['/categorymgr/buyer-vendors'])).toBe(false);
    });

    it('should return false for null/undefined list', () => {
      expect(guard.isUrlAllowed('/categorymgr/buyer-vendors', null as any)).toBe(false);
      expect(guard.isUrlAllowed('/categorymgr/buyer-vendors', undefined as any)).toBe(false);
    });

    it('should not match partial path segments', () => {
      expect(guard.isUrlAllowed('/categorymgr/buyer-vendors-extra', ['/categorymgr/buyer-vendors'])).toBe(false);
    });
  });
});

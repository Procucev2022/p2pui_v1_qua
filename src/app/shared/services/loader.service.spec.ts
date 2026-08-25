import { TestBed } from '@angular/core/testing';
import { LoaderService } from './loader.service';

describe('LoaderService (shared/services)', () => {
  let service: LoaderService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [LoaderService]
    });
    service = TestBed.inject(LoaderService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should expose isLoading BehaviorSubject defaulting to false', () => {
    let value: boolean;
    service.isLoading.subscribe(v => (value = v));
    expect(value).toBe(false);
    service.isLoading.next(true);
    expect(value).toBe(true);
  });
});

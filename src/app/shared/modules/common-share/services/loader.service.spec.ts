import { TestBed } from '@angular/core/testing';
import { LoaderService } from './loader.service';

describe('LoaderService (common-share)', () => {
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

  it('should toggle isLoading', () => {
    expect(service.isLoading.value).toBe(false);
    service.isLoading.next(true);
    expect(service.isLoading.value).toBe(true);
  });
});

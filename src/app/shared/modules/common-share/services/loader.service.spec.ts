import { LoaderService } from './loader.service';

describe('LoaderService (common-share)', () => {
  let service: LoaderService;

  beforeEach(() => {
    service = new LoaderService();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should default isLoading to false', () => {
    let val: boolean;
    service.isLoading.subscribe(v => val = v);
    expect(val).toBe(false);
  });

  it('should update isLoading', () => {
    let val: boolean;
    service.isLoading.subscribe(v => val = v);
    service.isLoading.next(true);
    expect(val).toBe(true);
  });
});

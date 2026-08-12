import { FormControl } from '@angular/forms';
import { CustomValidationsService } from './custom-validations.service';
import { AppConfig } from 'src/app/app.config';

describe('CustomValidationsService', () => {
  let service: CustomValidationsService;

  beforeEach(() => {
    service = new CustomValidationsService();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should validate stringsOnly', () => {
    expect(service.stringsOnly(new FormControl('Hello'))).toBeNull();
    expect(service.stringsOnly(new FormControl('Hi1'))['stringsOnly']).toBe(true);
    expect(service.stringsOnly(new FormControl(''))['stringsOnly']).toBe(true);
  });

  it('should validate numberOnly including zero', () => {
    expect(service.numberOnly(new FormControl(0))).toBeNull();
    expect(service.numberOnly(new FormControl('12'))).toBeNull();
    expect(service.numberOnly(new FormControl('ab'))['numbersOnly']).toBe(true);
  });

  it('should validate mobileNumber', () => {
    expect(service.mobileNumber(new FormControl('9876543210'))).toBeNull();
    expect(service.mobileNumber(new FormControl('123'))['mobileNumber']).toBe(true);
    expect(service.mobileNumber(new FormControl(''))['mobileNumber']).toBe(true);
  });

  it('should validate noWhiteSpace', () => {
    expect(service.noWhiteSpace(new FormControl('ok'))).toBeNull();
    expect(service.noWhiteSpace(new FormControl(' leading'))['whiteSpace']).toBe(true);
    expect(service.noWhiteSpace(new FormControl('   '))['whiteSpace']).toBe(true);
  });

  it('should validate avoidWhiteSpace', () => {
    expect(service.avoidWhiteSpace(new FormControl('ok'))).toBeNull();
    expect(service.avoidWhiteSpace(new FormControl('a b'))['restrictWhiteSpace']).toBe(true);
    expect(service.avoidWhiteSpace(new FormControl(''))['restrictWhiteSpace']).toBe(true);
  });

  it('should build grid page info', () => {
    expect(service.getGridPageInfo(null, 10)).toBeUndefined();
    expect(service.getGridPageInfo({ first: 0, rows: 10 }, 25))
      .toBe('Showing 1 to 10 of 25 records');
    expect(service.getGridPageInfo({ first: 20, rows: 10 }, 25))
      .toBe('Showing 21 to 25 of 25 records');
  });

  it('should build init and audit page info', () => {
    const initSize = AppConfig.GRID_PAGE_INFO.initpageSize;
    expect(service.initGetPageInfo(5)).toContain('Showing 1 to 5 of 5 records');
    expect(service.initGetPageInfo(initSize + 50)).toContain(`Showing 1 to ${initSize} of ${initSize + 50} records`);
    expect(service.auditGetPageInfo(3, 10)).toBe('Showing 1 to 3 of 3 records');
    expect(service.auditGetPageInfo(50, 10)).toBe('Showing 1 to 10 of 50 records');
  });
});

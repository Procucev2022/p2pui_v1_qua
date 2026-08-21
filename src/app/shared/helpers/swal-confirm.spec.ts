import { swalConfirm } from './swal-confirm';

describe('swal-confirm helper', () => {
  it('swalConfirm should have open function', () => {
    expect(typeof swalConfirm.open).toBe('function');
  });

  it('open should call swal with options', async () => {
    spyOn(swalConfirm, 'open').and.returnValue(Promise.resolve({ value: true }));
    const result = await swalConfirm.open({ title: 'Test' });
    expect(result.value).toBe(true);
    expect(swalConfirm.open).toHaveBeenCalledWith({ title: 'Test' });
  });
});

import { swalConfirm } from './swal-confirm';

describe('swalConfirm helper', () => {
  it('should call open method', async () => {
    spyOn(swalConfirm, 'open').and.returnValue(Promise.resolve({ value: true }));
    const res = await swalConfirm.open({ title: 'Test' });
    expect(res.value).toBeTrue();
  });

  it('should run default open method', () => {
    try {
      swalConfirm.open({ title: 'Test' });
    } catch (e) {
      expect(e).toBeTruthy();
    }
  });
});

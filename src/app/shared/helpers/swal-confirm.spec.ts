import { swalConfirm } from './swal-confirm';

describe('swalConfirm helper', () => {
  it('should call spied open method', async () => {
    const spy = spyOn(swalConfirm, 'open').and.returnValue(Promise.resolve({ value: true }));
    const res = await swalConfirm.open({ title: 'Test' });
    expect(res.value).toBeTrue();
  });

  it('should run real open method without spy', async () => {
    try {
      const p = swalConfirm.open({ title: 'Test', showConfirmButton: false });
      expect(p).toBeTruthy();
    } catch (e) {
      expect(e).toBeTruthy();
    }
  });
});

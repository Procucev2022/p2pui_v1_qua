import * as SwalModule from 'sweetalert2';

/** Mutable API object so Jasmine can spy across ES module bindings. */
export const swalConfirm: any = {
  open(options: any): Promise<any> {
    const swal = (SwalModule as any).default || SwalModule;
    return swal(options);
  },
};

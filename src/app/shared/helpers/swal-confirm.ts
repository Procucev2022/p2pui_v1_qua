import swal from 'sweetalert2';

/** Mutable API object so Jasmine can spy across ES module bindings. */
export const swalConfirm: any = {
  open(options: any): Promise<any> {
    return (swal as any)(options);
  },
};

import { Component, OnInit, Inject, Optional } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { FormsModule, NgForm, ReactiveFormsModule } from '@angular/forms';
import { VendorRegistrationService } from 'src/app/vendor-registration/services/vendor-registration.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'add-services',
  templateUrl: './add-services.component.html',
  styleUrls: ['./add-services.component.css'],
  standalone: true,
  imports:[FormsModule,ReactiveFormsModule, MatDialogModule]
})
export class AddServicesComponent implements OnInit {

  model: any = {};
  SACCodes: any[] = [];
  vendorRegData: any;
  ngOnInit() {
    // this.getSacCodes();
    this.vendorRegData = this.data;
  }
  constructor(
    public dialogRef: MatDialogRef<AddServicesComponent>,  @Optional() @Inject(MAT_DIALOG_DATA) public data,
    private vendorRegSer: VendorRegistrationService,
    private toastrService: ToastrService) { }

  closeDialog() {
    this.dialogRef.close({ event: 'Cancel' });
  }

  onAddService(addForm: NgForm) {
    if (addForm.invalid) {
      return;
    }

    if (this.data.isNewVendor) {
      this.dialogRef.close({ event: 'submit', data: addForm.value });
    } else {
      this.vendorRegData['vendorService'].push(addForm.value);
      this.vendorRegSer.submitVendorRegistration(this.vendorRegData).subscribe((response) => {
        this.dialogRef.close({ event: 'submit', data: addForm.value });
        if (response['status'] === 'Success') {
          this.toastrService.success(response['message'], 'Success');
        } else {
          this.toastrService.error('Failed to update vendor details', 'Failed');
        }
      });
    }
  }

//   getSacCodes() {
//     this.vendorRegSer.getSacCodes().subscribe((res: any) => {
//       if (res) {
//         this.SACCodes = res || []
//       }
//     })
//   }

}
















































//   ProductService : FormGroup;

//   constructor(private dialogRef:MatDialogRef<ProductServicesComponent>) { }

//   ngOnInit() {
//     this.ProductService = new FormGroup({
//       $key : new FormControl(),
//       hsnCode: new FormControl(),
//       sacCode: new FormControl(),
//       proDuctname : new FormControl(),
//       discription : new FormControl(),
//       others : new FormControl()
//     })
//   }
//   onSubmit(){
//     this.onClose();
//   }
//   onClose(){
//     this.dialogRef.close();
//   }

// }

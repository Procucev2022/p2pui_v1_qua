import { Component, OnInit } from '@angular/core';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { FormsModule, NgForm } from '@angular/forms';
import { VendorRegistrationService } from '../../services/vendor-registration.service';

@Component({
  selector: 'add-services',
  templateUrl: './add-services.component.html',
  styleUrls: ['./add-services.component.css'],
  standalone: true,
  imports: [FormsModule, MatDialogModule]
})
export class AddServicesComponent implements OnInit {

  model: any = {};
  SACCodes: any[] = [];
  ngOnInit() {
    this.getSacCodes();
  }
  constructor(
    public dialogRef: MatDialogRef<AddServicesComponent>,
    private vendorRegSer: VendorRegistrationService) { }

  closeDialog() {
    this.dialogRef.close({ event: 'Cancel' });
  }

  onAddService(addForm: NgForm) {
    this.dialogRef.close({ event: 'submit', data: addForm.value });
  }

  getSacCodes() {
    this.vendorRegSer.getSacCodes().subscribe((res: any) => {
      if (res) {
        this.SACCodes = res;
      }
    })
  }

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

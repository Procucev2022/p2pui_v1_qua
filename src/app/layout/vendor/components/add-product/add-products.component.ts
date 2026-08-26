import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { FormsModule, NgForm, ReactiveFormsModule } from '@angular/forms';
import { VendorRegistrationService } from 'src/app/vendor-registration/services/vendor-registration.service';
import { Optional } from 'ag-grid-community';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'add-products',
  templateUrl: './add-products.component.html',
  styleUrls: ['./add-products.component.css'],
  standalone: true,
  imports:[FormsModule,ReactiveFormsModule, MatDialogModule]
})
export class AddProductsComponent implements OnInit {

  model: any = {};
  HSNCodes: any[] = [];
  fileToUpload: any;
  imageUrl: any;
  ngOnInit() {
   // this.getHsnCodes();
   console.log('this.data', this.data);
  }
  constructor(
    public dialogRef: MatDialogRef<AddProductsComponent>, @Optional() @Inject(MAT_DIALOG_DATA) public data,
    private vendorRegSer: VendorRegistrationService,
    private toastrService: ToastrService) {}


  closeDialog() {
    this.dialogRef.close({event: 'Cancel'});
  }

  onAddProduct(addForm: NgForm) {
    if (addForm.invalid) {
      return;
    }

    if (this.data.isNewVendor) {
      addForm.value['fileName'] = this.fileToUpload.name;
      addForm.value['file'] = this.imageUrl.split(',')[1];
      this.dialogRef.close({event: 'submit', data: addForm.value});
    } else {
      this.data['vendorProduct'].push(addForm.value);
      this.vendorRegSer.submitVendorRegistration(this.data).subscribe((response) => {
        this.dialogRef.close({event: 'submit', data: addForm.value});
        if (response['status'] === 'Success') {
          this.toastrService.success(response['message'], 'Success');
        } else {
          this.toastrService.error('Failed to update vendor details', 'Failed');
        }
      });
    }
  }


  handleFileInput(file: FileList) {
    this.fileToUpload = file.item(0);
      console.log(this.fileToUpload)
    //Show image preview
    let reader = new FileReader();
    reader.onload = (event: any) => {
      this.imageUrl = event.target.result;
      console.log(this.imageUrl)
    }
    reader.readAsDataURL(this.fileToUpload);
  }

//   getHsnCodes(){
//     this.vendorRegSer.getHsnCodes().subscribe((res:any)=>{
//       if(res){
//         this.HSNCodes = res || [];
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

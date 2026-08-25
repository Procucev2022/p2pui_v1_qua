import { Component, OnInit } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { VendorRegistrationService } from '../../services/vendor-registration.service';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'add-products',
  templateUrl: './add-products.component.html',
  styleUrls: ['./add-products.component.css'],
  standalone: true,
  imports: [FormsModule, MatDialogModule]
})
export class AddProductsComponent implements OnInit {

  model: any = {};
  HSNCodes: any[] = [];
  ngOnInit(){
    this.getHsnCodes();
  }
  constructor(
    public dialogRef: MatDialogRef<AddProductsComponent>,
    private vendorRegSer: VendorRegistrationService){}

  closeDialog(){
    this.dialogRef.close({event:'Cancel'});
  }

  onAddProduct(addForm:NgForm){
    this.dialogRef.close({event:'submit', data: addForm.value});
  }

  getHsnCodes(){
    this.vendorRegSer.getHsnCodes().subscribe((res:any)=>{
      if(res){
        this.HSNCodes = res;
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

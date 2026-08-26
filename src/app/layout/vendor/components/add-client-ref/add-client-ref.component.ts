import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { NgForm } from '@angular/forms';
import { VendorRegistrationService } from 'src/app/vendor-registration/services/vendor-registration.service';
import { Optional } from 'ag-grid-community';
import { ToastrService } from 'ngx-toastr';
import { ConvertToBase64Service } from 'src/app/shared/modules/common-share/services/convert-to-base64.service';

@Component({
  selector: 'app-add-client-ref',
  templateUrl: './add-client-ref.component.html',
  styleUrls: ['./add-client-ref.component.scss']
})
export class AddClientRefComponent implements OnInit {


    model: any = {};
    action:string;
    local_data:any;
    selectedDocumentsArray: any[] = [];
    selectedDocuments: any = [];
    HSNCodes: any[] = [];
    fileToUpload: any;
    imageUrl: any;
    ngOnInit() {
     // this.getHsnCodes();
     console.log('this.data', this.data);
    }
    constructor(
      public dialogRef: MatDialogRef<AddClientRefComponent>, @Optional() @Inject(MAT_DIALOG_DATA) public data,
      private vendorRegSer: VendorRegistrationService,
      private toastrService: ToastrService,private convertSer: ConvertToBase64Service) {}


    closeDialog() {
      this.dialogRef.close({event: 'Cancel'});
    }

    onAddClient(addForm: NgForm) {
      if (addForm.invalid) {
        return;
      }

      if (this.data.isNewVendor) {
        addForm.value['files'] = this.selectedDocuments;
        this.dialogRef.close({event: 'submit', data: addForm.value});
      } else {
        addForm.value['files'] = this.imageUrl ? [{
          'file' : this.imageUrl.split(',')[1],
          'fileName' : this.fileToUpload.name
        }] : [];
        this.data['clientReference'].push(addForm.value);
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

    onFileUpload(file: FileList){
        // this.selectedDocumentsArray = Array.from(event.target.files);

        // this.selectedDocumentsArray.forEach(file => {
        //   this.convertSer.getBase64(file).then((data:string)=>{
        //     var temp = {
        //       fileName: file.name,
        //       file: data.split(',')[1]
        //     }
        //     this.selectedDocuments.push(temp);
        //   })
        //   this.model.files = this.selectedDocuments;

        // });
        // console.log(this.model.file);
        // console.log(this.model.files);

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

}

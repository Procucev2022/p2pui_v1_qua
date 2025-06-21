import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { RaiseIssuesService } from '../../services/raise-issues.service';
import { NgForm } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { ConvertToBase64Service } from 'src/app/shared/modules/common-share/services/convert-to-base64.service';

@Component({
    selector: 'app-create-issue',
    templateUrl: './create-issue.component.html',
    styleUrls: ['./create-issue.component.scss']
})
export class CreateIssueComponent implements OnInit {
    clients: any[] = [];
    vendors: any[] = [];
    clientId: any;
    vendorId: any;
    questions: any;
    selectedClientCompanyId: any;
    selectedVendorCompanyId: any;
    certificatesArray: any[] = [];
    certificatesToBase64: any[] = [];
    constructor(public dialogRef: MatDialogRef<CreateIssueComponent>,
        private raiseIssuesSer: RaiseIssuesService,
        private toaster: ToastrService, private convertSer: ConvertToBase64Service) { }

    ngOnInit() {
        this.getAllClients();
        this.getAllVendors();
    }

    getAllClients() {
        this.raiseIssuesSer.getAllClients().subscribe((res: any) => {
            if (Array.isArray(res)) {
                this.clients = res;
            }
        });
    }
    uploadCertificates(files) {
        console.log('files', files);
        Array.from(files).forEach(file => {
          this.certificatesArray.push(file);
        });
        this.multi();
      }
      multi() {
        if (this.certificatesArray.length > 0) {
            this.certificatesArray.forEach(element => {
              console.log('element.cer', element);
              if (element.isOldCertificate) {

              } else {
                this.certificatesToBase64 = [];

                this.convertSer.getBase64(element).then((data: string) => {
                  const temp = {
                    fileName: element.name,
                    file: data.split(',')[1]
                  };
                  this.certificatesToBase64.push(temp);
                });
              }
            });
          }
      }
      deleteAttachment(index, type) {
        this[type].splice(index, 1);
        if (type === 'certificatesArray') {
          this.certificatesToBase64.splice(index, 1);
        //   this.vendorRegObj.certificates.splice(index, 1);
        }
            console.log('certificatesArray', this.certificatesArray);
      }

    getAllVendors() {
        this.raiseIssuesSer.getAllVendors().subscribe((res: any) => {
            if (Array.isArray(res)) {
                this.vendors = res;
            }
        });
    }

    onSubmit(form: NgForm) {
        if (form.valid) {
            const req = {
                'clientId': {id: this.clientId},
                'vendorId': {id: this.vendorId},
                'questions': this.questions,
                'vendorprocucevdocuments': this.certificatesToBase64
            };
            this.raiseIssuesSer.raiseQuery(req).subscribe((res: any) => {
                if (res.status === 'Success') {
                    this.toaster.success(res.message, 'Success');
                    this.dialogRef.close({ event: 'submit' });
                } else {
                    this.toaster.error(res.message, 'Error');
                }

            });
        } else {
            this.toaster.warning('Please Enter required fields', 'Warning');
        }
    }

    closeDialog() {
        this.dialogRef.close({ event: 'Cancel' });
    }

    resetPanel(form: NgForm) {
        form.reset();
    }

    onSelectClient(id) {
        const temp: any = this.clients.filter((c) => {
            return c.id === id;
        });
        this.selectedClientCompanyId = temp[0].companyId;
    }

    onSelectVendor(id) {
        const temp: any = this.vendors.filter((c) => {
            return c.id === id;
        });
        this.selectedVendorCompanyId = temp[0].companyId;
    }
    uploadFile($event) {
        console.log($event);

    }
}

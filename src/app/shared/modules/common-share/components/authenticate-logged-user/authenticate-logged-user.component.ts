import { CreateRfqService } from './../../../../../layout/category-mgr/services/create-rfq.service';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { EncryDecryService } from '../../../../../shared/services/encry-decry.service';
import { ToastrService } from 'ngx-toastr';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
    selector: 'app-authenticate-logged-user',
    templateUrl: './authenticate-logged-user.component.html',
    styleUrls: ['./authenticate-logged-user.component.scss']
})
export class AuthenticateLoggedUserComponent implements OnInit {

    authForm!: FormGroup;
    loggedUserPermissions: any;
    loggedUserDetails: any;
    loggedUserName: any;
    constructor(private dialogRef: MatDialogRef<AuthenticateLoggedUserComponent>, private encryDecryService: EncryDecryService, private createRfqService: CreateRfqService, private toaster: ToastrService) {
        const temp = JSON.parse(this.encryDecryService.get(localStorage.getItem('logData')));
        this.loggedUserPermissions = temp.details.listofPermission;
        this.loggedUserDetails = temp.details;
        this.loggedUserName = this.loggedUserDetails.username ? this.loggedUserDetails.username : '';
        this.authForm = new FormGroup({
            email: new FormControl(this.loggedUserName, Validators.required),
            password: new FormControl('', Validators.required)
        })
    }

    ngOnInit() {

    }

    onAuthenticate() {

        if (!this.authForm.valid) {
            this.toaster.warning("Please Eneter valid Password!!")
            return false;
        }
        if (this.loggedUserDetails.auth == true) {
            this.createRfqService.updateAuthenticationUser(this.authForm.value).subscribe((res) => {
                if (res) {
                    this.dialogRef.close({ event: 'Cancel' });
                    this.toaster.success("Password updated Successfully","Success")
                }
            })
        } else {


            this.createRfqService.saveAuthenticateUser(this.authForm.value).subscribe((res) => {
                if (res) {
                    this.dialogRef.close({ event: 'Cancel' });
                    this.toaster.success("Password updated Successfully","Success")
                }
            })
        }
        this.authForm.controls['password'].setValue('')
    }

    resetForm() {
        this.authForm.controls['password'].setValue('')
    }

}

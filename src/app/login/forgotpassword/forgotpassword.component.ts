import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { ToastrService } from 'ngx-toastr';
import { AuthenticationService } from 'src/app/shared/services/authentication.service';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-forgotpassword',
  templateUrl: './forgotpassword.component.html',
  styleUrls: ['./forgotpassword.component.scss'],

})
export class ForgotpasswordComponent implements OnInit {

    userName;
    phone:any;
    isEmailEmpty: boolean;
    routerParams: any;
    constructor(
      public router: Router,
      private authService: AuthenticationService,
      private toastService: ToastrService,
      private route: ActivatedRoute
    ) {}

    ngOnInit() {



    }

    onSubmit(form:NgForm) {
        if(this.userName == null){
        this.isEmailEmpty = true;
            return false;
        }
        console.log(form)
        let req ={
            "username":form.value.userName,
            "phone": form.value.phone
        }
        console.log(req)
        this.authService.forgotpassword(req).subscribe((res:any) =>{
            if(res.statusCode == 'Success'){
                this.toastService.success(res.errorMessage,'Success')
            }else{
                this.toastService.error(res.errorMessage,'Failure')
            }
        });



    }

    resetCredentialsMsg(){
        this.isEmailEmpty = false;
    }


  numberOnly(event): boolean {
        const charCode = event.which ? event.which : event.keyCode;
        if (charCode > 31 && (charCode < 48 || charCode > 57)) {
            return false;
        }
        return true;
    }

}

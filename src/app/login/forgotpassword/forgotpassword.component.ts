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
    intervalTime: any;
    isSentMail:boolean;
    redirectIn: number = 10;
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
                this.toastService.success(res.errorMessage,'Success');
                this.isSentMail = true;
                this.navigateToLoginPage();
            }else{
                this.toastService.error(res.errorMessage,'Failure')
            }
        });



    }

    resetCredentialsMsg(){
        this.isEmailEmpty = false;
    }

    navigateToLoginPage() {
        this.userName ='';
        this.phone ='';
        this.intervalTime = setInterval(()=>{
            if(this.redirectIn > 0){
                this.redirectIn --;
            }else{
                clearInterval(this.intervalTime);
                this.isSentMail = false;
                this.router.navigate(["/login"])
            }

        }, 1000)
    }


  numberOnly(event): boolean {
        const charCode = event.which ? event.which : event.keyCode;
        if (charCode > 31 && (charCode < 48 || charCode > 57)) {
            return false;
        }
        return true;
    }

}

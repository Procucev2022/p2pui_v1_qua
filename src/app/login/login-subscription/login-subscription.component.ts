import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '../../shared/services/authentication.service';
import { Router } from '@angular/router';
import { EncryDecryService } from '../../../app/shared/services';
import { SystemViewConfig } from 'src/app/app.config';

@Component({
  selector: 'app-login-subscription',
  templateUrl: './login-subscription.component.html',
  styleUrls: ['./login-subscription.component.scss']
})
export class LoginSubscriptionComponent implements OnInit {
    data: any;
    SYSTEM_VIEW_CONFIG = SystemViewConfig;
  constructor(private authService: AuthenticationService, private router: Router,
    private encryDecryService: EncryDecryService) { }

  ngOnInit() {

    const req  = {
        'username':  localStorage.getItem('loggedUser')
      };

      this.authService.getLoggedUserData(req).subscribe((data) => {

          if (data) {
            this.data = data;
            this.data['org'].bfsName = "BFS PRO"

          }else{
            this.router.navigate(['/login'])
          }

        });
    }
        onSelectedSubscriptions(sysValue){
            this.authService.onSelectedSubscriptions(sysValue, this.data)

          }


          backToLogin(){
            localStorage.clear();
            this.router.navigate(['/login'])
          }
}

import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '../../shared/services/authentication.service';
import { Router } from '@angular/router';
import { EncryDecryService } from '../../../app/shared/services'; 
import { LoaderService } from '../../shared/modules/common-share/services/loader.service';
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
    private encryDecryService: EncryDecryService, private loaderService: LoaderService) { }

  ngOnInit() {

    const req  = {
        'username':  localStorage.getItem('loggedUser'),
        'phone': localStorage.getItem('loggedUserMobile')
      };

      this.authService.getLoggedUserData(req).subscribe((data) => {

          if (data) {
            this.data = data;
            this.data['org'].bfsName = "BFS PRO";

            const isDemoBuyerUser = (
              data.verificationStatus === 'DEMO_BUYER' ||
              data.sourceType === 'EMAIL' ||
              data.isDemoBuyer === true ||
              (data.phone && (data.phone.includes('9999999991') || data.phone.includes('0000000000'))) ||
              (data.org?.organizationPhonenumber && (data.org.organizationPhonenumber.includes('9999999991') || data.org.organizationPhonenumber.includes('0000000000')))
            ) && data.verificationStatus !== 'PROFILE_COMPLETED';

            if (isDemoBuyerUser && data.role?.roleName === 'ClientInitiator') {
              this.onSelectedSubscriptions('gmtName');
              return;
            }
          }else{
            this.router.navigate(['/login'])
          }

        });
    }
        onSelectedSubscriptions(sysValue){
            this.loaderService.isLoading.next(true);
            this.authService.onSelectedSubscriptions(sysValue, this.data);

          }


          backToLogin(){
            localStorage.clear();
            this.router.navigate(['/login']);
          }
}

import { Component, OnInit } from '@angular/core';
import { EncryDecryService } from 'src/app/shared/services';
import { AuthenticationService } from 'src/app/shared/services/authentication.service';

@Component({
  selector: 'app-my-category-list',
  templateUrl: './my-category-list.component.html',
  styleUrls: ['./my-category-list.component.scss']
})
export class MyCategoryListComponent implements OnInit {

  loggedUserDetails: any;
  loggedUserInfo: any;
  updatedTimeAgo: number;
  updatedTimeAgoInterval: any;
  constructor(private authService: AuthenticationService, private encryDecryService: EncryDecryService) { }

  ngOnInit(): void {
    // Initialization logic here
     let temp =  JSON.parse(this.encryDecryService.get(localStorage.getItem('logData')) );
        this.loggedUserDetails = temp.details;
    this.getUserInfo();
  }

   getUserInfo(){
        this.authService.getLoggedUserData({
              "username": this.loggedUserDetails.username,
                "phone":  this.loggedUserDetails.phone
        }).subscribe((res:any)=>{
            if(res){
                this.loggedUserInfo = res;
                this.updatedTimeAgo = Date.now();
                    if(this.updatedTimeAgoInterval){
                        clearInterval(this.updatedTimeAgoInterval);
                    }
            }
        })
    }

}

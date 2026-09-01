import { Component, OnInit } from '@angular/core';
import { EncryDecryService } from 'src/app/shared/services';

@Component({
  selector: 'app-faqs-document',
  templateUrl: './faqs-document.component.html',
  styleUrls: ['./faqs-document.component.scss']
})
export class FaqsDocumentComponent implements OnInit {

  loggedUserPermissions: any;
  loggedUserDetails: any;
  loggedUserName: any;
  roleName: any;

  constructor(private encryDecryService: EncryDecryService) { }

  ngOnInit() {
    const temp = JSON.parse(this.encryDecryService.get(localStorage.getItem('logData')));
        this.loggedUserPermissions = temp.details.listofPermission;
        this.loggedUserDetails = temp.details;
        this.loggedUserName = this.loggedUserDetails.username;
        this.roleName = this.loggedUserDetails.role.roleName;
  }

}

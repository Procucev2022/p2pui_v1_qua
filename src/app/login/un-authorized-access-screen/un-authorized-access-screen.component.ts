import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AuthenticationService } from 'src/app/shared/services/authentication.service';

@Component({
  selector: 'app-un-authorized-access-screen',
  templateUrl: './un-authorized-access-screen.component.html',
  styleUrls: ['./un-authorized-access-screen.component.scss']
})
export class UnAuthorizedAccessScreenComponent implements OnInit {

    constructor(private modalDialog: MatDialog, private authService: AuthenticationService) { }

    ngOnInit() {
      this.modalDialog.closeAll();
      localStorage.clear();

    }

}

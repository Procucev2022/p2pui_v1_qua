import { Component, OnInit, Inject, ViewChild, OnDestroy, TemplateRef, ChangeDetectorRef } from '@angular/core';
import { IAppConfig, APP_CONFIG } from 'src/app/app.config';
import { EncryDecryService } from '../shared/services';
import { MatDialog } from '@angular/material/dialog';
import { AuthenticationService } from '../shared/services/authentication.service';
import { first } from 'rxjs/operators';
import { Router } from '@angular/router';
import { ConfirmationService } from 'primeng/api';

@Component({
    selector: 'app-layout',
    templateUrl: './layout.component.html',
    styleUrls: ['./layout.component.scss']
})
export class LayoutComponent implements OnInit, OnDestroy {

    collapedSideBar: boolean;
    userRoles: string[];
    loggedUserRole: string;
    userExists:boolean;
    loggedUserPermissions: any;
    loggedUserDetails: any;
    loggedUserName: any;
    roleName: any;
    currentView: any;
    clearInterval: any;
    sessionTime :number =0;
    sessionTimeInSeconds = 0;

    @ViewChild('otpTemplate') termsTemplate:any;
    @ViewChild('sessionTemplate')sessionTemplate: TemplateRef<any>;
    clearIntervalForExpiration: any;
    constructor(@Inject(APP_CONFIG) private config: IAppConfig, private encryDecryService: EncryDecryService, private router: Router,
    private dialog: MatDialog, private authService:AuthenticationService,  private confirmationService: ConfirmationService, private cd: ChangeDetectorRef) {}

    ngOnInit() {
        this.userRoles = this.config.userRoles;
        this.loggedUserRole = this.config.loggedUserRole || undefined;
        this.userExists = this.userRoles.includes(this.loggedUserRole);
        console.log(this.userExists,'isUserExists');
        if(localStorage.getItem('rt') && localStorage.getItem('et')){
            this.getSessionTime();
        }

        const temp = JSON.parse(this.encryDecryService.get(localStorage.getItem('logData')));
        this.loggedUserPermissions = temp.details.listofPermission;
        this.loggedUserDetails = temp.details;
        this.loggedUserName = this.loggedUserDetails.username;
        this.roleName = this.loggedUserDetails.role.roleName;
        this.currentView = !localStorage.getItem('system-view') ? JSON.parse(localStorage.getItem('system-view')): localStorage.getItem('system-view');

    }

    getSessionTime(){
        let et = localStorage.getItem('et')? Number(localStorage.getItem('et')): 7000;
        this.sessionTime =   et  ? ( et * 1000) : 300000;
        this.sessionTimeInSeconds = this.sessionTime/1000;
        this.clearInterval=  setTimeout(()=>{
            this.openSessionWindow();
        },  this.sessionTime - 30000 );
        this.clearIntervalForExpiration= setInterval(()=>{
                this.sessionTimeInSeconds --;
                this.authService.$expiresTime.next(this.sessionTimeInSeconds);
                if(this.sessionTimeInSeconds <= 0){
                    clearInterval(this.clearIntervalForExpiration);
                    this.onLoggedout();
                }
        }, 1000)
    }

    hitRefreshToken(){
        this.authService.getRefreshToken().pipe(first()).subscribe(data => {
            console.log('RF.');
            this.getSessionTime();
        }, (error) => {
            console.log('RFRSH_TKN_STS FAILED')
        });
    }

    receiveCollapsed($event) {
        this.collapedSideBar = $event;
    }

    onOpenTermsAndConditions(){
        this.dialog.open(this.termsTemplate, {
            width: "100%",
            minHeight: "100vh",
            data: "Su",
            panelClass: 'terms-condt-cls'
        }).afterClosed().subscribe((res: any) => {

        })
    }

    getConfirmMessage() {
        return `Your session will expire in 30 seconds. Click Yes to extend.`;
     }


    openSessionWindow(){

        this.cd.detectChanges();
        this.confirmationService.confirm({
            header: 'Confirmation',
            rejectLabel: 'No,Pls Logout!',
            acceptLabel: 'Yes',
            message: this.getConfirmMessage(),
            accept: () => {
                this.hitRefreshToken();
                clearInterval(this.clearInterval);
                clearInterval(this.clearIntervalForExpiration);
                // this.messageService.add({ severity: 'info', summary: 'Confirmed', detail: 'You have accepted', life: 3000 });
            },
            reject: () => {
                this.onLoggedout();
                clearInterval(this.clearInterval);
                clearInterval(this.clearIntervalForExpiration);
                // this.messageService.add({ severity: 'error', summary: 'Rejected', detail: 'You have rejected', life: 3000 });
            }
        });
    }

    ngOnDestroy(): void {
        console.log("clear interval called..!")
    }

    onLoggedout() {
        localStorage.clear();
        localStorage.removeItem('isLoggedin');
        this.dialog.closeAll();
        localStorage.clear();
        this.router.navigate(['/login'])
    }
}

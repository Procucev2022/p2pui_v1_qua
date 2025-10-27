import { SystemViewConfig } from 'src/app/app.config';
import { Component, OnInit, Input, ViewChild, ElementRef, HostListener, Renderer2 } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { EncryDecryService } from 'src/app/shared/services';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { AuthenticateLoggedUserComponent } from 'src/app/shared/modules/common-share/components/authenticate-logged-user/authenticate-logged-user.component';
import { AuthenticationService } from 'src/app/shared/services/authentication.service';


@Component({
    selector: 'app-header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.scss'],
    providers: [MatDialog]
})
export class HeaderComponent implements OnInit {
    @Input('sidebar') sidebar;
    @ViewChild('profileMenu') profileMenuRef: ElementRef;
    @ViewChild('supportRef') supportRef: any;
    public pushRightClass: string;
    loggedUserName: string;
    loggedUserDetails: any;
    roleName: any;
    orgName: any;
    profileCheck = true;
    authenticateData: { isAuthenticated: any; status: string; imgURL: string; };
    currentView: string = "GMT_BASIC";
    SystemViewConfig = SystemViewConfig
    visitorsCount: number;


    constructor(private translate: TranslateService, public router: Router, public encryDecryService: EncryDecryService, private modalDialog: MatDialog,
        private authService: AuthenticationService, private dialog: MatDialog,) {

        this.router.events.subscribe(val => {
            if (
                val instanceof NavigationEnd &&
                window.innerWidth <= 992 &&
                this.isToggled()
            ) {
                this.toggleSidebar();
            }
        });



    }

    ngOnInit() {
        this.pushRightClass = 'push-right';
        const temp = JSON.parse(this.encryDecryService.get('perm', localStorage.getItem('logData')));
        this.loggedUserDetails = temp.details;
        this.currentView = localStorage.getItem('system-view')
        console.log('user data', this.loggedUserDetails);
        this.loggedUserName = this.loggedUserDetails.username;
        this.roleName = (this.loggedUserDetails.role.roleName === 'Registration') || (this.loggedUserDetails.role.roleName === 'PartialVendor') ? 'Seller' : this.loggedUserDetails.role.roleName;
        this.roleName = this.roleName == 'ClientInitiator' &&  (this.currentView && this.currentView.split(' ').includes('GMT')) ? 'Buyer': this.roleName;
        this.orgName = this.loggedUserDetails.org.companyName || null;
        const is_Authenticated = this.loggedUserDetails.auth ? this.loggedUserDetails.auth : false;
        this.authenticateData = {
            isAuthenticated: is_Authenticated,
            status: is_Authenticated == true ? 'Authenticated' : 'Not Authenticated',
            imgURL: is_Authenticated == true ? 'assets/images/new/auth-green.svg' : 'assets/images/new/auth-red.svg'
        }
        localStorage.setItem('userFullName', this.loggedUserDetails.fullName);
        // this.getVisitorCount();
    }

    getVisitorCount(){
       this.authService.getVisitorsCount().subscribe((res:any)=>{
            this.visitorsCount = res && res.count ? 100000+ Number(res.count): 100000;
       });
    }

    onProfileClick() {
        console.log(this.profileCheck);

        this.profileCheck = !this.profileCheck;
    }

    isToggled(): boolean {
        const dom: Element = document.querySelector('body');
        return dom.classList.contains(this.pushRightClass);
    }

    toggleSidebar() {
        const dom: any = document.querySelector('body');
        dom.classList.toggle(this.pushRightClass);
    }

    rltAndLtr() {
        const dom: any = document.querySelector('body');
        dom.classList.toggle('rtl');
    }

    onLoggedout() {
        localStorage.clear();
        localStorage.removeItem('isLoggedin');
        this.modalDialog.closeAll();
        localStorage.clear();
        this.router.navigate(['/login'])
    }

    changeLang(language: string) {
        this.translate.use(language);
    }

    @HostListener('document:click', ['$event'])
    closeProfileMenu(event) {
        if (this.profileMenuRef.nativeElement.contains(event.target)) {
            this.profileCheck = false;
        } else {
            this.profileCheck = true;
        }
    }

    reAuthenticate() {
        const dialogConfig = new MatDialogConfig();
        dialogConfig.minWidth = 300;
        dialogConfig.minHeight = 300;
        dialogConfig.maxWidth = 'none';
        dialogConfig.width = '30%';
        this.modalDialog.open(AuthenticateLoggedUserComponent, dialogConfig).afterClosed().subscribe(result => { });
    }

    onSelectSystem(sysValue) {
        this.authService.onSelectedSubscriptions(sysValue, this.loggedUserDetails, true)
    }

    onSupport() {
        if (this.roleName == 'ClientInitiator'  || this.roleName == 'CategoryManager'|| this.roleName == 'Vendor' || this.roleName == 'PartialVendor' || this.roleName =='Registration'|| this.roleName == 'Buyer' ) {
            const dialogConfig = new MatDialogConfig();
            // dialogConfig.disableClose = true;
            dialogConfig.autoFocus = true;
            dialogConfig.minWidth = 250;
            dialogConfig.minHeight = 300;
            dialogConfig.maxWidth = 'none';
            dialogConfig.width = '30%';
            this.dialog.open(this.supportRef, dialogConfig).afterClosed().subscribe(result => { console.log(result); });
        }
    }
}

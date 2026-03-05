import { Component, Output, EventEmitter, OnInit, Inject } from '@angular/core';
import { Router, NavigationEnd,    ActivatedRoute } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { filter } from 'rxjs/operators';
import { IAppConfig, APP_CONFIG, SystemViewConfig } from 'src/app/app.config';
import { AppApiConfig } from 'src/app/shared/constants/app-api.config';
import { EncryDecryService } from 'src/app/shared/services';
import { AuthenticationService } from 'src/app/shared/services/authentication.service';

@Component({
    selector: 'app-sidebar',
    templateUrl: './sidebar.component.html',
    styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {
    isActive: boolean;
    collapsed: boolean;
    showMenu: string;
    pushRightClass: string;
    loggedUserRole: string;
    userRoles: string[];
    showMenuNav :boolean = true;

    @Output() collapsedEvent = new EventEmitter<boolean>();
    loggedUserPermissions: any;
    defaultPermissions: any;
    loggedUserDetails: any;
    rep: any;
    repCollapsed: boolean = false;
    loggedUserOwnPermissions: any;
    DEfAULT_OWN_PERMISSIONS_LIST: any;
    loggedUserRoleType: any;
    currentView: any = null;
    SystemViewConfig: any;
    isGMTView: boolean;
    isBFSView: boolean;
    expiredTimeInSeconds: any =  '';
    childRepCollapsed: boolean;
    childRep: string;

     constructor(private translate: TranslateService, public router: Router, @Inject(APP_CONFIG) private config: IAppConfig,
      private encryDecryService: EncryDecryService, private authService: AuthenticationService, private route: ActivatedRoute) {

        this.router.events
        .pipe(
          filter(event => event instanceof NavigationEnd)
        )
        .subscribe((val: NavigationEnd) => {
            if (
                val instanceof NavigationEnd &&
                window.innerWidth <= 992 &&
                this.isToggled()
            ) {
                this.toggleSidebar();
            }
            const currentUrl = val.urlAfterRedirects;
            console.log('Current URL:', currentUrl);
            if(currentUrl == '/client/procurerequest' || currentUrl == '/client/procurerequest'){
                this.rep = 'procureRequrest';
                this.repCollapsed = true;
            }

          // You can also perform any other action after navigation ends
        });
        console.log('state',   this.route.snapshot)

        this.getExpiredTime();
    }


    getExpiredTime(){
        this.authService.$expiresTime.subscribe((res:number)=>{
            this.expiredTimeInSeconds = 'Session Expires In :' + this.formatSessionTime(res);
        })
    }

    formatSessionTime(time:any){
        let convertedTime = 'LOADING..'
        if(time && time >0){
            if(time < 10) {
                convertedTime ='00:00:0'+time+' Secs.';
            }else if(time < 60) {
                convertedTime = '00:00:'+(time>=10? time : '0'+time)+' Secs.';
            }else if(time >60 && time <= 3540) { //120
                const mins = Math.round(time  /60) ;
                convertedTime ='00:'+ (mins>= 10 ? mins: '0'+mins) +':00 Mins.'
            }else if(time > 3600 ){
                const cArr = (Number(time/3600).toFixed(2)).split('.');// 1.29
                const hrs =   (Number(cArr[0])>=10 ?cArr[0]: "0"+cArr[0]  ) + ":" + ( Number(cArr[1]) >=10 ? cArr[1]: '0'+ cArr[1] ) + ' Hrs.'  ;
                convertedTime =hrs;
            }
        }
        return convertedTime
    }




    onShowMobileMenu(){
        this.showMenuNav = !this.showMenuNav;
    }
    ngOnInit() {
        this.loggedUserRole = this.config.loggedUserRole;
        this.SystemViewConfig = SystemViewConfig;
        this.userRoles = this.config.userRoles;
        this.isActive = false;
        this.collapsed = false;
        this.showMenu = '';
        this.pushRightClass = 'push-right';
        this.defaultPermissions = AppApiConfig.DEFAULT_PERMISSIONS;
        this.DEfAULT_OWN_PERMISSIONS_LIST = AppApiConfig.OWN_PERMISSIONS_LIST;
        let temp =  JSON.parse(this.encryDecryService.get('perm', localStorage.getItem('logData')) );
        this.loggedUserDetails = temp.details;
        console.log('loggedUserDetails..',this.loggedUserDetails)
        this.loggedUserOwnPermissions = this.loggedUserDetails.ownPermissions || [];
        this.loggedUserPermissions = this.loggedUserDetails.listofPermission;
        this.loggedUserRoleType = this.loggedUserDetails.role.roleName;
        this.currentView = !localStorage.getItem('system-view') ? JSON.parse(localStorage.getItem('system-view')): localStorage.getItem('system-view');
        console.log('currentView..',this.currentView)
        this.isGMTView = [SystemViewConfig.GMT_BASIC , SystemViewConfig.GMT_BASIC_PLUS, SystemViewConfig.GMT_PROF ].includes(this.currentView)? true: false;
        this.isBFSView =  [  SystemViewConfig.BFS_PRO].includes(this.currentView)? true: false;
        if(this.isGMTView){
            this.repCollapsed = true
            this.rep = "GMT";
        }
        else if(this.isGMTView){
            this.repCollapsed = true
            this.rep = "BFS";
        }
    }


    eventCalled() {
        this.isActive = !this.isActive;
    }

    addExpandClass(element: any) {
        if (element === this.showMenu) {
            this.showMenu = '0';
        } else {
            this.showMenu = element;
        }
    }


    toggleCollapsed() {
        this.collapsed = !this.collapsed;
        this.collapsedEvent.emit(this.collapsed);
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

    changeLang(language: string) {
        this.translate.use(language);
    }

    onLoggedout() {
        localStorage.removeItem('isLoggedin');
    }

    toggleAccordian(e,name, childName?){
        if(this.rep == name && !childName ){
            this.rep = name;
            this.repCollapsed = !this.repCollapsed
          
        }else{
            this.rep = name;
            this.repCollapsed = true
        }
        if(childName){
            if(this.childRep == childName){
                this.childRep = childName;
                this.childRepCollapsed = !this.childRepCollapsed    
            }else{
                this.childRep = childName;
                this.childRepCollapsed = true
            }
        }else{
            this.childRep = '';
        }
    }

    // showChilds(index) {
    //     $scope.items[index].active = !$scope.items[index].active;
    //     this.collapseAnother(index);
    //  };

    // collapseAnother(index) {
    //     for (var i = 0; i < $scope.items.length; i++) {
    //        if (i != index) {
    //           $scope.items[i].active = false;
    //        }
    //     }
    //  };
}

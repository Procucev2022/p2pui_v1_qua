import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';
import { AppApiConfig } from '../constants/app-api.config';
import { Router } from '@angular/router';
import { EncryDecryService } from './encry-decry.service';
import { SystemViewConfig } from 'src/app/app.config';
import { ToastrService } from 'ngx-toastr';


const httpOptions = {
    headers: new HttpHeaders({
        'Authorization': 'Basic cHJvY3VjZXY6cHJvY3VjZXY=',
        'Access-Control-Allow-Origin': '*'
    })
};


@Injectable({
    providedIn: 'root'
})
export class AuthenticationService {
    refreshTokenCount =0;
    expiresInSeconds :number = 0;
    $expiresTime = new BehaviorSubject(this.expiresInSeconds)
    constructor(private http: HttpClient, private router: Router, private encryDecryService: EncryDecryService, private toaster: ToastrService) { }
    SYSTEM_VIEW_CONFIG: any = SystemViewConfig;
    public getAccessToken(req): Observable<any> {
        const formdata: FormData = new FormData();
        formdata.append('username', req.userName);  // 'venu.gade@procucev.com');
        formdata.append('password', req.userPassword); // 'Welcome@123');
        formdata.append('grant_type', 'password');

        return this.http
            .post<any>(AppApiConfig.apiEndpoint + AppApiConfig.ACCESS_TOKEN_PATH,
                formdata,
                httpOptions
            )
            .pipe(
                take(1),
                map(data => {
                    console.log(data, 'auth_token');

                    return data;
                })
            );
    }

    updateExpiredTime(time){
        this.$expiresTime.next(time);
    }


    getLoggedUserData(req): Observable<any> {
        return this.http.post(AppApiConfig.apiEndpoint + AppApiConfig.LOGGED_USER_PATH, req, {});
    }

    saveLoggedUserData(req): Observable<any> {
        return this.http.post(AppApiConfig.apiEndpoint + AppApiConfig.SAVE_USER_LOGIN_DATA, req, {});
    }

    getVisitorsCount(): Observable<any> {
        return this.http.get(AppApiConfig.apiEndpoint + AppApiConfig.GET_VISITORS_COUNT,  {});
    }
    updatePassword(req): Observable<any> {
        return this.http.post(AppApiConfig.apiEndpoint + AppApiConfig.CHANGE_PASSWORD, req, {});
    }

    forgotpassword(obj) {
        return this.http.post(AppApiConfig.apiEndpoint + AppApiConfig.FORGOT_PASSWORD, obj, {});
    }

    onSelectedSubscriptions(sysValue, data, isReload = false) {
        //TEMPORARY LOGIC
        if(sysValue== 'gmtName' && (data.role.roleName === 'Vendor' || data.role.roleName ==='Registration'|| data.role.roleName ==='PartialVendor')){
            // if(['53e49cdc-97c3-4479-a20f-625d9d391c4e','44c34e52-c326-447f-a4af-cf611603a6d8'].includes(data.org.id)){ // temp logic for partialVendor
                localStorage.setItem('system-view', null);
                const systemView = data.org[sysValue] ? data.org[sysValue].trim('') : null;

                console.log('loggedUserData', data);
                const obj = Object.assign({}, data);
                const k = this.encryDecryService.set('perm', JSON.stringify({ 'details': data }));
                localStorage.setItem('logData', k);
                localStorage.setItem('orgId', data.org.id);
                localStorage.setItem('loggedId', data.id);

                // this.router.navigate(['/login/subscription-login']);
                localStorage.setItem('system-view', systemView);
                localStorage.setItem('isLoggedin', 'true');

                if ([this.SYSTEM_VIEW_CONFIG.GMT_BASIC, this.SYSTEM_VIEW_CONFIG.GMT_BASIC_PLUS, this.SYSTEM_VIEW_CONFIG.GMT_PROF].includes(systemView)) {
                    this.router.navigate(['/categorymgr/gmt-rqfs']).then(() => {
                        window.location.reload();
                    });

                } else {// For DPS vendors
                    if(data.role.roleName ==='Registration'|| data.role.roleName ==='PartialVendor'){
                        this.router.navigate(['/dashboard']).then(()=>{
                            window.location.reload();
                        })
                    }else{
                        this.router.navigate(['/vendor/rfq']).then(() => {
                            window.location.reload();
                        });
                    }

                }

                return true;

            // }else{
            //      this.toaster.warning("This feature will be coming soon...!", "Warning")
            //     return;
            // }

        }

        //For BFS Login's   Buyer, Seller TEMPORARY
        // if(sysValue== 'bfsName'){
        //     if(['4001', 'c5496fca-4d76-482c-b594-e75370d1fd39', 'fc284ebf-a120-4d73-bc97-1d81a79db7f7'].includes(data.id)){ // temp logic for partialVendor
        //         localStorage.setItem('system-view', null);
        //         const systemView = data.org[sysValue] ? data.org[sysValue].trim('') : null;

        //         console.log('loggedUserData', data);
        //         const obj = Object.assign({}, data);
        //         const k = this.encryDecryService.set('perm', JSON.stringify({ 'details': data }));
        //         localStorage.setItem('logData', k);
        //         localStorage.setItem('orgId', data.org.id);
        //         localStorage.setItem('loggedId', data.id);

        //         // this.router.navigate(['/login/subscription-login']);
        //         localStorage.setItem('system-view', systemView);
        //         localStorage.setItem('isLoggedin', 'true');


        //         if(  (data.role.roleName === 'Vendor' || data.role.roleName ==='Registration'|| data.role.roleName ==='PartialVendor')){
        //             if([this.SYSTEM_VIEW_CONFIG.BFS_PRO].includes(systemView)){ // For BFS
        //                 this.router.navigate(['/bfs/items']).then(() => {
        //                     window.location.reload();
        //                 });
        //             } else {// For DPS CategoryManger2
        //                 this.router.navigate(['/dashboard']).then(() => {
        //                     window.location.reload();
        //                 });
        //             }
        //         }
        //         //For CM & Cm2
        //         else if(data.role.roleName === 'CategoryManager2' || data.role.roleName === 'CategoryManager'){
        //             if([this.SYSTEM_VIEW_CONFIG.BFS_PRO].includes(systemView)){ // For BFS Vendors
        //                 this.router.navigate(['/bfs/items']).then(() => {
        //                     window.location.reload();
        //                 });
        //             }else{// For DPS CategoryManger2
        //                 this.router.navigate(['/dashboard']).then(() => {
        //                     window.location.reload();
        //                 });
        //             }
        //         }else{
        //             this.toaster.warning("This feature will be coming soon...!", "Warning")
        //             return;
        //         }
        //     }

        //     return true;
        // }
        localStorage.setItem('system-view', null);
        const systemView = data.org[sysValue] ? data.org[sysValue].trim('') : null;

        console.log('loggedUserData', data);
        const obj = Object.assign({}, data);
        const k = this.encryDecryService.set('perm', JSON.stringify({ 'details': data }));
        localStorage.setItem('logData', k);
        localStorage.setItem('orgId', data.org.id);
        localStorage.setItem('loggedId', data.id);
        if (data.resetPassword && localStorage.getItem('orgId')) {
            this.router.navigate(['login/passwordChange']);
        } else {
            // this.router.navigate(['/login/subscription-login']);
            localStorage.setItem('system-view', systemView);
            localStorage.setItem('isLoggedin', 'true');
            if (data.role.roleName === 'VendorManager') {
                this.router.navigate(['/vendormgr/dashboard']);
            } else if (data.role.roleName === 'Vendor' || data.role.roleName ==='Registration'|| data.role.roleName ==='PartialVendor') {
                // For GMT Vendors
                if ([this.SYSTEM_VIEW_CONFIG.GMT_BASIC, this.SYSTEM_VIEW_CONFIG.GMT_BASIC_PLUS, this.SYSTEM_VIEW_CONFIG.GMT_PROF].includes(systemView)) {
                    this.router.navigate(['/categorymgr/gmt-rqfs']).then(() => {
                        window.location.reload();
                    });
                }else if([this.SYSTEM_VIEW_CONFIG.BFS_PRO].includes(systemView)){ // For BFS Vendors
                    this.router.navigate(['/bfs/items']).then(() => {
                        window.location.reload();
                    });
                }
                else {// For DPS vendors
                    if(data.role.roleName ==='Registration'|| data.role.roleName ==='PartialVendor'){
                        this.router.navigate(['/dashboard']).then(()=>{
                            window.location.reload();
                        })
                    }else{
                        this.router.navigate(['/vendor/rfq']).then(() => {
                            window.location.reload();
                        });
                    }

                }

            } else if (data.role.roleName === 'PRApprover') {
                this.router.navigate(['/client/procurerequest']);
            } else if (data.role.roleName === "ClientInitiator") {//For GMT USEr
                if(data.selfClient == true && [this.SYSTEM_VIEW_CONFIG.GMT_BASIC, this.SYSTEM_VIEW_CONFIG.GMT_BASIC_PLUS].includes(systemView)){
                    this.router.navigate(['/categorymgr/create-rfq']).then(() => {
                        window.location.reload();
                    });
                }else if(data.selfClient == false && [this.SYSTEM_VIEW_CONFIG.DPS_BASIC, this.SYSTEM_VIEW_CONFIG.DPS_BASIC_PLUS].includes(systemView)){
                    this.router.navigate(['/client/procurerequest']).then(() => {
                        window.location.reload();
                    });
                }else if([this.SYSTEM_VIEW_CONFIG.BFS_PRO].includes(systemView)){ // For BFS
                    this.router.navigate(['/bfs/items']).then(() => {
                        window.location.reload();
                    });
                }
                else{

                if([this.SYSTEM_VIEW_CONFIG.GMT_BASIC, this.SYSTEM_VIEW_CONFIG.GMT_BASIC_PLUS].includes(systemView)){
                    this.router.navigate(['/categorymgr/create-rfq']).then(() => {
                        window.location.reload();
                    });
                }else{
                    this.toaster.warning("Please contact adminstrator", "Warning")
                    return;
                }

                }

                // if([this.SYSTEM_VIEW_CONFIG.GMT_BASIC, this.SYSTEM_VIEW_CONFIG.GMT_BASIC_PLUS].includes(systemView)){
                //     this.router.navigate(['/categorymgr/create-rfq']).then(() => {
                //         window.location.reload();
                //     });
                // }else{//For DPS
                //     this.router.navigate(['/client/procurerequest']).then(() => {
                //         window.location.reload();
                //     });
                // }
            } else if (data.role.roleName === 'CategoryManagerBasic') {
                if ([this.SYSTEM_VIEW_CONFIG.GMT_BASIC, this.SYSTEM_VIEW_CONFIG.GMT_BASIC_PLUS].includes(systemView)) {
                    this.router.navigate(['/categorymgr/create-rfq']).then(() => {
                        window.location.reload();
                    });
                } else {// For DPS vendors
                    this.router.navigate(['/categorymgr/procurequests']).then(() => {
                        window.location.reload();
                    });
                }

            } else if (data.role.roleName === 'VendorExecutive2' || data.role.roleName === 'VendorExecutive') {
                this.router.navigate(['vendormgr/vendors']);
            } else if (data.role.roleName === 'CategoryManager2' || data.role.roleName === 'CategoryManager') { // For GMT USER
                if ([this.SYSTEM_VIEW_CONFIG.GMT_BASIC, this.SYSTEM_VIEW_CONFIG.GMT_BASIC_PLUS].includes(systemView)) {
                    if (data.role.roleName === 'CategoryManager') {
                        this.router.navigate(['/categorymgr/create-rfq']).then(() => {
                            window.location.reload();
                        });
                    } else {
                        this.router.navigate(['/categorymgr/gmt-summary']).then(() => {
                            window.location.reload();
                        });
                    }

                }else if([this.SYSTEM_VIEW_CONFIG.BFS_PRO].includes(systemView)){ // For BFS
                    this.router.navigate(['/bfs/items']).then(() => {
                        window.location.reload();
                    });
                } else {// For DPS CategoryManger2
                    this.router.navigate(['/dashboard']).then(() => {
                        window.location.reload();
                    });
                }
            } else {
                this.router.navigate(['/dashboard']);
            }


        }

    }


    // isCheckGMTDPSSystem(){
    //     [this.SYSTEM_VIEW_CONFIG.GMT_BASIC, this.SYSTEM_VIEW_CONFIG.GMT_BASIC_PLUS, this.SYSTEM_VIEW_CONFIG].includes(systemView)
    // }


    navigationForDFSSystem(){

    }

    public getRefreshToken(): Observable<any> {

        const formdata1: FormData = new FormData();  // 'venu.gade@procucev.com');
        const rt =localStorage.getItem('rt');
        console.log("RT TOKEN",rt)
        formdata1.append('grant_type','refresh_token');
        formdata1.append('refresh_token',rt);// 'Welcome@123');
        let httpOptions1 = {
            headers: new HttpHeaders({
                'Authorization': 'Basic cHJvY3VjZXY6cHJvY3VjZXY=',
                'Access-Control-Allow-Origin': '*',
                'Accept': 'application/json',
            })
        };
        return this.http.post<any>(AppApiConfig.apiEndpoint + AppApiConfig.REFRESH_TOKEN_PATH,
                formdata1,
                httpOptions1
            )
            .pipe(
                take(1),
                map(data => {
                    this.refreshTokenCount++;
                    console.log("TKN.CNT.RFRSH", this.refreshTokenCount);
                    localStorage.setItem('at', data.access_token);
                    localStorage.setItem('rt', data.refresh_token);
                    localStorage.setItem('et', data.expires_in);
                    return data;
                })
            );
    }
}

// loader.interceptors.ts
import { Injectable } from '@angular/core';
import {
    HttpErrorResponse,
    HttpResponse,
    HttpRequest,
    HttpHandler,
    HttpEvent,
    HttpInterceptor,
    HttpHeaders
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { LoaderService } from './loader.service';

import { ToastrService } from 'ngx-toastr';
import { tap } from 'rxjs/operators';
import { Router, ActivatedRoute } from '@angular/router';
import { AppApiConfig } from '../constants/app-api.config';
import { AppConfig } from 'src/app/app.config';


@Injectable()
export class RequestInterceptor implements HttpInterceptor {
    private requests: HttpRequest<any>[] = [];
    constructor(private loaderService: LoaderService, private toasterService: ToastrService, private router: Router) {

    }


    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

        if(req.url.includes(AppApiConfig.REFRESH_TOKEN_PATH)){
            console.log('req', req.body)
            //    const headers =new HttpHeaders({
            //     'Authorization': 'Basic cHJvY3VjZXY6cHJvY3VjZXY=',
            //     'Access-Control-Allow-Origin': '*',
            //     'Content-Type' : 'application/x-www-form-urlencoded'
            // })
            // const authReq = req.clone({ headers });
            return next.handle(req).pipe(tap(event => {
                // console.log('token...called')
                if (event instanceof HttpResponse) {
                    // console.log('Succeed API Call', event);
                }
            }, error => {
                if (event instanceof HttpResponse) {
                    console.log('Error API Call:', event);
                }
            }
            ));
        }else   if (req.url.includes(AppApiConfig.FORGOT_PASSWORD) || req.url.includes(AppApiConfig.SUBMIT_VENDOR_SELF_REGISTRATION)
         || req.url.includes(AppApiConfig.PAN_VALIDATION)  || req.url.includes(AppApiConfig.GET_CLIENT_DETAILS_BY_PAN)
         || req.url.includes(AppApiConfig.SUBMIT_CLIENT_SELF_REGISTRATION)
         ||req.url.includes(AppApiConfig.SEND_OTP_TO_MAIL)||req.url.includes('/sds/upload') ||req.url.includes(AppApiConfig.OTP_VALIDATION) ) {
            const headers = new HttpHeaders({
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Access-Control-Allow-Origin': '*',
                // 'Authorization': 'Basic cHJvY3VjZXY6cHJvY3VjZXY='
            });
            const authReq = req.clone({ headers });
            return next.handle(authReq);
        } else if ((req.url.search(AppApiConfig.ACCESS_TOKEN_PATH) === -1)) {
            const tkn = localStorage.getItem('at');
            if (tkn != null || tkn !== 'undefined') {
                // if (true) {
                const headers = new HttpHeaders({
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Methods': 'POST, GET, PATCH, OPTIONS, DELETE',
                    'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept',
                    'Authorization': 'Bearer ' + (tkn ? tkn : ''),
                });
                const authReq = req.clone({ headers });
                return next.handle(authReq);
                // }
                // else {
                //     const headers = new HttpHeaders({
                //            'graphOauthToken': tkn ? tkn : '',
                //            'SAMLToken': localStorage.getItem('SAMLToken')? localStorage.getItem('SAMLToken'): '',
                //            'sourcePath': AppApiConfig.IS_PRODUCTION,
                //             'portalUserName' : localStorage.getItem('userName') ? localStorage.getItem('userName') : '',
                //             'tempUserName': localStorage.getItem('userName') ? localStorage.getItem('userName') : '',
                //             'sessionid': localStorage.getItem('session_id') ? localStorage.getItem('session_id') : '',
                //             'loggedOrg':(isUrlFound && this.loggeduserData) || (isClientUrlFound && this.loggeduserData )?(this.loggeduserData.permissions.org.id).toString(): '',
                //             'selectedOrg': isIndustryPeerCompApiFound? localStorage.getItem('indCompOrgId'): (isUrlFound && localStorage.getItem('selectedJobOrgId')?  localStorage.getItem('selectedJobOrgId'):
                //             (isClientUrlFound && localStorage.getItem('selectedClientAcId') ) ? localStorage.getItem('selectedClientAcId'): '')
                //         });
                //         let authReq = req.clone({headers});
                //         return next.handle(authReq);
                // }
            }
        }

        return next.handle(req).pipe(tap(event => {
            // console.log('token...called')
            if (event instanceof HttpResponse) {
                // console.log('Succeed API Call', event);
            }
        }, error => {
            if (event instanceof HttpResponse) {
                console.log('Error API Call:', event);
            }
        }
        ));
    }



}

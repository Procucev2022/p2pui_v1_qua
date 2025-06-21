// loader.interceptors.ts
import { Injectable } from '@angular/core';
import {
    HttpErrorResponse,
    HttpResponse,
    HttpRequest,
    HttpHandler,
    HttpEvent,
    HttpInterceptor
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { LoaderService } from './loader.service';

import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';


@Injectable()
export class LoaderInterceptor implements HttpInterceptor {
    private requests: HttpRequest<any>[] = [];
    isAPIError = false;
    constructor(private loaderService: LoaderService, private toasterService: ToastrService, private router: Router,
        private modal: NgbModal) { }

    removeRequest(req: HttpRequest<any>) {
        const i = this.requests.indexOf(req);
        if (i >= 0) {
            this.requests.splice(i, 1);
        }
        this.loaderService.isLoading.next(this.requests.length > 0);
    }

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        if ((localStorage.getItem('encryptUser') || req.url.includes('/user/generateToken') ) && !this.isAPIError) {
        if(req.url.split('/').indexOf('vendorInfoById')<0){
            this.requests.push(req);
        }

        this.loaderService.isLoading.next(true);
        return Observable.create(observer => {
            const subscription = next.handle(req)
                .subscribe(
                    event => {
                        if (event instanceof HttpResponse) {
                            this.removeRequest(req);
                            observer.next(event);
                        }
                       // console.log('response', event)
                    },
                    err => {
                        if (err.status !== 401) {
                            this.removeRequest(req);
                        } else {
                            this.isAPIError = true;
                            this.modal.dismissAll();
                            this.requests = [];
                            if (err.error.message) {
                            this.toasterService.error(err.error.message, 'Failed');
                            }
                            localStorage.clear();
                            this.router.navigate(['/login/unauthorized']);
                        }
                        this.showErrorMessages(err);
                        observer.error(err);
                    },
                    () => {
                        this.removeRequest(req);
                        observer.complete();
                    });
            // remove request from queue when cancelled
            return () => {
                this.removeRequest(req);
                subscription.unsubscribe();
            };
        });
    } else {
        this.loaderService.isLoading.next(false);
        this.router.navigate(['/logout/sessionExpired']);
    }
    }

    showErrorMessages(error: HttpErrorResponse) {
        // if(error){
        //     if(error.error.errorCode == 401){
        //         this.requests = [];
        //         this.toasterService.error(error.error.errorMessage, 'Failed')
        //         localStorage.clear();
        //         setTimeout(() => {
        //             location.replace(AppApiConfig.SAML_LOGIN);
        //         }, 3000);
        //     }
        // }
        console.log('er', error);
        switch (error.status) {
            case 404:
                this.toasterService.error('Resource Not Found', 'Failure' );
            break;
            case 400:
                this.toasterService.error('Bad Request', 'Failure');
            break;
            case 401:
                // if(error.error.errorMsg || error.error.errorMessage){
                //     let msg = error.error.errorMsg? error.error.errorMsg?error.error.errorMsg: 'Failed': error.error.errorMessage?error.error.errorMessage:  'Failed';
                //     this.toasterService.error(msg+", please login again", 'Failure') // need to redirect to logout or refresh token need to be called
                // }
                this.requests = [];
               // this.toasterService.error(error['errorMessage'], 'Failed')
                localStorage.clear();
                // setTimeout(() => {
                //     location.replace(AppApiConfig.SAML_LOGIN);
                // }, 3000);

                this.router.navigate(['/login/unauthorized']);

            break;
            case 500:
                    this.toasterService.error('Internal Server Error', 'Failure');
            break;
            case 408:
                    this.toasterService.error('Request Timeout', 'Failure');
            break;
            case 415:
                    this.toasterService.error('Unsupp­orted Media Type', 'Failure');
            break;
            case 503:
                    this.toasterService.error('Service Unavai­lable', 'Failure');
            break;
            case 504:
                    this.toasterService.error('Gateway Timeout', 'Failure');
            break;
            case 511:
            this.toasterService.error('Network Authen­tic­ation Required', 'Failure');
            break;

            default:
                this.toasterService.error('Network error, Please retry after sometime', 'Failure');


        }
    }
}

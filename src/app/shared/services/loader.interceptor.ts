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
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AppApiConfig } from '../constants/app-api.config';

@Injectable()
export class LoaderInterceptor implements HttpInterceptor {
    private requests: HttpRequest<any>[] = [];

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

        if(req.url.split('/').indexOf('vendorInfoById')<0 && !req.url.includes(AppApiConfig.REFRESH_TOKEN_PATH)){
            this.requests.push(req);
            this.loaderService.isLoading.next(true);
        }
        // console.log("No of requests--->" + this.requests.length);

        return Observable.create(observer => {
            const subscription = next.handle(req)
                .subscribe(
                    event => {
                        if (event instanceof HttpResponse) {
                            this.removeRequest(req);
                            observer.next(event);
                        }
                    },
                    err => {
                        console.log('err', err);
                    // alert('error returned');
                        this.removeRequest(req);
                        observer.error(err);
                        if (err.status === 401) {
                            this.modal.dismissAll();
                            this.requests = [];
                            if (err.error.message) {
                            this.toasterService.error(err.error.message, 'Failed');
                            }
                            localStorage.clear();
                            this.router.navigate(['/login/unauthorized']);
                        }
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
    }
}

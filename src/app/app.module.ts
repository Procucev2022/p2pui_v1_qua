import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ChartModule } from 'primeng/chart';

import { CommonModule } from '@angular/common';

import { LanguageTranslationModule } from './shared/modules/language-translation/language-translation.module';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AuthGuard } from './shared';

import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { LoaderInterceptor } from './shared/services/loader.interceptor';
import { LoaderService } from './shared/services/loader.service';
import { LoaderComponent } from './shared/loader/loader.component';
import { ToastrModule } from 'ngx-toastr';
import { UserIdleModule } from 'angular-user-idle';
import { NgxSpinnerModule } from 'ngx-spinner';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { TimeoutModalComponent } from './shared/components/timeout-modal/timeout-modal.component';
import { APP_CONFIG, AppConfig } from './app.config';
import { GridPageInfoComponent } from './shared/commonComps/grid-page-info/grid-page-info.component';
import { RequestInterceptor } from './shared/services/request.interceptor';
import { EncryDecryService } from './shared/services';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { CountdownModule } from 'ngx-countdown';

import {TableModule} from 'primeng/table';
import {ToastModule} from 'primeng/toast';
import {CalendarModule} from 'primeng/calendar';
import {SliderModule} from 'primeng/slider';
import {MultiSelectModule} from 'primeng/multiselect';
import {ContextMenuModule} from 'primeng/contextmenu';
import {DialogModule} from 'primeng/dialog';
import {ButtonModule} from 'primeng/button';
import {DropdownModule} from 'primeng/dropdown';
import {ProgressBarModule} from 'primeng/progressbar';
import {InputTextModule} from 'primeng/inputtext';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { CommonShareModule } from './shared/modules/common-share/common-share.module';
import { RouterModule } from '@angular/router';


@NgModule({
    imports: [
        CommonModule,
        BrowserModule,
        BrowserAnimationsModule,
        HttpClientModule,
        RouterModule.forRoot([]),
        LanguageTranslationModule,
        AppRoutingModule,
        ToastrModule.forRoot({
            timeOut: 2000,
            preventDuplicates: true,
            closeButton: true,
            disableTimeOut: false,
            tapToDismiss: true,
            autoDismiss: true,
            maxOpened: 1
        }),
        UserIdleModule.forRoot({idle: 50000, timeout: 50000, ping: 120}),
        NgbModule,
        NgxSpinnerModule,
        NgMultiSelectDropDownModule.forRoot(),
        CommonShareModule,
        CountdownModule,
        TableModule,
        CalendarModule,
        SliderModule,
        DialogModule,
        MultiSelectModule,
        ContextMenuModule,
        DropdownModule,
        ButtonModule,
        ToastModule,
        InputTextModule,
        ProgressBarModule,
        ChartModule

    ],
    declarations: [AppComponent, LoaderComponent, TimeoutModalComponent, GridPageInfoComponent],
    // entryComponents: [TimeoutModalComponent],
    providers: [
     {
        provide: HTTP_INTERCEPTORS,
        useClass: LoaderInterceptor,
        multi: true
    } ,
    {
        provide: HTTP_INTERCEPTORS,
        useClass: RequestInterceptor,
        multi: true
    } ,
    { provide: APP_CONFIG, useValue: AppConfig },
    LoaderService,
    AuthGuard,
    EncryDecryService
    ]   ,
    bootstrap: [AppComponent],
    exports: [LoaderComponent, ChartModule] // CountdownModule
})
export class AppModule {}

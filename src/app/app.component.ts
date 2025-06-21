import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { UserIdleService } from 'angular-user-idle';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TimeoutModalComponent } from './shared/components/timeout-modal/timeout-modal.component';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
    HTTPActivity: boolean;
    constructor(private http: HttpClient, private userIdle: UserIdleService,private modalService: NgbModal) {
    }

    ngOnInit() {
        //Start watching for user inactivity.
        this.userIdle.startWatching();

        // Start watching when user idle is starting.
        this.userIdle.onTimerStart().subscribe(count => {console.log(count)
        
        });

        // Start watch when time is up.
        this.userIdle.onTimeout().subscribe(() => {console.log('Time is up!')
        this.open();
    });
    }

    open() {
        const modalRef = this.modalService.open(TimeoutModalComponent);
        modalRef.componentInstance.name = 'World';
      }

    stop() {
        this.userIdle.stopTimer();
    }

    stopWatching() {
        this.userIdle.stopWatching();
    }

    startWatching() {
        this.userIdle.startWatching();
    }

    restart() {
        this.userIdle.resetTimer();
    }
}

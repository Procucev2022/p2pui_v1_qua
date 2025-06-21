import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { UserIdleService } from 'angular-user-idle';

@Component({
  selector: 'app-timeout-modal',
  templateUrl: './timeout-modal.component.html',
  styleUrls: ['./timeout-modal.component.scss']
})
export class TimeoutModalComponent implements OnInit, OnDestroy {
  @Input('name') name;
  counter = 10;
  sessionExtended = false;
  timer: any;

  constructor(public activeModal: NgbActiveModal,private userIdle: UserIdleService) { }

  ngOnInit() {
    this.startTimer();
  }

  startTimer(){
    if(this.counter > 0){
      this.timer = setInterval(()=>{
        console.log('in interval');
        
        this.counter--;
        if(this.counter<=0 && !this.sessionExtended){
          this.closeSession();
        }
      },1000)
    }
    
  }
  closeModal(){
    this.sessionExtended = true;
    this.userIdle.resetTimer();
    this.activeModal.dismiss('Close click');
  }

  closeSession(){
    this.userIdle.stopWatching();
    console.log('session ended');
    this.activeModal.dismiss('Close click');
  }

  ngOnDestroy(){
    console.log('destroy');
    //this.sessionExtended = true;
    if(this.timer){
      clearInterval(this.timer);
    }

  }

}

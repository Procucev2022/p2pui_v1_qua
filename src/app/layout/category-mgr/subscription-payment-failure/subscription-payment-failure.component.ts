import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-subscription-payment-failure',
  templateUrl: './subscription-payment-failure.component.html',
  styleUrls: ['./subscription-payment-failure.component.scss']
})
export class SubscriptionPaymentFailureComponent implements OnInit  {


    timeLeft: number = 25;
    interval: any;
    constructor(private router: Router) { }
  
    ngOnInit(): void {
      this.startTimer();
    }
  
    startTimer() {
      this.interval = setInterval(() => {
        this.timeLeft--;
        if (this.timeLeft <= 0) {
          clearInterval(this.interval);
        }
        if (this.timeLeft == 0) {
          this.router.navigate(['/categorymgr/vendor-profile-subscriptions']);
        }
      }, 1000);
    }
}

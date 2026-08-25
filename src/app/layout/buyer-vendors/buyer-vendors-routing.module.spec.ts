import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { Router } from '@angular/router';
import { BuyerVendorsRoutingModule } from './buyer-vendors-routing.module';

describe('BuyerVendorsRoutingModule', () => {
  let router: Router;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule, BuyerVendorsRoutingModule]
    });
    router = TestBed.inject(Router);
  });

  it('should create the routing module', () => {
    expect(router).toBeTruthy();
  });

  it('should have routes defined', () => {
    const routes = router.config;
    expect(routes.length).toBeGreaterThan(0);
  });
});

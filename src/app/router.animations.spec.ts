import {
  noTransition,
  routerTransition,
  slideToBottom,
  slideToLeft,
  slideToRight,
  slideToTop
} from './router.animations';

describe('router.animations', () => {
  it('should return a truthy trigger from routerTransition', () => {
    expect(routerTransition()).toBeTruthy();
  });

  it('should return a truthy trigger from noTransition', () => {
    expect(noTransition()).toBeTruthy();
  });

  it('should return a truthy trigger from slideToRight', () => {
    expect(slideToRight()).toBeTruthy();
  });

  it('should return a truthy trigger from slideToLeft', () => {
    expect(slideToLeft()).toBeTruthy();
  });

  it('should return a truthy trigger from slideToBottom', () => {
    expect(slideToBottom()).toBeTruthy();
  });

  it('should return a truthy trigger from slideToTop', () => {
    expect(slideToTop()).toBeTruthy();
  });
});

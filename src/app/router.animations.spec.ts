import { routerTransition, noTransition, slideToRight, slideToLeft, slideToBottom, slideToTop } from './router.animations';

describe('router.animations', () => {
  it('routerTransition should return a trigger', () => {
    const result = routerTransition();
    expect(result.name).toBe('routerTransition');
  });

  it('noTransition should return a trigger with no transitions', () => {
    const result = noTransition();
    expect(result.name).toBe('routerTransition');
    expect(result.definitions.length).toBe(0);
  });

  it('slideToRight should return a trigger with transitions', () => {
    const result = slideToRight();
    expect(result.name).toBe('routerTransition');
    expect(result.definitions.length).toBeGreaterThan(0);
  });

  it('slideToLeft should return a trigger with transitions', () => {
    const result = slideToLeft();
    expect(result.name).toBe('routerTransition');
    expect(result.definitions.length).toBeGreaterThan(0);
  });

  it('slideToBottom should return a trigger with transitions', () => {
    const result = slideToBottom();
    expect(result.name).toBe('routerTransition');
    expect(result.definitions.length).toBeGreaterThan(0);
  });

  it('slideToTop should return a trigger with transitions', () => {
    const result = slideToTop();
    expect(result.name).toBe('routerTransition');
    expect(result.definitions.length).toBeGreaterThan(0);
  });
});

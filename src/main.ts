import { bootstrapApp } from './app-bootstrap';

declare const __karma__: unknown;

/** Mutable hooks for Edge-safe unit tests. */
export const mainHooks = {
  bootstrap: bootstrapApp as typeof bootstrapApp,
};

/** Entry bootstrap. Skipped under Karma so unit tests can cover this module safely. */
export function runMain(): Promise<any> | undefined {
  if (typeof __karma__ !== 'undefined') {
    return undefined;
  }
  return mainHooks.bootstrap();
}

runMain();

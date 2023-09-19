import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { sessionUserGuard } from './session-user.guard';

describe('sessionUserGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => sessionUserGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});

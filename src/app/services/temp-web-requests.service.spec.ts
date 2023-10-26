import { TestBed } from '@angular/core/testing';

import { TempWebRequestsService } from './temp-web-requests.service';

describe('TempWebRequestsService', () => {
  let service: TempWebRequestsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TempWebRequestsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

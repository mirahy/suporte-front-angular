import { TestBed } from '@angular/core/testing';

import { MessagesSweetalertService } from './messages-sweetalert.service';

describe('MessagesSweetalertService', () => {
  let service: MessagesSweetalertService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MessagesSweetalertService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

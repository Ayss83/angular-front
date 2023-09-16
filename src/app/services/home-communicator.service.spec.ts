import { TestBed } from '@angular/core/testing';

import { HomeCommunicatorService } from './home-communicator.service';

describe('HomeCommunicatorService', () => {
  let service: HomeCommunicatorService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HomeCommunicatorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

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

  describe('onChangeTitle', () => {
    it('should emit the new title', () => {
      let emittedValue = '';
      const title = 'test title';
      const subscription = service.changeColor$.subscribe((data) => {
        emittedValue = data;
      });

      service.onChangeColor(title);

      expect(emittedValue).toBe(title);

      subscription.unsubscribe();
    });
  });
});

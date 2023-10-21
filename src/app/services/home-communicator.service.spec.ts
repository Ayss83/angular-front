import { TestBed } from '@angular/core/testing';

import { HomeCommunicatorService } from './home-communicator.service';
import { SectionInfo } from '../models/home-communicator.models';

describe('HomeCommunicatorService', () => {
  let service: HomeCommunicatorService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HomeCommunicatorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('onSectionChange', () => {
      it('should emit section change events', (done) => {
        const sectionInfo: SectionInfo = {
          name: 'section1',
          color: 'rgb(0,0,0)',
        };

        service.changeSection$.subscribe((info) => {
          expect(info).toEqual(sectionInfo);
          done();
        });

        service.onSectionChange(sectionInfo);
      });
  })
});

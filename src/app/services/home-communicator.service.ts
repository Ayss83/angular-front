import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { SectionInfo } from '../models/home-communicator.models';

/**
 * Service in charge of communication between child components and home component
 */
@Injectable({
  providedIn: 'root'
})
export class HomeCommunicatorService {
  private changeSection = new Subject<SectionInfo>();

  changeSection$ = this.changeSection.asObservable();

  onSectionChange(sectionInfo: SectionInfo) {
    this.changeSection.next(sectionInfo);
  }
}

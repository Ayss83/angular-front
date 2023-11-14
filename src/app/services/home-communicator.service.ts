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

  /**
   * Emits the information about selected section of application for listening
   * components to be updated
   * 
   * @param sectionInfo newly selected section of application
   */
  onSectionChange(sectionInfo: SectionInfo) {
    this.changeSection.next(sectionInfo);
  }
}

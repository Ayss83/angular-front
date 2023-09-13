import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

/**
 * Service in charge of communication between child components and home component
 */
@Injectable({
  providedIn: 'root'
})
export class HomeCommunicatorService {
  private changeColor = new Subject<string>();

  changeColor$ = this.changeColor.asObservable();

  onChangeColor(color: string) {
    this.changeColor.next(color);
  }
}

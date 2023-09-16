import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { Router, RouterModule } from '@angular/router';
import { HomeCommunicatorService } from '../services/home-communicator.service';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  imports: [RouterModule, MatButtonModule, CommonModule],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeComponent implements OnInit, OnDestroy {
  title = '';
  subscription: Subscription | undefined;
  menuColor = 'transparent';

  constructor(
    private router: Router,
    private communicationService: HomeCommunicatorService,
    private changeDetectorRef: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.subscription = this.communicationService.changeSection$.subscribe(
      (sectionInfo) => {
        this.menuColor = sectionInfo.color;
        this.title = sectionInfo.name;
        this.changeDetectorRef.markForCheck();
      }
    );

    if (this.router.url.includes('invoices')) {
      this.title = 'Invoices';
      this.menuColor = 'rgb(255, 255, 204)';
    }
  }

  ngOnDestroy() {
    this.subscription?.unsubscribe();
  }

  logout() {
    localStorage.removeItem('token');
    this.router.navigate(['/']);
  }

  getLinearGradientColor() {
    return `linear-gradient(180deg, ${this.menuColor} 0%, transparent 100%)`;
  }
}

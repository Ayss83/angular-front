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
import { TokenService } from '../services/token.service';

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
    private changeDetectorRef: ChangeDetectorRef,
    private tokenService: TokenService
  ) {}

  ngOnInit() {
    this.subscription = this.communicationService.changeSection$.subscribe(
      (sectionInfo) => {
        this.menuColor = sectionInfo.color;
        this.title = sectionInfo.name;
        this.changeDetectorRef.markForCheck();
      }
    );

    // Manages title and color when reloading or accessing a view directly
    this.setHeader();
  }

  /**
   * Sets title and color of header according to current route
   */
  private setHeader() {
    if (this.router.url.includes('invoices')) {
      this.title = 'Invoices';
      this.menuColor = 'rgb(255, 255, 204)';
    } else if (this.router.url.includes('customers')) {
      this.title = 'Customers';
      this.menuColor = 'rgb(255, 227, 135)';
    } else if (this.router.url.includes('products')) {
      this.title = 'Products';
      this.menuColor = 'rgb(247, 145, 145)';
    } else if (this.router.url.includes('company')) {
      this.title = 'Company';
      this.menuColor = 'rgb(230, 230, 230)';
    }
  }

  ngOnDestroy() {
    this.subscription?.unsubscribe();
  }

  logout() {
    this.tokenService.removeToken();
    this.router.navigate(['/']);
  }

  getLinearGradientColor() {
    return `linear-gradient(180deg, ${this.menuColor} 0%, transparent 100%)`;
  }
}

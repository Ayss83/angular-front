import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { appColors } from 'src/app/constants';
import { HomeCommunicatorService } from 'src/app/services/home-communicator.service';
import { TokenService } from 'src/app/services/token.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  imports: [
    RouterModule,
    MatButtonModule,
    CommonModule,
    MatIconModule,
    MatListModule,
    MatMenuModule
  ],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeComponent implements OnInit, OnDestroy {
  title = '';
  subscription: Subscription | undefined;
  menuColor = 'transparent';
  appColors = appColors;

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
  setHeader() {
    if (this.router.url.includes('invoices')) {
      this.title = 'Invoices';
      this.menuColor = appColors.yellow;
    } else if (this.router.url.includes('customers')) {
      this.title = 'Customers';
      this.menuColor = appColors.orange;
    } else if (this.router.url.includes('products')) {
      this.title = 'Products';
      this.menuColor = appColors.red;
    } else if (this.router.url.includes('company')) {
      this.title = 'Company';
      this.menuColor = appColors.gray;
    }
  }

  ngOnDestroy() {
    this.subscription?.unsubscribe();
  }

  logout() {
    this.tokenService.removeToken();
    // navigates back to login page
    this.router.navigate(['/']);
  }

  getLinearGradientColor() {
    return `linear-gradient(180deg, ${this.menuColor} 0%, transparent 100%)`;
  }
}

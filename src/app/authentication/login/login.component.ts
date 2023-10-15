import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
} from '@angular/core';
import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { Router, RouterModule } from '@angular/router';
import { User } from 'src/app/models/user.models';
import { AuthService } from 'src/app/services/auth.service';
import { of, switchMap, take, tap } from 'rxjs';
import { LoginResponse } from 'src/app/models/auth.models';
import { CommonModule } from '@angular/common';
import { AuthFormComponent } from '../auth-form/auth-form.component';
import { TokenService } from 'src/app/services/token.service';
import { CompanyService } from 'src/app/services/company.service';
import { Company } from 'src/app/models/company.models';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  imports: [
    MatInputModule,
    MatCardModule,
    MatButtonModule,
    RouterModule,
    CommonModule,
    AuthFormComponent,
  ],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginComponent {
  userCredentials: Partial<User> = {
    email: '',
    password: '',
  };
  hasError = false;

  constructor(
    private authService: AuthService,
    private router: Router,
    private changeDetectorRef: ChangeDetectorRef,
    private tokenService: TokenService,
    private companyService: CompanyService
  ) {}

  /**
   * Updates userCredentials with received information and resets error display
   *
   * @param user received user information
   */
  onFormChange(user: User) {
    this.userCredentials = { ...user };
    this.hasError = false;
  }

  /**
   * Makes login request and navigates to home if successful or displays error message
   */
  formSubmit() {
    this.authService
      .login(this.userCredentials)
      .pipe(
        take(1),
        switchMap((response: LoginResponse | null) => {
          if (response) {
            this.tokenService.setToken(response.token);
            return this.companyService.getCompany();
          } else {
            this.hasError = true;
            this.changeDetectorRef.markForCheck(); // signaling internal change (related to OnPush strategy)
            return of(null);
          }
        }),
        tap((company) => {
          if (this.isCompanyInformationComplete(company)) {
            this.router.navigate(['home']);
          } else {
            this.router.navigate(['home', 'company']);
          }
        })
      )
      .subscribe();
  }

  /**
   * Checks if all base necessary information for invoice has been defined
   * 
   * @param company company information to check
   * @returns boolean to indicate if all base information is present
   */
  isCompanyInformationComplete(company: Company | null) {
    return !!(
      company &&
      company.name &&
      company.address &&
      company.zipCode &&
      company.city
    );
  }
}

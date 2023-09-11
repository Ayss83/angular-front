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
import { take, tap } from 'rxjs';
import { LoginResponse } from 'src/app/models/auth.models';
import { CommonModule } from '@angular/common';
import { AuthFormComponent } from '../auth-form/auth-form.component';

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
    private changeDetectorRef: ChangeDetectorRef
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
        tap((response: LoginResponse | null) => {
          if (response) {
            localStorage.setItem('token', response.token);
            this.router.navigate(['home']);
          } else {
            this.hasError = true;
            this.changeDetectorRef.markForCheck(); // signaling internal change (related to OnPush strategy)
          }
        })
      )
      .subscribe();
  }
}

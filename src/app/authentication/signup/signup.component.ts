import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { Router, RouterModule } from '@angular/router';
import { AuthFormComponent } from '../auth-form/auth-form.component';
import { User } from 'src/app/models/user.models';
import { take, tap } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { SignupResponse } from 'src/app/models/auth.models';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss'],
  imports: [
    MatInputModule,
    MatCardModule,
    MatButtonModule,
    MatSnackBarModule,
    RouterModule,
    CommonModule,
    AuthFormComponent,
  ],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SignupComponent {
  user: User = {
    email: '',
    username: '',
    password: '',
  };
  error = '';
  isCreatingAccount = false;

  constructor(
    private authService: AuthService,
    private router: Router,
    private changeDetectorRef: ChangeDetectorRef,
    private snackBar: MatSnackBar
  ) {}

  /**
   * Updates userCredentials with received information and resets error display
   *
   * @param user received user information
   */
  onFormChange(user: User) {
    this.user = { ...user };
    this.error = '';
  }

  /**
   * Makes sign up request and navigates to home with snackBar message if successful
   * or displays error message
   */
  formSubmit() {
    if (!!this.user.email && !!this.user.username && !!this.user.password) {
      this.isCreatingAccount = true;

      this.authService
        .signup(this.user)
        .pipe(
          take(1),
          tap((response: SignupResponse | { error: string }) => {
            if ('error' in response) {
              this.error = response.error;
            } else {
              this.router.navigate(['/']);
              this.snackBar.open(
                'Account successfully created, you can now log in',
                undefined,
                { duration: 5000, horizontalPosition: 'end' }
              );
            }

            this.isCreatingAccount = false;
            this.changeDetectorRef.markForCheck(); // signaling internal change (related to OnPush strategy)
          })
        )
        .subscribe();
    } else {
      this.error = 'All fields are required';
    }
  }
}

import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { Router, RouterModule } from '@angular/router';
import { UserCredentials } from 'src/app/models/user.models';
import { AuthService } from 'src/app/services/auth.service';
import { take, tap } from 'rxjs';
import { LoginResponse } from 'src/app/models/auth.models';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  imports: [
    FormsModule,
    MatInputModule,
    MatCardModule,
    MatButtonModule,
    RouterModule,
    CommonModule,
  ],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginComponent {
  userCredentials: UserCredentials = {
    email: '',
    password: '',
  };
  loginError = false;

  constructor(
    private authService: AuthService,
    private router: Router,
    private changeDetectorRef: ChangeDetectorRef
  ) {}

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
            this.loginError = true;
            this.changeDetectorRef.markForCheck();
          }
        })
      )
      .subscribe();
  }
}

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SignupComponent } from './signup.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { User } from 'src/app/models/user.models';
import { AuthService } from 'src/app/services/auth.service';
import { of } from 'rxjs';
import { Router } from '@angular/router';
import { SignupResponse } from 'src/app/models/auth.models';
import { MatSnackBar } from '@angular/material/snack-bar';

describe('SignupComponent', () => {
  let component: SignupComponent;
  let fixture: ComponentFixture<SignupComponent>;
  let authService: AuthService;
  let router: Router;
  let snackBar: MatSnackBar;

  const testUser: User = {
    username: 'test name',
    email: 'test@email',
    password: 'testPassword',
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        SignupComponent,
        HttpClientTestingModule,
        RouterTestingModule,
        NoopAnimationsModule,
      ],
    });
    fixture = TestBed.createComponent(SignupComponent);
    component = fixture.componentInstance;
    authService = fixture.debugElement.injector.get(AuthService);
    router = fixture.debugElement.injector.get(Router);
    snackBar = fixture.debugElement.injector.get(MatSnackBar);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('onFormChange', () => {
    it('should define user property with received parameter', () => {
      component.onFormChange(testUser);

      expect(component.user.email).toBe(testUser.email);
      expect(component.user.password).toBe(testUser.password);
      expect(component.user.username).toBe(testUser.username);
    });

    it('should set hasError to empty string', () => {
      component.error = 'test error';

      component.onFormChange(testUser);

      expect(component.error).toBe('');
    });
  });

  describe('formSubmit', () => {
    it('should call signup method from AuthService', () => {
      spyOn(authService, 'signup').and.returnValue(of());
      component.user = { ...testUser };

      component.formSubmit();

      expect(authService.signup).toHaveBeenCalled();
    });

    it('should set error property with error message (missing input)', () => {
      spyOn(authService, 'signup');
      component.error = '';

      component.formSubmit();

      expect(component.error).toBeTruthy();
    });

    it('should set error property with error message (error response)', () => {
      const errorMessage = 'test error';
      spyOn(authService, 'signup').and.returnValue(of({ error: errorMessage }));
      component.error = '';
      component.user = { ...testUser };

      component.formSubmit();

      expect(component.error).toBe(errorMessage);
    });

    it('should navigate to login page', () => {
      spyOn(authService, 'signup').and.returnValue(of({} as SignupResponse));
      spyOn(router, 'navigate');
      component.user = { ...testUser };

      component.formSubmit();

      expect(router.navigate).toHaveBeenCalledWith(['/']);
    });

    it('should open a Material snackbar', () => {
      spyOn(authService, 'signup').and.returnValue(of({} as SignupResponse));
      spyOn(snackBar, 'open');
      component.user = { ...testUser };

      component.formSubmit();

      expect(snackBar.open).toHaveBeenCalledTimes(1);
    });
  });
});

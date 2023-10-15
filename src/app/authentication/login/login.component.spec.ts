import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoginComponent } from './login.component';
import { User } from 'src/app/models/user.models';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { AuthService } from 'src/app/services/auth.service';
import { of } from 'rxjs';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let authService: AuthService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        LoginComponent,
        HttpClientTestingModule,
        RouterTestingModule.withRoutes([
          {
            path: 'home',
            component: LoginComponent,
            children: [{ path: 'company', component: LoginComponent }],
          },
        ]),
        NoopAnimationsModule,
      ],
      providers: [AuthService],
    });
    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    authService = fixture.debugElement.injector.get(AuthService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('onFormChange', () => {
    const testUser: User = {
      username: 'test name',
      email: 'test@email',
      password: 'testPassword',
    };

    it('should define userCredentials property with received parameter', () => {
      component.onFormChange(testUser);

      expect(component.userCredentials.email).toBe(testUser.email);
      expect(component.userCredentials.password).toBe(testUser.password);
    });

    it('should set hasError to false', () => {
      component.hasError = true;

      component.onFormChange(testUser);

      expect(component.hasError).toBeFalse();
    });
  });

  describe('formSubmit', () => {
    it('should call login method from AuthService', () => {
      spyOn(authService, 'login').and.returnValue(of(null));

      component.formSubmit();

      expect(authService.login).toHaveBeenCalled();
    });

    it('should set hasError property to true', () => {
      spyOn(authService, 'login').and.returnValue(of(null));
      component.hasError = false;

      component.formSubmit();

      expect(component.hasError).toBeTrue();
    });

    it('should set token in localStorage', () => {
      spyOn(authService, 'login').and.returnValue(of({ token: 'testToken' }));
      spyOn(window.localStorage, 'setItem');

      component.formSubmit();

      expect(window.localStorage.setItem).toHaveBeenCalledWith(
        'token',
        'testToken'
      );
    });
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AuthFormComponent } from './auth-form.component';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

describe('AuthFormComponent', () => {
  let component: AuthFormComponent;
  let fixture: ComponentFixture<AuthFormComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [AuthFormComponent, NoopAnimationsModule]
    });
    fixture = TestBed.createComponent(AuthFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

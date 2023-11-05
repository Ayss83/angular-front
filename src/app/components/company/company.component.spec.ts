import {
  ComponentFixture,
  TestBed,
  fakeAsync,
  flush,
  tick,
} from '@angular/core/testing';

import { CompanyComponent } from './company.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { of, throwError } from 'rxjs';
import { SaveSuccessSnackbarComponent } from '../shared/save-success-snackbar/save-success-snackbar.component';
import { SaveErrorSnackbarComponent } from '../shared/save-error-snackbar/save-error-snackbar.component';
import { Company } from 'src/app/models/company.models';

describe('CompanyComponent', () => {
  let component: CompanyComponent;
  let fixture: ComponentFixture<CompanyComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        CompanyComponent,
        HttpClientTestingModule,
        NoopAnimationsModule,
      ],
    });
    fixture = TestBed.createComponent(CompanyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngAfterViewInit', () => {
    it('should define company property with requested information', () => {
      const mockCompany = { name: 'test name' } as Company;
      spyOn(component['companyService'], 'getCompany').and.returnValue(
        of(mockCompany)
      );

      component.ngAfterViewInit();

      expect(component.company).toBe(mockCompany);
    });
  });

  describe('save', () => {
    it('should emit with saving$ subject', fakeAsync(() => {
      const spy = spyOn(component.saving$, 'next');
      spyOn(component['companyService'], 'save').and.returnValue(
        of({} as Company)
      );

      component.save();
      flush();

      expect(spy).toHaveBeenCalledTimes(2);
    }));

    it('should display snackBar message (next)', fakeAsync(() => {
      const spy = spyOn(component['snackBar'], 'openFromComponent');
      spyOn(component['companyService'], 'save').and.returnValue(
        of({} as Company)
      );

      component.save();
      flush();

      expect(spy).toHaveBeenCalledWith(SaveSuccessSnackbarComponent, {
        horizontalPosition: 'end',
        duration: 4000,
      });
    }));

    it('should display snackBar message (error)', fakeAsync(() => {
      const spy = spyOn(component['snackBar'], 'openFromComponent');
      spyOn(component['companyService'], 'save').and.returnValue(
        throwError(() => new Error('test'))
      );

      component.save();
      flush();

      expect(spy).toHaveBeenCalledWith(SaveErrorSnackbarComponent, {
        horizontalPosition: 'end',
        duration: 4000,
      });
    }));

    it('should assign response to company property', fakeAsync(() => {
      const mockCompany = { name: 'test' } as Company;
      spyOn(component['companyService'], 'save').and.returnValue(
        of(mockCompany)
      );

      component.save();
      flush();

      expect(component.company).toBe(mockCompany);
    }));
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomerEditComponent } from './customer-edit.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { Customer } from 'src/app/models/customer.models';
import { of, throwError } from 'rxjs';
import { SaveErrorSnackbarComponent } from 'src/app/shared/save-error-snackbar/save-error-snackbar.component';

describe('CustomerEditComponent', () => {
  let component: CustomerEditComponent;
  let fixture: ComponentFixture<CustomerEditComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        CustomerEditComponent,
        HttpClientTestingModule,
        RouterTestingModule,
        NoopAnimationsModule,
      ],
    });
    fixture = TestBed.createComponent(CustomerEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    it('should assign received customer to customer property', () => {
      const mockCustomer = { lastName: 'test' } as Customer;
      spyOn(component['location'], 'getState').and.returnValue({
        customer: mockCustomer,
      });

      component.ngOnInit();

      expect(component.customer).toBe(mockCustomer);
    });
  });

  describe('save', () => {
    it('should emit with saving$ subject', () => {
      const spy = spyOn(component.saving$, 'next');
      spyOn(component['customerService'], 'save').and.returnValue(of({}));

      component.save();

      expect(spy).toHaveBeenCalledTimes(2);
    });

    it('should navigate to parent route', () => {
      const spy = spyOn(component['router'], 'navigate');
      spyOn(component['customerService'], 'save').and.returnValue(of({}));

      component.save();

      expect(spy).toHaveBeenCalledWith(['../'], {
        relativeTo: component['route'],
      });
    });

    it('should display snackBar message', () => {
      const spy = spyOn(component['snackBar'], 'openFromComponent');
      spyOn(component['customerService'], 'save').and.returnValue(
        throwError(() => new Error('test'))
      );

      component.save();

      expect(spy).toHaveBeenCalledWith(SaveErrorSnackbarComponent, {
        horizontalPosition: 'end',
        duration: 4000,
      });
    });
  });
});

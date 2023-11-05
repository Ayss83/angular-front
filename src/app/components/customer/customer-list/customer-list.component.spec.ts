import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomerListComponent } from './customer-list.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Customer } from 'src/app/models/customer.models';
import { of, throwError } from 'rxjs';
import { DeleteErrorSnackbarComponent } from '../../shared/delete-error-snackbar/delete-error-snackbar.component';
import { RetrieveErrorSnackbarComponent } from '../../shared/retrieve-error-snackbar/retrieve-error-snackbar.component';

describe('CustomerListComponent', () => {
  let component: CustomerListComponent;
  let fixture: ComponentFixture<CustomerListComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        CustomerListComponent,
        HttpClientTestingModule,
        RouterTestingModule,
        MatTooltipModule,
      ],
    });
    fixture = TestBed.createComponent(CustomerListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('getCustomers', () => {
    it('should assign response to customerList.data', () => {
      const mockResult = [{} as Customer, {} as Customer];
      spyOn(component['customerService'], 'getUserCustomers').and.returnValue(
        of(mockResult)
      );

      component.getCustomers();

      expect(component.customerList.data).toBe(mockResult);
    });

    it('should display snackBar message', () => {
      spyOn(component['customerService'], 'getUserCustomers').and.returnValue(
        throwError(() => new Error('test'))
      );
      const spy = spyOn(component['snackBar'], 'openFromComponent');

      component.getCustomers();

      expect(spy).toHaveBeenCalledWith(RetrieveErrorSnackbarComponent, {
        horizontalPosition: 'end',
        duration: 4000,
      });
    });
  });

  describe('editCustomer', () => {
    it('should navigate to edit view', () => {
      const spy = spyOn(component['router'], 'navigate');
      const mockCustomer = { lastName: 'test' } as Customer;

      component.editCustomer(mockCustomer);

      expect(spy).toHaveBeenCalledWith(['edit'], {
        relativeTo: component['route'],
        state: { customer: mockCustomer },
      });
    });
  });

  describe('deleteCustomer', () => {
    it('should request customer deletion', () => {
      const spy = spyOn(
        component['customerService'],
        'deleteCustomer'
      ).and.returnValue(of());
      const id = 'test';

      component.deleteCustomer(id);

      expect(spy).toHaveBeenCalledWith(id);
    });

    it('should renew customers list', () => {
      spyOn(component['customerService'], 'deleteCustomer').and.returnValue(
        of({})
      );
      const spy = spyOn(component, 'getCustomers');

      component.deleteCustomer('test');

      expect(spy).toHaveBeenCalledTimes(1);
    });

    it('should display snackBar message on error', () => {
      spyOn(component['customerService'], 'deleteCustomer').and.returnValue(
        throwError(() => new Error('test'))
      );
      const spy = spyOn(component['snackBar'], 'openFromComponent');

      component.deleteCustomer('test');

      expect(spy).toHaveBeenCalledWith(DeleteErrorSnackbarComponent, {
        horizontalPosition: 'end',
        duration: 4000,
      });
    });
  });
});

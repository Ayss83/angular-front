import { ComponentFixture, TestBed, fakeAsync, flush } from '@angular/core/testing';

import { CustomerEditComponent } from './customer-edit.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { Customer } from 'src/app/models/customer.models';
import { of } from 'rxjs';

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
    it('should emit with saving$ subject', fakeAsync(() => {
      const spy = spyOn(component.saving$, 'next');
      spyOn(component['customerService'], 'save').and.returnValue(of({}));

      component.save();
      flush();

      expect(spy).toHaveBeenCalledTimes(2);
    }));
  });
});

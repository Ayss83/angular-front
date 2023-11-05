import {
  ComponentFixture,
  TestBed,
  fakeAsync,
  flush,
} from '@angular/core/testing';

import { InvoiceListComponent } from './invoice-list.component';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of, throwError } from 'rxjs';
import { Invoice } from 'src/app/models/invoice.models';
import { Product, QuantityProduct } from 'src/app/models/product.models';
import { Company } from 'src/app/models/company.models';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { DeleteErrorSnackbarComponent } from '../../shared/delete-error-snackbar/delete-error-snackbar.component';
import { RetrieveErrorSnackbarComponent } from '../../shared/retrieve-error-snackbar/retrieve-error-snackbar.component';

describe('InvoiceListComponent', () => {
  let component: InvoiceListComponent;
  let fixture: ComponentFixture<InvoiceListComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        InvoiceListComponent,
        RouterTestingModule,
        HttpClientTestingModule,
        NoopAnimationsModule,
      ],
    });
    fixture = TestBed.createComponent(InvoiceListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('getInvoices', () => {
    it('should request invoices and assign response to invoiceList.data', fakeAsync(() => {
      const mockInvoiceList = [{} as Invoice, {} as Invoice];
      const spy = spyOn(
        component['invoiceService'],
        'getUserInvoices'
      ).and.returnValue(of(mockInvoiceList));

      component.getInvoices();
      flush();

      expect(spy).toHaveBeenCalledTimes(1);
      expect(component.invoiceList.data).toBe(mockInvoiceList);
    }));

    it('should display snackbar message on error', fakeAsync(() => {
      spyOn(component['invoiceService'], 'getUserInvoices').and.returnValue(
        throwError(() => new Error('test'))
      );
      const spy = spyOn(component['snackBar'], 'openFromComponent');

      component.getInvoices();
      flush();

      expect(spy).toHaveBeenCalledWith(RetrieveErrorSnackbarComponent, {
        horizontalPosition: 'end',
        duration: 4000,
      });
    }));
  });

  describe('computeTotal', () => {
    it('should return expected value', () => {
      const mockProductsList: QuantityProduct[] = [
        { quantity: 5, product: { price: 12 } as Product },
        { quantity: 1, product: { price: 0 } as Product },
        { quantity: 3, product: {} as Product },
        { quantity: 2, product: { price: 5.14 } as Product },
      ];

      expect(component.computeTotal(mockProductsList)).toBe(70.28);
    });
  });

  describe('editInvoice', () => {
    it('should navigate to edit route with correct parameters', () => {
      const spy = spyOn(component['router'], 'navigate');
      const mockInvoice = {} as Invoice;

      component.editInvoice(mockInvoice);

      expect(spy).toHaveBeenCalledWith(['edit'], {
        relativeTo: component['route'],
        state: { invoice: mockInvoice },
      });
    });
  });

  describe('deleteInvoice', () => {
    it('should request invoice deletion', () => {
      const spy = spyOn(
        component['invoiceService'],
        'deleteInvoice'
      ).and.returnValue(of());
      const id = 'test';

      component.deleteInvoice(id);

      expect(spy).toHaveBeenCalledWith(id);
    });

    it('should renew invoice list', fakeAsync(() => {
      spyOn(component['invoiceService'], 'deleteInvoice').and.returnValue(
        of({})
      );
      const spy = spyOn(
        component['invoiceService'],
        'getUserInvoices'
      ).and.callFake(() => of());

      component.deleteInvoice('test');
      flush();

      expect(spy).toHaveBeenCalledTimes(1);
    }));

    it('should display snackBar message on error', fakeAsync(() => {
      spyOn(component['invoiceService'], 'deleteInvoice').and.returnValue(
        throwError(() => new Error('test'))
      );
      const spy = spyOn(component['snackBar'], 'openFromComponent');

      component.deleteInvoice('test');
      flush();

      expect(spy).toHaveBeenCalledWith(DeleteErrorSnackbarComponent, {
        horizontalPosition: 'end',
        duration: 4000,
      });
    }));
  });

  describe('displayInvoice', () => {
    const mockInvoice: Invoice = {
      num: 'INV123',
      date: new Date(),
      customer: {
        num: 12345,
        lastName: 'Doe',
        firstName: 'John',
        email: 'johndoe@example.com',
        address: {
          address: '123 Main Street',
          address2: 'Apt 4B',
          zipCode: '12345',
          city: 'Example City',
        },
        phone: '555-123-4567',
      },
      products: [
        {
          product: {
            reference: 'PROD001',
            name: 'Sample Product 1',
            description: 'Description of Product 1',
            price: 19.99,
          },
          quantity: 2,
        },
        {
          product: {
            reference: 'PROD002',
            name: 'Sample Product 2',
            description: 'Description of Product 2',
            price: 29.99,
          },
          quantity: 1,
        },
      ],
      vatRate: 0.2,
    };

    const mockCompany: Company = {
      registrationNumber: '123456789',
      name: 'Sample Company',
      email: 'sample@example.com',
      phone: '555-123-4567',
      address: '123 Main Street',
      address2: 'Suite 200',
      zipCode: '12345',
      city: 'Example City',
    };

    it('should set invoicePdf property', () => {
      spyOn(component['companyService'], 'getCompany').and.returnValue(
        of(mockCompany)
      );

      component.invoicePdf = '';

      component.displayInvoice(mockInvoice);

      expect(component.invoicePdf).not.toBeFalsy();
    });

    it('should open a dialog on successful generation', () => {
      spyOn(component['companyService'], 'getCompany').and.returnValue(
        of(mockCompany)
      );
      const spy = spyOn(component['dialog'], 'open');

      component.displayInvoice(mockInvoice);

      expect(spy).toHaveBeenCalledTimes(1);
    });

    it('should display snackBar message on error', () => {
      spyOn(component['companyService'], 'getCompany').and.returnValue(
        throwError(() => new Error('test'))
      );
      const spy = spyOn(component['snackBar'], 'openFromComponent');

      component.displayInvoice(mockInvoice);

      expect(spy).toHaveBeenCalledWith(RetrieveErrorSnackbarComponent, {
        horizontalPosition: 'end',
        duration: 4000,
      });
    });
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InvoiceEditComponent } from './invoice-edit.component';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { FilterableSearchComponent } from 'src/app/shared/filterable-search/filterable-search.component';
import { Invoice } from 'src/app/models/invoice.models';
import { of, throwError } from 'rxjs';
import { Product, QuantityProduct } from 'src/app/models/product.models';
import { Customer } from 'src/app/models/customer.models';
import { RetrieveErrorSnackbarComponent } from 'src/app/shared/retrieve-error-snackbar/retrieve-error-snackbar.component';
import { SaveErrorSnackbarComponent } from 'src/app/shared/save-error-snackbar/save-error-snackbar.component';

describe('InvoiceEditComponent', () => {
  let component: InvoiceEditComponent;
  let fixture: ComponentFixture<InvoiceEditComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        InvoiceEditComponent,
        RouterTestingModule,
        HttpClientTestingModule,
        MatDatepickerModule,
        MatNativeDateModule,
        NoopAnimationsModule,
        FilterableSearchComponent,
      ],
    });
    fixture = TestBed.createComponent(InvoiceEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngAfterViewInit', () => {
    it('should deploy customer information panel', () => {
      const spy = spyOn(component.customerInfoPanel, 'open');
      component.invoice.customer.lastName = 'test';

      component.ngAfterViewInit();

      expect(spy).toHaveBeenCalledTimes(1);
    });
  });

  describe('initInvoice', () => {
    it('should set invoice property', () => {
      const mockInvoice = {} as Invoice;
      spyOn(component['location'], 'getState').and.returnValue({
        invoice: mockInvoice,
      });

      component.initInvoice();

      expect(component.invoice).toBe(mockInvoice);
    });
  });

  describe('getListsData', () => {
    it('should set products property', () => {
      const mockProducts = [{} as Product];
      spyOn(component['productService'], 'getUserProducts').and.returnValue(
        of(mockProducts)
      );

      component.getListsData();

      expect(component.products).toBe(mockProducts);
    });

    it('should set customers property', () => {
      const mockCustomers = [{} as Customer];
      spyOn(component['customerService'], 'getUserCustomers').and.returnValue(
        of(mockCustomers)
      );

      component.getListsData();

      expect(component.customers).toBe(mockCustomers);
    });

    it('should display snackbar message (products)', () => {
      const spy = spyOn(component['snackbar'], 'openFromComponent');
      spyOn(component['productService'], 'getUserProducts').and.returnValue(
        throwError(() => new Error('test'))
      );

      component.getListsData();

      expect(spy).toHaveBeenCalledTimes(1);
      expect(spy).toHaveBeenCalledWith(RetrieveErrorSnackbarComponent, {
        horizontalPosition: 'end',
        duration: 4000,
      });
    });

    it('should display snackbar message (customers)', () => {
      const spy = spyOn(component['snackbar'], 'openFromComponent');
      spyOn(component['customerService'], 'getUserCustomers').and.returnValue(
        throwError(() => new Error('test'))
      );

      component.getListsData();

      expect(spy).toHaveBeenCalledTimes(1);
      expect(spy).toHaveBeenCalledWith(RetrieveErrorSnackbarComponent, {
        horizontalPosition: 'end',
        duration: 4000,
      });
    });
  });

  describe('addNewProduct', () => {
    it('should add an empty quantity/product to invoice', () => {
      component.invoice.products = [
        {} as QuantityProduct,
        {} as QuantityProduct,
      ];

      component.addNewProduct();

      expect(component.invoice.products.length).toBe(3);
      const addedProduct = component.invoice.products.pop();
      expect(addedProduct?.quantity).toBe(0);
      expect(addedProduct?.product.description).toBe('');
      expect(addedProduct?.product.name).toBe('');
      expect(addedProduct?.product.reference).toBe('');
      expect(addedProduct?.product.price).toBe(null);
    });
  });

  describe('addExistingProduct', () => {
    it('should add product selected to invoice product list', () => {
      const mockProduct = {
        name: 'test',
        reference: 'test ref',
        description: 'test description',
        price: 15,
      };
      component.invoice.products = [];
      component.productToAdd = mockProduct;

      component.addExistingProduct();

      expect(component.invoice.products.length).toBe(1);
      const addedProduct = component.invoice.products.pop();
      expect(addedProduct?.quantity).toBe(1);
      expect(addedProduct?.product).toBe(mockProduct);
    });
  });

  describe('selectProduct', () => {
    it('should open dialog for product selection', () => {
      const mockTemplate = {} as any;
      const spy = spyOn(component['dialog'], 'open');
      component.selectProductTemplate = mockTemplate;

      component.selectProduct();

      expect(spy).toHaveBeenCalledWith(mockTemplate, { disableClose: true });
    });
  });

  describe('removeProduct', () => {
    it('should remove right product from invoice product list', () => {
      const mockQuantityProduct = {
        quantity: 5,
        product: {
          name: 'test',
          reference: 'test reference',
          description: 'test description',
          price: 20,
        },
      };
      component.invoice.products = [
        {} as QuantityProduct,
        mockQuantityProduct,
        {} as QuantityProduct,
      ];

      component.removeProduct(mockQuantityProduct);

      expect(component.invoice.products.length).toBe(2);
      expect(
        component.invoice.products.includes(mockQuantityProduct)
      ).toBeFalse();
    });
  });

  describe('filterNotAlreadyAddedProducts', () => {
    it('should return product list without ones present in invoice', () => {
      const mockProduct1 = {} as Product;
      const mockProduct2 = {} as Product;
      const mockProduct3 = {} as Product;
      const mockProduct4 = {} as Product;
      const mockProduct5 = {} as Product;
      component.invoice.products = [
        { product: {} } as QuantityProduct,
        { product: mockProduct4 } as QuantityProduct,
        { product: {} } as QuantityProduct,
        { product: mockProduct2 } as QuantityProduct,
      ];
      component.products = [
        mockProduct1,
        mockProduct2,
        mockProduct3,
        mockProduct4,
        mockProduct5,
      ];

      const filteredList = component.filterNotAlreadyAddedProducts();

      expect(filteredList.length).toBe(3);
      expect(filteredList.includes(mockProduct1)).toBeTrue();
      expect(filteredList.includes(mockProduct2)).toBeFalse();
      expect(filteredList.includes(mockProduct3)).toBeTrue();
      expect(filteredList.includes(mockProduct4)).toBeFalse();
      expect(filteredList.includes(mockProduct5)).toBeTrue();
    });
  });

  describe('save', () => {
    it('should emit with saving$ subject', () => {
      const spy = spyOn(component.saving$, 'next');
      spyOn(component['invoiceService'], 'saveInvoice').and.returnValue(
        of({} as Invoice)
      );

      component.save();

      expect(spy).toHaveBeenCalledTimes(2);
    });

    it('should navigate to parent route', () => {
      const spy = spyOn(component['router'], 'navigate');
      spyOn(component['invoiceService'], 'saveInvoice').and.returnValue(
        of({} as Invoice)
      );

      component.save();

      expect(spy).toHaveBeenCalledWith(['../'], {
        relativeTo: component['route'],
      });
    });

    it('should navigate to parent route', () => {
      const spy = spyOn(component['snackbar'], 'openFromComponent');
      spyOn(component['invoiceService'], 'saveInvoice').and.returnValue(
        throwError(() => new Error('test'))
      );

      component.save();

      expect(spy).toHaveBeenCalledWith(SaveErrorSnackbarComponent, {
        horizontalPosition: 'end',
        duration: 4000,
      });
    });

    it('should send and invoice without incomplete products or with 0 quantity', () => {
      component.invoice = {
        products: [
          { quantity: 1, product: { name: 'test1' } },
          { quantity: 0, product: { name: 'test2' } },
          { quantity: 3, product: { name: '' } },
          { quantity: 2, product: { name: 'test3' } },
          { quantity: 8, product: { name: 'test4' } },
        ],
      } as Invoice;
      const spy = spyOn(
        component['invoiceService'],
        'saveInvoice'
      ).and.returnValue(of({} as Invoice));

      component.save();

      const spyCall = spy.calls.mostRecent();

      expect(spyCall.args[0].products.length).toBe(3);
    });
  });

  describe('useNewCustomer', () => {
    it('should empty customer information in invoice', () => {
      component.invoice.customer = {
        firstName: 'test',
        lastName: 'test',
        address: { address: 'test', address2: 'test', zipCode: 'test', city: 'test' },
        email: 'test',
        num: 123,
        phone: 'test',
      };

      component.useNewCustomer();

      expect(component.invoice.customer.firstName).toBe('');
      expect(component.invoice.customer.lastName).toBe('');
      expect(component.invoice.customer.email).toBe('');
      expect(component.invoice.customer.phone).toBe('');
      expect(component.invoice.customer.num).toBe(null);
      expect(component.invoice.customer.address.address).toBe('');
      expect(component.invoice.customer.address.address2).toBe('');
      expect(component.invoice.customer.address.zipCode).toBe('');
      expect(component.invoice.customer.address.city).toBe('');
    });
  });
});

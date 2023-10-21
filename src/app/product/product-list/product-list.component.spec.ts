import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductListComponent } from './product-list.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { MatTooltipModule } from '@angular/material/tooltip';
import { of, throwError } from 'rxjs';
import { Product } from 'src/app/models/product.models';
import { RetrieveErrorSnackbarComponent } from 'src/app/shared/retrieve-error-snackbar/retrieve-error-snackbar.component';
import { DeleteErrorSnackbarComponent } from 'src/app/shared/delete-error-snackbar/delete-error-snackbar.component';

describe('ProductListComponent', () => {
  let component: ProductListComponent;
  let fixture: ComponentFixture<ProductListComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        ProductListComponent,
        HttpClientTestingModule,
        RouterTestingModule,
        MatTooltipModule,
      ],
    });
    fixture = TestBed.createComponent(ProductListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('getProducts', () => {
    it('should assign response to productList.data', () => {
      const mockResult = [{} as Product, {} as Product, {} as Product];
      spyOn(component['productService'], 'getUserProducts').and.returnValue(
        of(mockResult)
      );

      component.getProducts();

      expect(component.productList.data).toBe(mockResult);
    });

    it('should display snackBar message', () => {
      spyOn(component['productService'], 'getUserProducts').and.returnValue(
        throwError(() => new Error('test'))
      );
      const spy = spyOn(component['snackBar'], 'openFromComponent');

      component.getProducts();

      expect(spy).toHaveBeenCalledWith(RetrieveErrorSnackbarComponent, {
        horizontalPosition: 'end',
        duration: 4000,
      });
    });
  });

  describe('editProduct', () => {
    it('should navigate to edit view', () => {
      const spy = spyOn(component['router'], 'navigate');
      const mockProduct = {} as Product;

      component.editProduct(mockProduct);

      expect(spy).toHaveBeenCalledWith(['edit'], {
        relativeTo: component['route'],
        state: { product: mockProduct },
      });
    });
  });

  describe('deleteProduct', () => {
    it('should request product deletion', () => {
      const spy = spyOn(
        component['productService'],
        'deleteProduct'
      ).and.returnValue(of());
      const id = 'test';

      component.deleteProduct(id);

      expect(spy).toHaveBeenCalledWith(id);
    });

    it('should renew product list', () => {
      spyOn(component['productService'], 'deleteProduct').and.returnValue(
        of({})
      );
      const spy = spyOn(component, 'getProducts');

      component.deleteProduct('test');

      expect(spy).toHaveBeenCalledTimes(1);
    });

    it('should display snackbar message on error', () => {
      spyOn(component['productService'], 'deleteProduct').and.returnValue(
        throwError(() => new Error('test'))
      );
      const spy = spyOn(component['snackBar'], 'openFromComponent');

      component.deleteProduct('test');

      expect(spy).toHaveBeenCalledWith(DeleteErrorSnackbarComponent, {
        horizontalPosition: 'end',
        duration: 4000,
      });
    });
  });
});

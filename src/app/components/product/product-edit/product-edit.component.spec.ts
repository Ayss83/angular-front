import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductEditComponent } from './product-edit.component';
import { RouterTestingModule } from '@angular/router/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { Product } from 'src/app/models/product.models';
import { of, throwError } from 'rxjs';
import { SaveErrorSnackbarComponent } from '../../shared/save-error-snackbar/save-error-snackbar.component';

describe('ProductEditComponent', () => {
  let component: ProductEditComponent;
  let fixture: ComponentFixture<ProductEditComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        ProductEditComponent,
        RouterTestingModule,
        NoopAnimationsModule,
        HttpClientTestingModule,
      ],
    });
    fixture = TestBed.createComponent(ProductEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('initProduct', () => {
    it('should assing received product to product property', () => {
      const mockProduct = { name: 'test' } as Product;
      spyOn(component['location'], 'getState').and.returnValue({
        product: mockProduct,
      });

      component.initProduct();

      expect(component.product).toBe(mockProduct);
    });
  });

  describe('save', () => {
    it('should emit with saving$ subject', () => {
      const spy = spyOn(component.saving$, 'next');
      spyOn(component['productService'], 'saveProduct').and.returnValue(of({}));

      component.save();

      expect(spy).toHaveBeenCalledTimes(2);
    });

    it('should navigate to parent route', () => {
      const spy = spyOn(component['router'], 'navigate');
      spyOn(component['productService'], 'saveProduct').and.returnValue(of({}));

      component.save();

      expect(spy).toHaveBeenCalledWith(['../'], {
        relativeTo: component['route'],
      });
    });

    it('should display snackBar message', () => {
      const spy = spyOn(component['snackBar'], 'openFromComponent');
      spyOn(component['productService'], 'saveProduct').and.returnValue(
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

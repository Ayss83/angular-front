import { Component, OnInit } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { ProductService } from 'src/app/services/product.service';
import { Product } from 'src/app/models/product.models';
import { Subject } from 'rxjs';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { SaveErrorSnackbarComponent } from '../../shared/save-error-snackbar/save-error-snackbar.component';

@Component({
  selector: 'app-product-edit',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    MatButtonModule,
    MatIconModule,
    MatInputModule,
    MatSnackBarModule,
  ],
  templateUrl: './product-edit.component.html',
  styleUrls: ['./product-edit.component.scss'],
})
export class ProductEditComponent implements OnInit {
  product: Product = { reference: '', name: '', description: '', price: null };
  isSaving$ = new Subject<boolean>();

  constructor(
    private productService: ProductService,
    private location: Location,
    private router: Router,
    private route: ActivatedRoute,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit() {
    this.initProduct();
  }

  /**
   * Checks for a product received via navigation data. Assigns it to product property if
   * present (product edition)
   */
  initProduct() {
    const receivedProduct = (this.location.getState() as { product: Product })
      ?.product;
    if (!!receivedProduct) {
      this.product = receivedProduct;
    }
  }

  /**
   * Requests product saving and navigates to product list view.
   * Displays message on failure
   */
  save() {
    this.isSaving$.next(true);
    this.productService.saveProduct(this.product).subscribe({
      next: () => {
        this.router.navigate(['../'], { relativeTo: this.route });
        this.isSaving$.next(false);
      },
      error: () => {
        this.snackBar.openFromComponent(SaveErrorSnackbarComponent, {
          horizontalPosition: 'end',
          duration: 4000,
        });
        this.isSaving$.next(false);
      },
    });
  }
}

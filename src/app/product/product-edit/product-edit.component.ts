import { Component } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { ProductService } from 'src/app/services/product.service';
import { Product } from 'src/app/models/product.models';
import { Subject, tap } from 'rxjs';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { SaveErrorSnackbarComponent } from 'src/app/shared/save-error-snackbar/save-error-snackbar.component';

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
export class ProductEditComponent {
  product: Product = { reference: '', name: '', description: '', price: null };
  saving$ = new Subject<boolean>();

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
   * Checks for a product received via navigation data. Assign it to product property if
   * present (product edition)
   */
  private initProduct() {
    const receivedProduct = (this.location.getState() as { product: Product })
      ?.product;
    if (!!receivedProduct) {
      this.product = receivedProduct;
    }
  }

  save() {
    this.saving$.next(true);
    this.productService.saveProduct(this.product).subscribe({
      next: () => {
        this.router.navigate(['../'], { relativeTo: this.route });
        this.saving$.next(false);
      },
      error: () => {
        this.snackBar.openFromComponent(SaveErrorSnackbarComponent, {
          horizontalPosition: 'end',
          duration: 4000,
        });
        this.saving$.next(false);
      },
    });
  }
}

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ProductService } from 'src/app/services/product.service';
import { Product } from 'src/app/models/product.models';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { RetrieveErrorSnackbarComponent } from '../../shared/retrieve-error-snackbar/retrieve-error-snackbar.component';
import { DeleteErrorSnackbarComponent } from '../../shared/delete-error-snackbar/delete-error-snackbar.component';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatButtonModule,
    RouterModule,
    MatIconModule,
    MatTooltipModule,
    MatSnackBarModule,
  ],
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.scss'],
})
export class ProductListComponent implements OnInit {
  productList = new MatTableDataSource<Product>();

  get displayedColumns() {
    const columns = ['reference', 'name', 'description', 'price', 'actions'];

    if (window.innerWidth > 599) {
      return columns;
    }

    return [...columns.slice(0, 2), ...columns.slice(-2)];
  }

  constructor(
    private productService: ProductService,
    private router: Router,
    private route: ActivatedRoute,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.getProducts();
  }

  /**
   * Requests product list and updates the dataSource with result
   * Displays message on failure
   */
  getProducts() {
    this.productService.getUserProducts().subscribe({
      next: (products) => {
        this.productList.data = products;
      },
      error: () => {
        this.snackBar.openFromComponent(RetrieveErrorSnackbarComponent, {
          horizontalPosition: 'end',
          duration: 4000,
        });
      },
    });
  }

  /**
   * Navigates to edition page, passing the product as data
   *
   * @param product product to edit
   */
  editProduct(product: Product) {
    this.router.navigate(['edit'], {
      relativeTo: this.route,
      state: { product },
    });
  }

  /**
   * Requests product deletion and triggers update of product list
   *
   * @param productId id of product to delete
   */
  deleteProduct(productId: string) {
    this.productService.deleteProduct(productId).subscribe({
      next: () => {
        this.getProducts();
      },
      error: () => {
        this.snackBar.openFromComponent(DeleteErrorSnackbarComponent, {
          horizontalPosition: 'end',
          duration: 4000,
        });
      },
    });
  }
}

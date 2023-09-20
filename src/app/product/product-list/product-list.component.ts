import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ProductService } from 'src/app/services/product.service';
import { Product } from 'src/app/models/product.models';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatButtonModule,
    RouterModule,
    MatIconModule,
    MatTooltipModule
  ],
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.scss'],
})
export class ProductListComponent implements OnInit {
  productList = new MatTableDataSource<Product>();
  displayedColumns = ['reference', 'name', 'description', 'price', 'actions'];

  constructor(
    private productService: ProductService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.getProducts();
  }

  /**
   * Requests product list and update the dataSource with result
   */
  getProducts() {
    this.productService.getUserProducts().subscribe(products => {
      this.productList.data = products;
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
    this.productService.deleteProduct(productId).subscribe(() => {
      this.getProducts();
    });
  }
}

import {
  ChangeDetectorRef,
  Component,
  OnInit,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { InvoiceService } from 'src/app/services/invoice.service';
import { Invoice } from 'src/app/models/invoice.models';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatExpansionModule, MatExpansionPanel } from '@angular/material/expansion';
import { FormsModule } from '@angular/forms';
import { Product, QuantityProduct } from 'src/app/models/product.models';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatCardModule } from '@angular/material/card';
import { MatSelectModule } from '@angular/material/select';
import { FilterableSearchComponent } from 'src/app/shared/filterable-search/filterable-search.component';
import { CustomerService } from 'src/app/services/customer.service';
import { ProductService } from 'src/app/services/product.service';
import { Customer } from 'src/app/models/customer.models';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { SaveErrorSnackbarComponent } from 'src/app/shared/save-error-snackbar/save-error-snackbar.component';
import { Subject } from 'rxjs';

const emptyCustomer: Customer = {
  firstName: '',
  lastName: '',
  address: { address: '', address2: '', zipCode: '', city: '' },
  email: '',
  num: null,
  phone: '',
};

@Component({
  selector: 'app-invoice-edit',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    MatButtonModule,
    MatIconModule,
    MatInputModule,
    MatDatepickerModule,
    MatExpansionModule,
    MatDialogModule,
    MatCardModule,
    MatSelectModule,
    MatSnackBarModule,
    FilterableSearchComponent,
  ],
  templateUrl: './invoice-edit.component.html',
  styleUrls: ['./invoice-edit.component.scss'],
})
export class InvoiceEditComponent implements OnInit {
  @ViewChild('selectProductTemplate') selectProductTemplate!: TemplateRef<any>;
  @ViewChild('customerPanel') customerInfoPanel!: MatExpansionPanel;

  invoice: Invoice = {
    num: '',
    date: new Date(),
    vatRate: 20,
    customer: { ...emptyCustomer, address: { ...emptyCustomer.address } },
    products: [],
  };
  products: Product[] = [];
  customers: Customer[] = [];

  productToAdd: Product | null = null;

  saving$ = new Subject<boolean>();

  get isEdition() {
    return !!(this.location.getState() as { invoice: Invoice })?.invoice?.num;
  }

  get isValidInvoice() {
    return (
      this.invoice.date &&
      this.invoice.customer.firstName &&
      this.invoice.customer.lastName &&
      this.invoice.customer.address.address &&
      this.invoice.customer.address.zipCode &&
      this.invoice.customer.address.city &&
      this.invoice.products.reduce(
        (acc, element) => acc + element.quantity,
        0
      ) > 0
    );
  }

  get invoiceTotal() {
    return this.invoice.products.reduce(
      (acc, element) => acc + element.quantity * (element.product.price || 0),
      0
    );
  }

  constructor(
    private invoiceService: InvoiceService,
    private customerService: CustomerService,
    private productService: ProductService,
    private location: Location,
    private router: Router,
    private route: ActivatedRoute,
    private dialog: MatDialog,
    private changeDetectorRef: ChangeDetectorRef,
    private snackbar: MatSnackBar
  ) {}

  ngOnInit() {
    const receivedInvoice = (this.location.getState() as { invoice: Invoice })
      ?.invoice;

    if (!!receivedInvoice) {
      this.invoice = receivedInvoice;
    }
    this.productService.getUserProducts().subscribe((products) => {
      this.products = products;
    });
    this.customerService.getUserCustomers().subscribe((customers) => {
      this.customers = customers;
    });
  }

  ngAfterViewInit() {
    if (!!this.invoice.customer.lastName) {
      this.customerInfoPanel.open();
    }
  }

  addProduct(product?: Product) {
    this.invoice.products.push({
      quantity: 0,
      product: product || {
        name: '',
        reference: '',
        description: '',
        price: null,
      },
    });
  }

  addExistingProduct() {
    this.invoice.products.push({
      quantity: 1,
      product: this.productToAdd as Product,
    });
    this.productToAdd = null;
    this.changeDetectorRef.detectChanges();
  }

  selectProduct() {
    this.dialog.open(this.selectProductTemplate, { disableClose: true });
  }

  removeProduct(product: QuantityProduct) {
    this.invoice.products = this.invoice.products.filter(
      (element) => element !== product
    );
  }

  filterNotAlreadyAddedProducts() {
    return this.products.filter(
      (aProduct) =>
        !this.invoice.products
          .map((invoiceProduct) => invoiceProduct.product)
          .find((invoiceProduct) => invoiceProduct === aProduct)
    );
  }

  save() {
    this.saving$.next(true);
    this.invoiceService.saveInvoice(this.cleanInvoice()).subscribe({
      next: () => {
        this.router.navigate(['../'], { relativeTo: this.route });
        this.saving$.next(false);
      },
      error: () => {
        this.snackbar.openFromComponent(SaveErrorSnackbarComponent, {
          horizontalPosition: 'end',
          duration: 4000,
        });
        this.saving$.next(false);
      },
    });
  }

  /**
   * Gets invoice without incomplete products (without name or quantity)
   *
   * @returns Invoice cleaned from incomplete products
   */
  private cleanInvoice(): Invoice {
    return {
      ...this.invoice,
      products: this.invoice.products.filter(
        (quantityProduct) =>
          !!quantityProduct.quantity && !!quantityProduct.product.name
      ),
    };
  }

  useNewCustomer() {
    this.invoice.customer = {
      ...emptyCustomer,
      address: { ...emptyCustomer.address },
    };
  }
}

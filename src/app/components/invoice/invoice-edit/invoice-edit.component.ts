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
import {
  MatExpansionModule,
  MatExpansionPanel,
} from '@angular/material/expansion';
import { FormsModule } from '@angular/forms';
import { Product, QuantityProduct } from 'src/app/models/product.models';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatCardModule } from '@angular/material/card';
import { MatSelectModule } from '@angular/material/select';
import { CustomerService } from 'src/app/services/customer.service';
import { ProductService } from 'src/app/services/product.service';
import { Customer } from 'src/app/models/customer.models';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { Subject } from 'rxjs';
import { FilterableSearchComponent } from '../../shared/filterable-search/filterable-search.component';
import { RetrieveErrorSnackbarComponent } from '../../shared/retrieve-error-snackbar/retrieve-error-snackbar.component';
import { SaveErrorSnackbarComponent } from '../../shared/save-error-snackbar/save-error-snackbar.component';

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
    this.initInvoice();
    this.getListsData();
  }

  ngAfterViewInit() {
    // expands customer info panel if customer information is present on init (edition)
    if (!!this.invoice.customer.lastName) {
      this.customerInfoPanel.open();
    }
  }

  /**
   * Retrieves invoice passed as navigation state and assigns it to invoice property if present
   */
  initInvoice() {
    const receivedInvoice = (this.location.getState() as { invoice: Invoice })
      ?.invoice;

    if (!!receivedInvoice) {
      this.invoice = receivedInvoice;
    }
  }

  /**
   * Requests products and customers list to populate corresponding dropdown lists
   */
  getListsData() {
    this.productService.getUserProducts().subscribe({
      next: (products) => {
        this.products = products;
      },
      error: () => {
        this.snackbar.openFromComponent(RetrieveErrorSnackbarComponent, {
          horizontalPosition: 'end',
          duration: 4000,
        });
      },
    });

    this.customerService.getUserCustomers().subscribe({
      next: (customers) => {
        this.customers = customers;
      },
      error: () => {
        this.snackbar.openFromComponent(RetrieveErrorSnackbarComponent, {
          horizontalPosition: 'end',
          duration: 4000,
        });
      },
    });
  }

  /**
   * Adds a new empty product to invoice.
   */
  addNewProduct() {
    this.invoice.products.push({
      quantity: 0,
      product: {
        name: '',
        reference: '',
        description: '',
        price: null,
      },
    });
  }

  /**
   * Adds currently selected product to invoice
   */
  addExistingProduct() {
    this.invoice.products.push({
      quantity: 1,
      product: this.productToAdd as Product,
    });
    this.productToAdd = null;
    this.changeDetectorRef.detectChanges();
  }

  /**
   * Opens dialog for product selection
   */
  selectProduct() {
    this.dialog.open(this.selectProductTemplate, {
      disableClose: true,
      maxWidth: '100vw',
    });
  }

  /**
   * Removes product received as parameter from invoice
   *
   * @param product product to remove
   */
  removeProduct(product: QuantityProduct) {
    this.invoice.products = this.invoice.products.filter(
      (element) => element !== product
    );
  }

  /**
   * Filters the list of products populating the product dropdown selection and returns it
   *
   * @returns list of products not present in invoice
   */
  filterNotAlreadyAddedProducts() {
    return this.products.filter(
      (aProduct) =>
        !this.invoice.products
          .map((invoiceProduct) => invoiceProduct.product)
          .find(
            (invoiceProduct) =>
              invoiceProduct === aProduct ||
              (invoiceProduct.reference &&
                invoiceProduct.reference === aProduct.reference)
          )
    );
  }

  /**
   * Requests saving of invoice and returns to invoice list view.
   * Displays message on failure
   */
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

  /**
   * Resets invoice customer information
   */
  useNewCustomer() {
    // deep copy of emptyCustomer
    this.invoice.customer = {
      ...emptyCustomer,
      address: { ...emptyCustomer.address },
    };
  }
}

import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { InvoiceService } from 'src/app/services/invoice.service';
import { QuantityProduct } from 'src/app/models/product.models';
import { Invoice } from 'src/app/models/invoice.models';
import { MatTooltipModule } from '@angular/material/tooltip';
import { jsPDF } from 'jspdf';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { Customer } from 'src/app/models/customer.models';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { CompanyService } from 'src/app/services/company.service';
import { catchError, of, tap } from 'rxjs';
import { Company } from 'src/app/models/company.models';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { RetrieveErrorSnackbarComponent } from 'src/app/shared/retrieve-error-snackbar/retrieve-error-snackbar.component';
import { DeleteErrorSnackbarComponent } from 'src/app/shared/delete-error-snackbar/delete-error-snackbar.component';

@Component({
  selector: 'app-invoice-list',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatButtonModule,
    RouterModule,
    MatIconModule,
    MatTooltipModule,
    MatDialogModule,
    MatSnackBarModule,
  ],
  templateUrl: './invoice-list.component.html',
  styleUrls: ['./invoice-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InvoiceListComponent implements OnInit {
  @ViewChild('displayDialog') displayDialog!: TemplateRef<any>;
  displayedColumns = ['num', 'date', 'customer', 'amount', 'actions'];
  invoiceList = new MatTableDataSource<Invoice>();
  invoicePdf: SafeResourceUrl = '';

  constructor(
    private invoiceService: InvoiceService,
    private router: Router,
    private route: ActivatedRoute,
    private domSanitizer: DomSanitizer,
    private dialog: MatDialog,
    private companyService: CompanyService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.getInvoices();
  }

  /**
   * Requests list of invoices for logged user and updates table datasource with result.
   * Displays error message on failure
   */
  getInvoices() {
    this.invoiceService.getUserInvoices().subscribe({
      next: (invoices) => {
        this.invoiceList.data = invoices;
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
   * Computes total price of products passed as parameter
   * 
   * @param products list of invoice products
   * @returns total price for invoice products
   */
  computeTotal(products: QuantityProduct[]) {
    return products.reduce(
      (acc, element) => acc + element.quantity * (element.product.price || 0),
      0
    );
  }

  /**
   * Navigates to edition route and passes invoice to edit as state
   * 
   * @param invoice invoice to edit
   */
  editInvoice(invoice: Invoice) {
    this.router.navigate(['edit'], {
      relativeTo: this.route,
      state: { invoice },
    });
  }

  /**
   * Requests deletion of invoice with id received as parameter. Renews invoice list if successful and
   * displays error message on failure
   * 
   * @param invoiceId id of invoice to delete
   */
  deleteInvoice(invoiceId: string) {
    this.invoiceService.deleteInvoice(invoiceId).subscribe({
      next: () => {
        this.getInvoices();
      },
      error: () => {
        this.snackBar.openFromComponent(DeleteErrorSnackbarComponent, {
          horizontalPosition: 'end',
          duration: 4000,
        });
      },
    });
  }

  /**
   * Builds PDF of invoice and displays it in dialog
   * 
   * @param invoice invoice to display
   */
  displayInvoice(invoice: Invoice) {
    this.companyService
      .getCompany()
      .pipe(
        tap((company) => {
          const doc = new jsPDF();
          doc.setFontSize(12);

          this.setCompanyInfo(doc, company);

          this.setCustomerInfo(doc, invoice.customer);

          this.setTitleAndDate(doc, invoice);

          this.setProductContainer(doc);
          this.setProducts(invoice.products, doc);

          this.setSumUpContainer(doc);
          this.setSumUpInformation(doc, invoice.products);

          this.setCompanyAdditionalInfo(company, doc);

          this.invoicePdf = this.domSanitizer.bypassSecurityTrustResourceUrl(
            doc.output('datauristring')
          );

          this.dialog.open(this.displayDialog, {
            width: '1200px',
            maxWidth: '100vw',
            height: '800px',
            maxHeight: '90vh',
          });
        }),
        catchError(() => {
          this.snackBar.openFromComponent(RetrieveErrorSnackbarComponent, {
            horizontalPosition: 'end',
            duration: 4000,
          });
          return of();
        })
      )
      .subscribe();
  }

  /**
   * Sets date and "title" of invoice in pdf
   *
   * @param doc jsPDF document
   * @param invoice invoice to display
   */
  private setTitleAndDate(doc: jsPDF, invoice: Invoice) {
    doc.text('Date: ' + new Date(invoice.date).toLocaleDateString(), 35, 65, {
      align: 'center',
    });

    doc.setFontSize(20);
    doc.text('Invoice #' + invoice.num, 105, 75, { align: 'center' });
    doc.setFontSize(12);
  }

  /**
   * Sets company information in invoice header
   *
   * @param doc jsPDF document
   * @param company company information
   */
  private setCompanyInfo(doc: jsPDF, company: Company) {
    doc.text(
      [
        company.name,
        company.address,
        company.address2,
        company.zipCode + ' ' + company.city,
      ].filter((element) => element.trim().length > 0),
      35,
      12,
      {
        align: 'center',
        lineHeightFactor: 1.35,
      }
    );
  }

  /**
   * Sets customer information in invoice pdf document
   *
   * @param doc jsPDF document
   * @param customer customer to address the invoice to
   */
  private setCustomerInfo(doc: jsPDF, customer: Customer) {
    doc.text(
      [
        customer.firstName + ' ' + customer.lastName,
        customer.address.address,
        customer.address.address2,
        customer.address.zipCode + ' ' + customer.address.city,
      ].filter((element) => element.trim().length > 0),
      160,
      40,
      { align: 'center', lineHeightFactor: 1.35 }
    );
  }

  /**
   * Sets container for products with its headers in invoice pdf document
   *
   * @param doc jsPDF document
   */
  private setProductContainer(doc: jsPDF) {
    doc.rect(15, 80, 180, 157);

    doc.setFont('', 'bold').setFontSize(13);
    doc.text('Designation', 22, 87);
    doc.text('Qty', 125, 87, { align: 'center' });
    doc.text('Unit price', 158, 87, { align: 'right' });
    doc.text('Total', 185, 87, { align: 'right' });
    doc.setFont('', 'normal').setFontSize(12);
  }

  /**
   * Sets products in invoice pdf document
   *
   * @param products List of products present in invoice
   * @param doc jsPDF document
   */
  private setProducts(products: QuantityProduct[], doc: jsPDF) {
    products.forEach((quantityProduct, index) => {
      doc.text(quantityProduct.product.name, 22, 98 + 11 * index);
      doc.text(quantityProduct.quantity.toString(), 125, 98 + 11 * index, {
        align: 'center',
      });
      doc.text(
        quantityProduct.product.price?.toFixed(2) + '€',
        158,
        98 + 11 * index,
        {
          align: 'right',
        }
      );
      doc.text(
        (
          quantityProduct.quantity * (quantityProduct.product.price || 0)
        ).toFixed(2) + '€',
        185,
        98 + 11 * index,
        { align: 'right' }
      );
    });
  }

  /**
   * Sets container for invoice sum up information (total, VAT amount...)
   *
   * @param doc jsPDF document
   */
  private setSumUpContainer(doc: jsPDF) {
    doc.rect(112, 240, 83, 35);

    doc.text('Total VAT excluded', 117, 249);
    doc.text('20% VAT amount', 117, 259);
    doc.setFont('', 'bold');
    doc.text('Total VAT included', 117, 269);
    doc.setFont('', 'normal');
  }

  /**
   * Computes and adds invoice sum up information to pdf document
   *
   * @param doc jsPDF document
   * @param quantityProducts Product list of invoice
   */
  private setSumUpInformation(doc: jsPDF, quantityProducts: QuantityProduct[]) {
    doc.text(
      quantityProducts
        .reduce(
          (acc, quantityProduct) =>
            acc +
            quantityProduct.quantity *
              ((quantityProduct.product.price || 0) / 1.2),
          0
        )
        .toFixed(2) + '€',
      185,
      249,
      { align: 'right' }
    );

    doc.text(
      quantityProducts
        .reduce(
          (acc, quantityProduct) =>
            acc +
            ((quantityProduct.quantity * (quantityProduct.product.price || 0)) /
              1.2) *
              0.2,
          0
        )
        .toFixed(2) + '€',
      185,
      259,
      { align: 'right' }
    );

    doc.setFont('', 'bold');
    doc.text(
      quantityProducts
        .reduce(
          (acc, quantityProduct) =>
            acc +
            quantityProduct.quantity * (quantityProduct.product.price || 0),
          0
        )
        .toFixed(2) + '€',
      185,
      269,
      { align: 'right' }
    );
    doc.setFont('', 'normal');
  }

  /**
   * Builds and sets company additional information depending on existing information in invoice footer
   *
   * @param company company information
   * @param doc jsPDF document
   */
  private setCompanyAdditionalInfo(company: Company, doc: jsPDF) {
    const companyAdditionalInfo = [
      company.registrationNumber
        ? 'Company registration number: ' + company.registrationNumber
        : '',
      company.email ? 'email: ' + company.email : '',
      company.phone ? 'phone: ' + company.phone : '',
    ]
      .filter((element) => !!element)
      .join(' - ');

    doc.setFontSize(10);
    doc.text(companyAdditionalInfo, 105, 283, { align: 'center' });
  }
}

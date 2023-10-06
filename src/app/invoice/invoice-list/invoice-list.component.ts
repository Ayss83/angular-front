import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
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
  ],
  templateUrl: './invoice-list.component.html',
  styleUrls: ['./invoice-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InvoiceListComponent implements OnInit {
  displayedColumns = ['num', 'date', 'customer', 'amount', 'actions'];
  invoiceList = new MatTableDataSource<Invoice>();
  test: SafeResourceUrl = '';

  constructor(
    private invoiceService: InvoiceService,
    private router: Router,
    private route: ActivatedRoute,
    private domSanitizer: DomSanitizer
  ) {}

  ngOnInit(): void {
    this.getInvoices();
  }

  getInvoices() {
    this.invoiceService.getUserInvoices().subscribe((invoices) => {
      this.invoiceList.data = invoices;
    });
  }

  computeTotal(products: QuantityProduct[]) {
    return products.reduce(
      (acc, element) => acc + element.quantity * (element.product.price || 0),
      0
    );
  }

  editInvoice(invoice: Invoice) {
    this.router.navigate(['edit'], {
      relativeTo: this.route,
      state: { invoice },
    });
  }

  deleteInvoice(invoiceId: string) {
    this.invoiceService.deleteInvoice(invoiceId).subscribe(() => {
      this.getInvoices();
    });
  }

  displayInvoice(invoice: Invoice) {
    const doc = new jsPDF();
    doc.setFontSize(12);

    // company
    doc.text(
      [
        'Company name',
        'Company address 1',
        'Company address 2',
        'Company zipcode and city',
      ].filter((element) => element.trim().length > 0),
      35,
      12,
      {
        align: 'center',
        lineHeightFactor: 1.35,
      }
    );

    this.setCustomerInfo(doc, invoice.customer);

    doc.text('Date: ' + new Date(invoice.date).toLocaleDateString(), 35, 65, {
      align: 'center',
    });

    doc.setFontSize(20);
    doc.text('Invoice #' + invoice.num, 105, 75, { align: 'center' });
    doc.setFontSize(12);

    this.setProductContainer(doc);

    invoice.products.forEach((quantityProduct, index) => {
      doc.text(quantityProduct.product.name, 22, 98 + 11 * index);
      doc.text(quantityProduct.quantity.toString(), 125, 98 + 11 * index, {
        align: 'center',
      });
      doc.text(quantityProduct.product.price?.toFixed(2) + '€', 158, 98 + 11 * index, {
        align: 'right',
      });
      doc.text(
        (quantityProduct.quantity * (quantityProduct.product.price || 0)).toFixed(2) +
          '€',
        185,
        98 + 11 * index,
        { align: 'right' }
      );
    });

    this.test = this.domSanitizer.bypassSecurityTrustResourceUrl(
      doc.output('datauristring')
    );
    // TODO generate pdf, open matdialog with iframe using pdf resourceurl as source
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
    // doc.text(customer.address.address, 160, 46, { align: 'center' });
    // doc.text(customer.address.address2, 160, 52, { align: 'center' });
    // doc.text(
    //   customer.address.zipCode + ' ' + customer.address.city,
    //   160,
    //   customer.address.address2 ? 58 : 52,
    //   { align: 'center' }
    // );
  }
}

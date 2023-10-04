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

  constructor(
    private invoiceService: InvoiceService,
    private router: Router,
    private route: ActivatedRoute
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
}

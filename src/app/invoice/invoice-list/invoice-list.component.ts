import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';
import { InvoiceService } from 'src/app/services/invoice.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-invoice-list',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatButtonModule,
    RouterModule,
    MatIconModule,
  ],
  templateUrl: './invoice-list.component.html',
  styleUrls: ['./invoice-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InvoiceListComponent implements OnInit {
  displayedColumns = ['num', 'date', 'customer', 'amount', 'actions'];
  invoiceList!: Observable<any>;

  constructor(private invoiceService: InvoiceService) {}

  ngOnInit(): void {
    this.invoiceList = this.invoiceService.getUserInvoices();
  }
}

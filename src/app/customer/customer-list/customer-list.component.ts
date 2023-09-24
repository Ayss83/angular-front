import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { CustomerService } from 'src/app/services/customer.service';
import { Customer } from 'src/app/models/customer.models';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
  selector: 'app-customer-list',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatButtonModule,
    RouterModule,
    MatIconModule,
    MatTooltipModule
  ],
  templateUrl: './customer-list.component.html',
  styleUrls: ['./customer-list.component.scss'],
})
export class CustomerListComponent {
  displayedColumns = [
    'num',
    'lastName',
    'firstName',
    'email',
    'city',
    'actions',
  ];
  customerList = new MatTableDataSource<Customer>([]);

  constructor(
    private customerService: CustomerService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.getCustomers();
  }

  getCustomers() {
    this.customerService.getUserCustomers().subscribe((customers) => {
      this.customerList.data = customers;
    });
  }

  editCustomer(customer: Customer) {
    this.router.navigate(['edit'], {
      relativeTo: this.route,
      state: { customer },
    });
  }

  deleteCustomer(customerId: string) {
    this.customerService.deleteCustomer(customerId).subscribe(() => {
      this.getCustomers();
    });
  }
}

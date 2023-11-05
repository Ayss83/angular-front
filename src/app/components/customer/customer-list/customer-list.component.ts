import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { CustomerService } from 'src/app/services/customer.service';
import { Customer } from 'src/app/models/customer.models';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { DeleteErrorSnackbarComponent } from '../../shared/delete-error-snackbar/delete-error-snackbar.component';
import { RetrieveErrorSnackbarComponent } from '../../shared/retrieve-error-snackbar/retrieve-error-snackbar.component';

@Component({
  selector: 'app-customer-list',
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
  templateUrl: './customer-list.component.html',
  styleUrls: ['./customer-list.component.scss'],
})
export class CustomerListComponent {
  customerList = new MatTableDataSource<Customer>([]);

  get displayedColumns() {
    const columns = [
      'num',
      'lastName',
      'firstName',
      'email',
      'city',
      'actions',
    ];

    if (window.innerWidth > 599) {
      return columns;
    }
    
    return [...columns.slice(0, 2), ...columns.slice(-2)];
  }

  constructor(
    private customerService: CustomerService,
    private router: Router,
    private route: ActivatedRoute,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit() {
    this.getCustomers();
  }

  /**
   * Requests customer list and updates the dataSource with result
   * Displays message on failure
   */
  getCustomers() {
    this.customerService.getUserCustomers().subscribe({
      next: (customers) => {
        this.customerList.data = customers;
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
   * Navigates to editionpage, passing the customer as data
   *
   * @param customer customer to edit
   */
  editCustomer(customer: Customer) {
    this.router.navigate(['edit'], {
      relativeTo: this.route,
      state: { customer },
    });
  }

  /**
   * Requests customer deletion and triggers update of customer list
   * @param customerId id of customer to delete
   */
  deleteCustomer(customerId: string) {
    this.customerService.deleteCustomer(customerId).subscribe({
      next: () => {
        this.getCustomers();
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

import { Component, OnInit } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { CustomerService } from 'src/app/services/customer.service';
import { Customer } from 'src/app/models/customer.models';
import { Subject } from 'rxjs';
import { SaveErrorSnackbarComponent } from '../../shared/save-error-snackbar/save-error-snackbar.component';

@Component({
  selector: 'app-customer-edit',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    MatButtonModule,
    MatIconModule,
    MatInputModule,
    MatSnackBarModule,
  ],
  templateUrl: './customer-edit.component.html',
  styleUrls: ['./customer-edit.component.scss'],
})
export class CustomerEditComponent implements OnInit {
  customer: Customer = {
    num: null,
    lastName: '',
    firstName: '',
    email: '',
    phone: '',
    address: {
      address: '',
      address2: '',
      zipCode: '',
      city: '',
    },
  };
  isSaving$ = new Subject<boolean>();

  get isEdition() {
    return !!(this.location.getState() as { customer: Customer })?.customer;
  }

  constructor(
    private customerService: CustomerService,
    private location: Location,
    private router: Router,
    private route: ActivatedRoute,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit() {
    const receivedCustomer = (
      this.location.getState() as { customer: Customer }
    )?.customer;

    if (!!receivedCustomer) {
      this.customer = receivedCustomer;
    }
  }

  /**
   * Requests customer save and navigates to customer list view.
   * Displays message on error
   */
  save() {
    this.isSaving$.next(true);
    this.customerService.save(this.customer).subscribe({
      next: () => {
        this.router.navigate(['../'], { relativeTo: this.route });
        this.isSaving$.next(false);
      },
      error: () => {
        this.snackBar.openFromComponent(SaveErrorSnackbarComponent, {
          horizontalPosition: 'end',
          duration: 4000,
        });
        this.isSaving$.next(false);
      },
    });
  }
}

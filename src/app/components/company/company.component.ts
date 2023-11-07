import { AfterViewInit, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { Subject } from 'rxjs';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { SaveErrorSnackbarComponent } from '../shared/save-error-snackbar/save-error-snackbar.component';
import { SaveSuccessSnackbarComponent } from '../shared/save-success-snackbar/save-success-snackbar.component';
import { Company } from 'src/app/models/company.models';
import { CompanyService } from 'src/app/services/company.service';

@Component({
  selector: 'app-company',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatButtonModule,
    MatInputModule,
    MatSnackBarModule,
  ],
  templateUrl: './company.component.html',
  styleUrls: ['./company.component.scss'],
})
export class CompanyComponent implements AfterViewInit {
  company: Company = {
    registrationNumber: '',
    name: '',
    email: '',
    phone: '',
    address: '',
    address2: '',
    zipCode: '',
    city: '',
  };
  isSaving$ = new Subject<boolean>();

  constructor(
    private companyService: CompanyService,
    private snackBar: MatSnackBar,
  ) {}

  ngAfterViewInit() {
    this.companyService.getCompany().subscribe({
      next: (company) => {
        if (company) {
          this.company = company;
        }
      },
    });
  }

  save() {
    this.isSaving$.next(true);
    this.companyService.save(this.company).subscribe({
      next: (newCompany) => {
        this.company = newCompany;
        this.snackBar.openFromComponent(SaveSuccessSnackbarComponent, {
          horizontalPosition: 'end',
          duration: 4000
        })
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

import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-retrieve-error-snackbar',
  standalone: true,
  imports: [CommonModule, MatIconModule],
  templateUrl: './retrieve-error-snackbar.component.html',
  styleUrls: ['./retrieve-error-snackbar.component.scss']
})
export class RetrieveErrorSnackbarComponent {

}

import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-delete-error-snackbar',
  standalone: true,
  imports: [CommonModule, MatIconModule],
  templateUrl: './delete-error-snackbar.component.html',
  styleUrls: ['./delete-error-snackbar.component.scss']
})
export class DeleteErrorSnackbarComponent {

}

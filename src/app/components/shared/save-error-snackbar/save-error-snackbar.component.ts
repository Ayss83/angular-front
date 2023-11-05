import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-save-error-snackbar',
  standalone: true,
  imports: [CommonModule, MatIconModule],
  templateUrl: './save-error-snackbar.component.html',
  styleUrls: ['./save-error-snackbar.component.scss']
})
export class SaveErrorSnackbarComponent {

}

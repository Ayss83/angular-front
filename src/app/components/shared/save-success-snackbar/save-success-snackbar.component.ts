import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-save-success-snackbar',
  standalone: true,
  imports: [CommonModule, MatIconModule],
  templateUrl: './save-success-snackbar.component.html',
  styleUrls: ['./save-success-snackbar.component.scss']
})
export class SaveSuccessSnackbarComponent {

}

import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { appColors } from 'src/app/constants';
import { SectionInfo } from 'src/app/models/home-communicator.models';
import { HomeCommunicatorService } from 'src/app/services/home-communicator.service';

@Component({
  selector: 'app-home-menu',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './home-menu.component.html',
  styleUrls: ['./home-menu.component.scss'],
})
export class HomeMenuComponent {
  sectionName = '';
  appColors = appColors;

  constructor(private communicatorService: HomeCommunicatorService) {}

  setSection(sectionInfo: SectionInfo) {
    this.communicatorService.onSectionChange(sectionInfo);
  }
}

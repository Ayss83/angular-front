import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeCommunicatorService } from '../services/home-communicator.service';
import { RouterModule } from '@angular/router';
import { SectionInfo } from '../models/home-communicator.models';
import { appColors } from '../constants';

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

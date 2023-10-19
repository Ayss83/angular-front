import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HomeMenuComponent } from './home-menu.component';
import { RouterTestingModule } from '@angular/router/testing';
import { SectionInfo } from '../models/home-communicator.models';

describe('HomeMenuComponent', () => {
  let component: HomeMenuComponent;
  let fixture: ComponentFixture<HomeMenuComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HomeMenuComponent, RouterTestingModule],
    });
    fixture = TestBed.createComponent(HomeMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('setSection', () => {
    it('should signal section change with HomeCommunicatorService', () => {
      const spy = spyOn(component['communicatorService'], 'onSectionChange');
      const mockSectionInfo = {} as SectionInfo;

      component.setSection(mockSectionInfo);

      expect(spy).toHaveBeenCalledWith(mockSectionInfo);
    });
  });
});

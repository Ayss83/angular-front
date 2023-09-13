import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HomeComponent } from './home.component';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { HomeCommunicatorService } from '../services/home-communicator.service';

describe('HomeComponent', () => {
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;
  let router: Router;
  let communicationService: HomeCommunicatorService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HomeComponent, RouterTestingModule],
    });
    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;
    router = fixture.debugElement.injector.get(Router);
    communicationService = fixture.debugElement.injector.get(HomeCommunicatorService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('logout', () => {
    it('should remove token from localStorage', () => {
      spyOn(window.localStorage, 'removeItem');

      component.logout();

      expect(window.localStorage.removeItem).toHaveBeenCalledWith('token');
    });

    it('should navigate to login page', () => {
      spyOn(router, 'navigate');

      component.logout();

      expect(router.navigate).toHaveBeenCalledWith(['/']);
    });
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HomeComponent } from './home.component';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { HomeCommunicatorService } from '../services/home-communicator.service';
import { appColors } from '../constants';

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
    communicationService = fixture.debugElement.injector.get(
      HomeCommunicatorService
    );
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

  describe('setHeader', () => {
    it('should set invoice header', () => {
      component['router'] = { url: 'https://www.site.com/invoices' } as Router;

      component.setHeader();

      expect(component.title).toBe('Invoices');
      expect(component.menuColor).toBe(appColors.yellow);
    });

    it('should set product header', () => {
      component['router'] = {
        url: 'https://www.site.com/products',
      } as Router;

      component.setHeader();

      expect(component.title).toBe('Products');
      expect(component.menuColor).toBe(appColors.red);
    });

    it('should set customer header', () => {
      component['router'] = {
        url: 'https://www.site.com/customers/edit',
      } as Router;

      component.setHeader();

      expect(component.title).toBe('Customers');
      expect(component.menuColor).toBe(appColors.orange);
    });

    it('should set company header', () => {
      component['router'] = {
        url: 'https://www.site.com/company',
      } as Router;

      component.setHeader();

      expect(component.title).toBe('Company');
      expect(component.menuColor).toBe(appColors.gray);
    });

    it('should set neutral header', () => {
      component['router'] = {
        url: 'https://www.site.com/anything',
      } as Router;

      component.setHeader();

      expect(component.title).toBe('');
      expect(component.menuColor).toBe('transparent');
    });
  });
});

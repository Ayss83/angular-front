import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HomeMenuComponent } from './home-menu.component';
import { RouterTestingModule } from '@angular/router/testing';

describe('HomeMenuComponent', () => {
  let component: HomeMenuComponent;
  let fixture: ComponentFixture<HomeMenuComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HomeMenuComponent, RouterTestingModule]
    });
    fixture = TestBed.createComponent(HomeMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

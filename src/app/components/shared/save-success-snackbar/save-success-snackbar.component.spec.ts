import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SaveSuccessSnackbarComponent } from './save-success-snackbar.component';

describe('SaveSuccessSnackbarComponent', () => {
  let component: SaveSuccessSnackbarComponent;
  let fixture: ComponentFixture<SaveSuccessSnackbarComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [SaveSuccessSnackbarComponent]
    });
    fixture = TestBed.createComponent(SaveSuccessSnackbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

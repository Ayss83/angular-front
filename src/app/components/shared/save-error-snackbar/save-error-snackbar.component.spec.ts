import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SaveErrorSnackbarComponent } from './save-error-snackbar.component';

describe('SaveErrorSnackbarComponent', () => {
  let component: SaveErrorSnackbarComponent;
  let fixture: ComponentFixture<SaveErrorSnackbarComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [SaveErrorSnackbarComponent]
    });
    fixture = TestBed.createComponent(SaveErrorSnackbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

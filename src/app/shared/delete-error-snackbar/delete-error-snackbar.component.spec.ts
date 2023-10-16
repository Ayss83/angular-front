import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteErrorSnackbarComponent } from './delete-error-snackbar.component';

describe('DeleteErrorSnackbarComponent', () => {
  let component: DeleteErrorSnackbarComponent;
  let fixture: ComponentFixture<DeleteErrorSnackbarComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [DeleteErrorSnackbarComponent]
    });
    fixture = TestBed.createComponent(DeleteErrorSnackbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RetrieveErrorSnackbarComponent } from './retrieve-error-snackbar.component';

describe('RetrieveErrorSnackbarComponent', () => {
  let component: RetrieveErrorSnackbarComponent;
  let fixture: ComponentFixture<RetrieveErrorSnackbarComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RetrieveErrorSnackbarComponent]
    });
    fixture = TestBed.createComponent(RetrieveErrorSnackbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InvoiceEditComponent } from './invoice-edit.component';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { FilterableSearchComponent } from 'src/app/shared/filterable-search/filterable-search.component';

describe('InvoiceEditComponent', () => {
  let component: InvoiceEditComponent;
  let fixture: ComponentFixture<InvoiceEditComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        InvoiceEditComponent,
        RouterTestingModule,
        HttpClientTestingModule,
        MatDatepickerModule,
        MatNativeDateModule,
        NoopAnimationsModule,
        FilterableSearchComponent
      ],
    });
    fixture = TestBed.createComponent(InvoiceEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

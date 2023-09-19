import { TestBed } from '@angular/core/testing';

import { InvoiceService } from './invoice.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('InvoiceService', () => {
  let service: InvoiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({ imports: [HttpClientTestingModule] });
    service = TestBed.inject(InvoiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

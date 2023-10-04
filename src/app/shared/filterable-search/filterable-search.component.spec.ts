import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FilterableSearchComponent } from './filterable-search.component';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

describe('FilterableSearchComponent', () => {
  let component: FilterableSearchComponent<any>;
  let fixture: ComponentFixture<FilterableSearchComponent<any>>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [FilterableSearchComponent, NoopAnimationsModule]
    });
    fixture = TestBed.createComponent(FilterableSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

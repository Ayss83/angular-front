import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FilterableSearchComponent } from './filterable-search.component';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

describe('FilterableSearchComponent', () => {
  let component: FilterableSearchComponent<any>;
  let fixture: ComponentFixture<FilterableSearchComponent<any>>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [FilterableSearchComponent, NoopAnimationsModule],
    });
    fixture = TestBed.createComponent(FilterableSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('isProduct', () => {
    it('should return true', () => {
      expect(
        component.isProduct({ reference: 'test', name: 'test' })
      ).toBeTrue();
    });

    it('should return false', () => {
      expect(
        component.isProduct({ name: 'test', description: 'test' })
      ).toBeFalse();
    });
  });

  describe('isCustomer', () => {
    it('should return true', () => {
      expect(
        component.isCustomer({
          firstName: 'test',
          phone: 'test',
          lastName: 'test',
          email: 'test',
        })
      ).toBeTrue();
    });

    it('should return false', () => {
      expect(
        component.isCustomer({
          firstName: 'test',
          address: { address: '' },
          email: 'test',
        })
      ).toBeFalse();
    });
  });

  describe('filterElements', () => {
    it('should set filteredElements with complete list', () => {
      component.elements = [{}, {}, {}, {}, {}];
      component.filteredElements = [];

      component.filterElements('');

      expect(component.filteredElements.length).toBe(component.elements.length);
    });

    it('should set filteredElements with right content (single element)', () => {
      component.elements = [
        { name: 'test1' },
        { anything: 'test2' },
        { other: 'sample', lastName: 'Smith' },
        { _id: 'test3' },
      ];
      component.filteredElements = [];

      component.filterElements('test1');

      expect(component.filteredElements.length).toBe(1);
    });

    it('should set filteredElements with right content (multiple elements)', () => {
      component.elements = [
        { name: 'test1' },
        { anything: 'test2' },
        { other: 'sample', lastName: 'Smith' },
        { _id: 'test3' },
      ];
      component.filteredElements = [];

      component.filterElements('test');

      expect(component.filteredElements.length).toBe(2);
    });
  });

  describe('stringifyElement', () => {
    it('should return expected string', () => {
      const mockElement = {
        test: 'test 1',
        name: 'Test2',
        address: { address: 'Test Address', city: 'test city' },
        _id: 'test-id',
        other: 'TEST 3',
        ownerId: 'owner-id',
      };
      const expectedString = 'test 1 test2 test address test city test 3';

      expect(component.stringifyElement(mockElement)).toBe(expectedString);
    });
  });
});

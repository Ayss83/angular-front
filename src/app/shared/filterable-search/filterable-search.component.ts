import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';
import { Customer } from 'src/app/models/customer.models';
import { Product } from 'src/app/models/product.models';

@Component({
  selector: 'app-filterable-search',
  standalone: true,
  imports: [
    CommonModule,
    MatSelectModule,
    NgxMatSelectSearchModule,
    FormsModule,
  ],
  templateUrl: './filterable-search.component.html',
  styleUrls: ['./filterable-search.component.scss'],
})
export class FilterableSearchComponent<T> {
  @Input() elements: T[] = [];
  @Input() label: string = '';
  @Output() selectionChange = new EventEmitter<T>();
  filteredElements: T[] = [];

  ngOnChanges() {
    this.filteredElements = this.elements.slice();
  }

  /**
   * Checks if element received as parameter is of type Product. If so, enforces its type in
   * protected code block
   *
   * @param element object to test
   * @returns narrowed type of element
   */
  isProduct(element: any): element is Product {
    return Object.hasOwn(element, 'reference');
  }

  /**
   * Checks if element received as parameter is of type Customer. If so, enforces its type in
   * protected code block
   * 
   * @param element object to test
   * @returns narrowed type of element
   */
  isCustomer(element: any): element is Customer {
    return Object.hasOwn(element, 'lastName');
  }

  /**
   * Sets filteredElements property to contain only elements matching received search
   *
   * @param search search string
   */
  filterElements(search: string) {
    if (!search) {
      this.filteredElements = this.elements.slice();
    } else {
      this.filteredElements = this.elements.filter((element) =>
        this.stringifyElement(element).includes(search.toLowerCase())
      );
    }
  }

  /**
   * Stringify the element received as parameter. If stringElement is passed, it will serve as
   * concatenation base. Recursively processes nested object properties.
   *
   * @param element object to stringify
   * @param stringElement starting point for stringified object
   * @returns stringified element
   */
  stringifyElement(element: any, stringElement = '') {
    for (const key in element) {
      if (key !== '_id' && key !== 'ownerId') {
        if (typeof (element as any)[key] !== 'object') {
          stringElement += ' ' + (element as any)[key].toString().toLowerCase();
        } else {
          stringElement +=
            ' ' + this.stringifyElement(element[key], stringElement);
        }
      }
    }

    return stringElement;
  }
}

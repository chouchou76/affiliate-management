import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { FieldFilter } from '../models/filter.model';

@Injectable({ providedIn: 'root' })
export class FilterService {

  private filtersSubject = new BehaviorSubject<FieldFilter[]>([]);
  filters$ = this.filtersSubject.asObservable();

  setFilters(filters: FieldFilter[] | null) {
    this.filtersSubject.next(filters ?? []);
  }

  add(filter: FieldFilter) {
    this.filtersSubject.next([
      ...this.filtersSubject.value,
      filter
    ]);
  }

  update(index: number, filter: FieldFilter) {
    const next = [...this.filtersSubject.value];
    next[index] = filter;
    this.filtersSubject.next(next);
  }

  remove(index: number) {
    this.filtersSubject.next(
      this.filtersSubject.value.filter((_, i) => i !== index)
    );
  }

  clear() {
    this.filtersSubject.next([]);
  }
}

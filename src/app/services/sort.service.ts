import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { SortConfig } from '../models/filter.model';

@Injectable({ providedIn: 'root' })
export class SortService {

  private sortSubject = new BehaviorSubject<SortConfig | null>(null);
  sort$ = this.sortSubject.asObservable();

  set(sort: SortConfig) {
    this.sortSubject.next(sort);
  }

  clear() {
    this.sortSubject.next(null);
  }
}

import { Component, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Observable, BehaviorSubject, combineLatest, map, tap } from 'rxjs';

import { KocService } from '../services/koc.service';
import { KocData } from '../models/koc.model';
import { AddKocComponent } from '../add-koc/add-koc.component';
import { FormsModule } from '@angular/forms';
import { FieldFilter, SortConfig } from '../models/filter.model';
import { FilterBuilderComponent } from '../filter-builder/filter-builder.component';
import { FilterService } from '../services/filter.service';
import { SortService } from '../services/sort.service';
import { SortBuilderComponent } from '../sort-builder/sort-builder.component';


@Component({
  selector: 'app-koc-list',
  standalone: true,
  imports: [CommonModule, AddKocComponent, FormsModule, FilterBuilderComponent, SortBuilderComponent],
  templateUrl: './koc-list.component.html',
  styleUrls: ['./koc-list.component.css'],
})
export class KocListComponent {

  // @ViewChild(AddKocComponent) addKocPopup!: AddKocComponent;

  @ViewChild('addKoc') addKoc!: AddKocComponent;

  showFilter = false;
  filters: FieldFilter[] = [];
  showSort = false;
  isSortOpen = false;
  sort: SortConfig | null = null;

  /** ===== STREAM ===== */
  private search$ = new BehaviorSubject<string>('');
  private filters$ = new BehaviorSubject<FieldFilter[]>([]);
  private sort$ = new BehaviorSubject<SortConfig | null>(null);

  kocList$!: Observable<KocData[]>;

  /** UI state */
  selectAll = false;
  searchText = '';

  constructor(
    private kocService: KocService,
    private filterService: FilterService,
    private sortService: SortService
  ) {
    this.initStream();
  }

  /** =========================
   *  INIT STREAM (REALTIME + SEARCH)
   *  ========================= */
  // private initStream() {
  //   this.kocList$ = combineLatest([
  //     this.kocService.getKocs(),
  //     this.search$
  //   ]).pipe(
  //     map(([list, search]) => {
  //       const keyword = search.toLowerCase().trim();

  //       let normalized = list.map(item => ({
  //         ...item,
  //         labels: item.labels ?? [],
  //         products: item.products ?? [],
  //         linkChannel:
  //           item.linkChannel || `https://www.tiktok.com/@${item.channelName}`,
  //         isDuplicate: false,
  //         selected: item.selected ?? false
  //       }));

  //       normalized = this.markDuplicates(normalized);

  //       // 🔍 SEARCH
  //       if (keyword) {
  //         normalized = normalized.filter(item =>
  //           item.channelName.toLowerCase().includes(keyword) ||
  //           item.staff?.toLowerCase().includes(keyword) ||
  //           item.manager?.toLowerCase().includes(keyword)
  //         );
  //       }

  //       return normalized;
  //     }),
  //     tap(list => {
  //       this.selectAll = list.length > 0 && list.every(i => i.selected);
  //     })
  //   );
  // }
  private initStream() {
  this.kocList$ = combineLatest([
    this.kocService.getKocs(),
    this.search$,
    this.filterService.filters$,
    this.sortService.sort$
  ]).pipe(
    map(([list, search, filters, sort]) => {
      let result = list.map(item => ({
        ...item,
        labels: item.labels ?? [],
        products: item.products ?? [],
        selected: item.selected ?? false,
        linkChannel:
          item.linkChannel || `https://www.tiktok.com/@${item.channelName}`
      }));

      result = this.markDuplicates(result);

      // 🔍 SEARCH (global)
      if (search) {
        const keyword = search.toLowerCase();
        result = result.filter(item =>
          Object.values(item).some(v =>
            String(v ?? '').toLowerCase().includes(keyword)
          )
        );
      }

      // 🎯 FILTER
      filters.forEach(f => {
        result = result.filter(item =>
          this.applyFilter(item[f.field], f)
        );
      });

      // ↕️ SORT
      if (sort) {
        result = [...result].sort((a, b) => {
          const v1 = a[sort.field];
          const v2 = b[sort.field];
          if (v1 == null) return 1;
          if (v2 == null) return -1;
          return sort.direction === 'asc'
            ? v1 > v2 ? 1 : -1
            : v1 < v2 ? 1 : -1;
        });
      }

      return result;
    }),
    tap(list => {
      this.selectAll = list.length > 0 && list.every(i => i.selected);
    })
  );
}


  /** =========================
   *  SEARCH
   *  ========================= */
  ngOnChanges() {
    this.search$.next(this.searchText);
  }

  onSearchChange(value: string) {
    this.search$.next(value);
  }

  /** =========================
   *  BULK SELECT
   *  ========================= */
  toggleSelectAll(list: KocData[]) {
    this.selectAll = !this.selectAll;
    list.forEach(item => (item.selected = this.selectAll));
  }

  toggleRow(item: KocData, list: KocData[]) {
    item.selected = !item.selected;
    this.selectAll = list.every(i => i.selected);
  }

  private getSelected(list: KocData[]): KocData[] {
    return list.filter(i => i.selected);
  }

  /** =========================
   *  BULK CRAWL
   *  ========================= */
  bulkCrawl(list: KocData[]) {
    const targets = list.filter(k => k.selected && k.videoLink);

    if (!targets.length) {
      alert('Vui lòng chọn ít nhất 1 KOC có link video');
      return;
    }

    let hasError = false;

    this.kocService.bulkCrawl(targets).subscribe({
      next: result => {
        if (result.status === 'error') {
          hasError = true;
        }
      },
      complete: () => {
        if (hasError) {
          alert('⚠️ Bulk crawl hoàn tất nhưng có KOC bị lỗi');
        } else {
          alert('✅ Bulk crawl hoàn tất');
        }
      }
    });
  }

  edit(item: KocData) {
    this.addKoc.openPopup(item);
  }

  remove(item: KocData) {
    if (!item.id) return;
    if (confirm('Bạn chắc chắn muốn xóa KOC này?')) {
      this.kocService.deleteKoc(item.id);
    }
  }

  onSaved() {
    // realtime Firestore → auto update
  }

  /** =========================
   *  DUPLICATE CHECK
   *  ========================= */
  private markDuplicates(list: KocData[]): KocData[] {
    const map = new Map<string, number>();

    list.forEach(i =>
      map.set(i.channelName, (map.get(i.channelName) || 0) + 1)
    );

    return list.map(i => ({
      ...i,
      isDuplicate: (map.get(i.channelName) || 0) > 1
    }));
  }

  private applyTextFilter(value: any, filter: FieldFilter): boolean {
    const v = String(value ?? '').toLowerCase();

    switch (filter.operator) {
      case 'eq': return v === String(filter.value).toLowerCase();
      case 'contains': return v.includes(String(filter.value).toLowerCase());
      case 'not_contains': return !v.includes(String(filter.value).toLowerCase());
      case 'empty': return !v;
      case 'not_empty': return !!v;
      default: return true;
    }
  }

  private applyDateFilter(value: any, filter: FieldFilter): boolean {
    if (!value) {
      return filter.operator === 'empty';
    }

    const date = new Date(value);
    const today = new Date();

    const startOfWeek = (d: Date) => {
      const t = new Date(d);
      t.setDate(t.getDate() - t.getDay());
      return t;
    };

    switch (filter.operator) {
      case 'eq':
        return date.toDateString() === new Date(filter.value).toDateString();

      case 'before':
        return date < new Date(filter.value);

      case 'after':
        return date > new Date(filter.value);

      case 'empty':
        return !value;

      case 'not_empty':
        return !!value;

      case 'today':
        return date.toDateString() === today.toDateString();

      case 'this_week':
        return date >= startOfWeek(today);

      case 'last_week': {
        const lastWeek = startOfWeek(today);
        lastWeek.setDate(lastWeek.getDate() - 7);
        return date >= lastWeek && date < startOfWeek(today);
      }

      case 'next_week': {
        const nextWeek = startOfWeek(today);
        nextWeek.setDate(nextWeek.getDate() + 7);
        return date >= nextWeek;
      }

      case 'this_month':
        return date.getMonth() === today.getMonth()
          && date.getFullYear() === today.getFullYear();

      case 'last_month': {
        const m = today.getMonth() - 1;
        return date.getMonth() === m;
      }

      case 'next_month': {
        const m = today.getMonth() + 1;
        return date.getMonth() === m;
      }

      default:
        return true;
    }
  }

  private applyFilter(value: any, filter: FieldFilter): boolean {
    if (value instanceof Date || !isNaN(Date.parse(value))) {
      return this.applyDateFilter(value, filter);
    }
    return this.applyTextFilter(value, filter);
  }

  openSort() {
    console.log('open sort popup');
    this.isSortOpen = true;
  }
  closeSort() {
    this.isSortOpen = false;
  }

  openFilter() {
    this.showFilter = !this.showFilter;
  }

  onFiltersChange(filters: FieldFilter[]) {
    this.filters = filters;
    this.filters$.next(filters);
  }

  private applySort(list: any[], sort: SortConfig) {
    const dir = sort.direction === 'asc' ? 1 : -1;

    return [...list].sort((a, b) => {
      const v1 = a[sort.field];
      const v2 = b[sort.field];

      if (v1 == null) return 1;
      if (v2 == null) return -1;

      switch (sort.type) {
        case 'text':
          return v1.toString()
            .localeCompare(v2.toString(), 'vi', { sensitivity: 'base' }) * dir;

        case 'number':
          return (Number(v1) - Number(v2)) * dir;

        case 'date':
          return (new Date(v1).getTime() - new Date(v2).getTime()) * dir;

        default:
          return 0;
      }
    });
  }

  onSortChange(sort: SortConfig | null) {
    this.sort = sort;
    this.sort$.next(sort);
  }

  toggleFilter() {
    this.showFilter = !this.showFilter;
    if (this.showFilter) {
      this.isSortOpen = false; // đóng sort nếu mở filter
    }
  }

  toggleSort() {
    this.isSortOpen = !this.isSortOpen;
    if (this.isSortOpen) {
      this.showFilter = false; // đóng filter nếu mở sort
    }
  }
}

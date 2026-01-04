// import { Component, ViewChild, HostListener, OnInit } from '@angular/core';
// import { CommonModule } from '@angular/common';
// import { Observable, BehaviorSubject, combineLatest, map, tap } from 'rxjs';
// import { RouterLink, RouterLinkActive } from '@angular/router';
// import { getDocs, collection } from 'firebase/firestore';
// import { firstValueFrom } from 'rxjs';

// import { KocService } from '../services/koc.service';
// import { KocData } from '../models/koc.model';
// import { AddKocComponent } from '../add-koc/add-koc.component';
// import { FormsModule } from '@angular/forms';
// import { FieldFilter } from '../models/filter.model';
// import { FilterBuilderComponent } from '../filter-builder/filter-builder.component';
// import { FilterService } from '../services/filter.service';
// import { SortService } from '../services/sort.service';
// import { SortBuilderComponent, SortRule } from '../sort-builder/sort-builder.component';
// import { parseDDMMYYYY } from '../utils/date.util';
// import * as XLSX from 'xlsx';
// import { cleanupInvalidKocs } from '../scripts/cleanup-invalid-koc';
// import { TikTokApiService } from '../services/tiktok-api.service';
// import { ChangeDetectionStrategy } from '@angular/core';


// @Component({
//   selector: 'app-koc-list',
//   standalone: true,
//   imports: [CommonModule, AddKocComponent, FormsModule, FilterBuilderComponent, SortBuilderComponent, RouterLink, RouterLinkActive],
//   changeDetection: ChangeDetectionStrategy.OnPush,
//   templateUrl: './koc-list.component.html',
//   styleUrls: ['./koc-list.component.css'],
// })
// export class KocListComponent {

//   @ViewChild('addKoc') addKoc!: AddKocComponent;

//   showFilter = false;
//   filters: FieldFilter[] = [];
//   showSort = false;
//   isSortOpen = false;
 
//   currentSorts: SortRule[] = [];
//   currentFilters: FieldFilter[] = [];


//   /** ===== STREAM ===== */
//   private search$ = new BehaviorSubject<string>('');
//   private filters$ = new BehaviorSubject<FieldFilter[]>([]);
//   private sort$ = new BehaviorSubject<SortRule[] | null>(null);

//   kocList$!: Observable<KocData[]>;

//   /** UI state */
//   selectAll = false;
//   searchText = '';
  

//   constructor(
//     private kocService: KocService,
//     private filterService: FilterService,
//     private tiktokApi: TikTokApiService
//     // private sortService: SortService
//   ) {
//     this.initStream();
//   }

 
//   private initStream() {
//     this.kocList$ = combineLatest([
//       this.kocService.getKocs(),
//       this.search$,
//       this.filterService.filters$,
//       this.sort$
//     ]).pipe(
//       map(([list, search, filters, sorts]) => {
//         let result = list.map(k => ({
//           ...k,
//           labels: k.labels ?? [],
//           products: k.products ?? [],
//           selected: !!k.selected,
//           linkChannel: k.linkChannel || `https://www.tiktok.com/@${k.channelName}`
//         }));

//         result = this.markDuplicates(result);

//         /** SEARCH */
//         if (search.trim()) {
//           const keyword = search.toLowerCase();
//           result = result.filter(k =>
//             Object.values(k).some(v =>
//               String(v ?? '').toLowerCase().includes(keyword)
//             )
//           );
//         }

//         /** FILTER */
//         filters.forEach(f => {
//           result = result.filter(k => this.applyFilter((k as any)[f.field], f));
//         });

//         /** SORT */
//         if (sorts?.length) {
//           result = [...result].sort((a, b) => {
//             for (const rule of sorts) {
//               const v1 = (a as any)[rule.field];
//               const v2 = (b as any)[rule.field];
//               if (v1 == null && v2 == null) continue;
//               if (v1 == null) return rule.direction === 'asc' ? 1 : -1;
//               if (v2 == null) return rule.direction === 'asc' ? -1 : 1;

//               let cmp = 0;
//               if (rule.type === 'text') {
//                 cmp = String(v1).localeCompare(String(v2), 'vi', { sensitivity: 'base' });
//               }
//               if (rule.type === 'number') {
//                 cmp = Number(v1) - Number(v2);
//               }
//               if (rule.type === 'date') {
//                 cmp = new Date(v1).getTime() - new Date(v2).getTime();
//               }

//               if (cmp !== 0) {
//                 return rule.direction === 'asc' ? cmp : -cmp;
//               }
//             }
//             return 0;
//           });
//         }

//         return result;
//       }),
//       tap(list => {
//         this.selectAll = list.length > 0 && list.every(i => i.selected);
//       })
//     );
//   }


//   /** =========================
//    *  SEARCH
//    *  ========================= */
//   // ngOnChanges() {
//   //   this.search$.next(this.searchText);
//   // }

//   onSearchChange(value: string) {
//     this.search$.next(value);
//   }

//   /** =========================
//    *  BULK SELECT
//    *  ========================= */
//   toggleSelectAll(list: KocData[]) {
//     this.selectAll = !this.selectAll;
//     list.forEach(k => (k.selected = this.selectAll));
//   }

//   toggleRow(k: KocData, list: KocData[]) {
//     k.selected = !k.selected;
//     this.selectAll = list.every(i => i.selected);
//   }

//   private getSelected(list: KocData[]): KocData[] {
//     return list.filter(i => i.selected);
//   }

//   /** =========================
//    *  BULK CRAWL
//    *  ========================= */
//   // bulkCrawl(list: KocData[]) {
//   //   const targets = list.filter(k => k.selected && typeof k.videoLink === 'string');

//   //   if (!targets.length) {
//   //     alert('Vui lòng chọn ít nhất 1 KOC có link video');
//   //     return;
//   //   }

//   //   let hasError = false;

//   //   this.kocService.bulkCrawl(targets).subscribe({
//   //     next: result => {
//   //       if (result.status === 'error') {
//   //         hasError = true;
//   //       }
//   //     },
//   //     complete: () => {
//   //       if (hasError) {
//   //         alert('⚠️ Bulk crawl hoàn tất nhưng có KOC bị lỗi');
//   //       } else {
//   //         alert('✅ Bulk crawl hoàn tất');
//   //       }
//   //     }
//   //   });
//   // }
// //   bulkCrawl(list: KocData[]) {
// //   const targets = list.filter(
// //     k => k.selected && typeof k.videoLink === 'string'
// //   );

// //   if (!targets.length) {
// //     alert('Vui lòng chọn ít nhất 1 KOC có link video');
// //     return;
// //   }

// //   this.kocService.bulkCrawl(targets).subscribe({
// //     complete: () => alert('✅ Bulk crawl hoàn tất')
// //   });
// // }

//   async bulkCrawl(list: KocData[]) {
//     const targets = list.filter(
//       k => k.selected && typeof k.videoLink === 'string' && k.videoLink.startsWith('http')
//     );

//     if (!targets.length) {
//       alert('⚠️ Không có KOC hợp lệ để crawl');
//       return;
//     }

//     for (let i = 0; i < targets.length; i++) {
//       const koc = targets[i];
//       try {
//         console.log(`▶ Crawl ${i + 1}/${targets.length}`, koc.videoLink);
//         await this.kocService.crawlOneAsync(koc);
//         koc.crawlStatus = 'success';
//       } catch (e) {
//         console.error('❌ Crawl lỗi', koc.videoLink, e);
//         koc.crawlStatus = 'error';
//       }
//       await new Promise(r => setTimeout(r, 1500));
//     }

//     alert('✅ Bulk crawl hoàn tất');
//   }

//   edit(item: KocData) {
//     this.addKoc.openPopup(item);
//   }

//   remove(item: KocData) {
//     if (!item.id) return;
//     if (confirm('Bạn chắc chắn muốn xóa KOC này?')) {
//       this.kocService.deleteKoc(item.id);
//     }
//   }

//   onSaved() {
//     // realtime Firestore → auto update
//   }

//   /** =========================
//    *  DUPLICATE CHECK
//    *  ========================= */
//   private markDuplicates(list: KocData[]): KocData[] {
//     const map = new Map<string, number>();

//     list.forEach(i =>
//       map.set(i.channelName, (map.get(i.channelName) || 0) + 1)
//     );

//     return list.map(i => ({
//       ...i,
//       isDuplicate: (map.get(i.channelName) || 0) > 1
//     }));
//   }

//   private applyTextFilter(value: any, filter: FieldFilter): boolean {
//     const v = String(value ?? '').toLowerCase();

//     switch (filter.operator) {
//       case 'eq': return v === String(filter.value).toLowerCase();
//       case 'contains': return v.includes(String(filter.value).toLowerCase());
//       case 'not_contains': return !v.includes(String(filter.value).toLowerCase());
//       case 'empty': return !v;
//       case 'not_empty': return !!v;
//       default: return true;
//     }
//   }

//   private applyDateFilter(value: any, filter: FieldFilter): boolean {
//     if (!value) {
//       return filter.operator === 'empty';
//     }

//     const date = new Date(value);
//     const today = new Date();

//     const startOfWeek = (d: Date) => {
//       const t = new Date(d);
//       t.setDate(t.getDate() - t.getDay());
//       return t;
//     };

//     switch (filter.operator) {
//       case 'eq':
//         return date.toDateString() === new Date(filter.value).toDateString();

//       case 'before':
//         return date < new Date(filter.value);

//       case 'after':
//         return date > new Date(filter.value);

//       case 'empty':
//         return !value;

//       case 'not_empty':
//         return !!value;

//       case 'today':
//         return date.toDateString() === today.toDateString();

//       case 'this_week':
//         return date >= startOfWeek(today);

//       case 'last_week': {
//         const lastWeek = startOfWeek(today);
//         lastWeek.setDate(lastWeek.getDate() - 7);
//         return date >= lastWeek && date < startOfWeek(today);
//       }

//       case 'next_week': {
//         const nextWeek = startOfWeek(today);
//         nextWeek.setDate(nextWeek.getDate() + 7);
//         return date >= nextWeek;
//       }

//       case 'this_month':
//         return date.getMonth() === today.getMonth()
//           && date.getFullYear() === today.getFullYear();

//       case 'last_month': {
//         const m = today.getMonth() - 1;
//         return date.getMonth() === m;
//       }

//       case 'next_month': {
//         const m = today.getMonth() + 1;
//         return date.getMonth() === m;
//       }

//       default:
//         return true;
//     }
//   }

//   private applyFilter(value: any, filter: FieldFilter): boolean {
//     if (value instanceof Date || !isNaN(Date.parse(value))) {
//       return this.applyDateFilter(value, filter);
//     }
//     return this.applyTextFilter(value, filter);
//   }

//   openSort() {
//     console.log('open sort popup');
//     this.isSortOpen = true;
//   }
//   closeSort() {
//     this.isSortOpen = false;
//   }

//   openFilter() {
//     this.showFilter = !this.showFilter;
//   }

//   onFiltersChange(filters: FieldFilter[] | null) {
//     this.filters = filters ?? [];
//     this.filterService.setFilters(this.filters);
//   }

//     toggleFilter() {
//     this.showFilter = !this.showFilter;
//     if (this.showFilter) {
//       this.isSortOpen = false; // đóng sort nếu mở filter
//     }
//   }

//   toggleSort() {
//     this.isSortOpen = !this.isSortOpen;
//     if (this.isSortOpen) {
//       this.showFilter = false; // đóng filter nếu mở sort
//     }
//   }

//   getTagColor(text: string): string {
//     const colors = [
//       '#1abc9c', '#3498db', '#9b59b6',
//       '#e67e22', '#2ecc71',
//       '#f39c12', '#16a085'
//     ];

//     let hash = 0;
//     for (let i = 0; i < text.length; i++) {
//       hash = text.charCodeAt(i) + ((hash << 5) - hash);
//     }
//     return colors[Math.abs(hash) % colors.length];
//   }

//   // Resize logic
//   private resizingColumn: HTMLElement | null = null;
//   private startX = 0;
//   private startWidth = 0;

//   startResize(event: MouseEvent) {
//     event.preventDefault();
//     event.stopPropagation();

//     const handle = event.target as HTMLElement;
//     const th = handle.closest('th');
//     if (!th) return;

//     this.resizingColumn = th as HTMLElement;
//     this.startX = event.clientX;
//     this.startWidth = this.resizingColumn.offsetWidth;

//     document.addEventListener('mousemove', this.onMouseMove);
//     document.addEventListener('mouseup', this.stopResize);
//   }

//   @HostListener('document:mousemove', ['$event'])
//   onMouseMove = (event: MouseEvent) => {
//     if (!this.resizingColumn) return;

//     const delta = event.clientX - this.startX;
//     const newWidth = Math.max(50, this.startWidth + delta); // Min width 50px

//     this.resizingColumn.style.width = `${newWidth}px`;
//     this.resizingColumn.style.minWidth = `${newWidth}px`;

//     // Cập nhật left cho sticky columns nếu cần
//     this.updateStickyPositions();
//   }

//   @HostListener('document:mouseup')
//   stopResize = () => {
//     this.resizingColumn = null;
//     document.removeEventListener('mousemove', this.onMouseMove);
//     document.removeEventListener('mouseup', this.stopResize);
//   }

//   private updateStickyPositions() {
//     const ths = Array.from(document.querySelectorAll('.koc-table th'));
    
//     let left = 0;
//     ths.forEach((th: Element) => {
//       if (th.classList.contains('sticky-col')) {
//         (th as HTMLElement).style.left = `${left}px`;
//         left += (th as HTMLElement).offsetWidth;
//       }
//     });
//   }

//   showFullLink(link: string | undefined) {
//     if (link) {
//       alert(link);

//     }
//   }

//   onSortChange(sorts: SortRule[] | null) {
//     this.currentSorts = sorts ? [...sorts] : [];
//     this.sort$.next(sorts); 
//   }

  

// }

import { Component, ViewChild, HostListener, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Observable, BehaviorSubject, combineLatest, map, tap } from 'rxjs';
import { RouterLink, RouterLinkActive } from '@angular/router';

import { KocService } from '../services/koc.service';
import { KocData } from '../models/koc.model';
import { AddKocComponent } from '../add-koc/add-koc.component';
import { FormsModule } from '@angular/forms';
import { FieldFilter } from '../models/filter.model';
import { FilterBuilderComponent } from '../filter-builder/filter-builder.component';
import { FilterService } from '../services/filter.service';
import { SortService } from '../services/sort.service';
import { SortBuilderComponent, SortRule } from '../sort-builder/sort-builder.component';
import * as XLSX from 'xlsx';
import { cleanupInvalidKocs } from '../scripts/cleanup-invalid-koc';
import { parseDDMMYYYY } from '../utils/date.util';

@Component({
  selector: 'app-koc-list',
  standalone: true,
  imports: [CommonModule, AddKocComponent, FormsModule, FilterBuilderComponent, SortBuilderComponent, RouterLink, RouterLinkActive],
  templateUrl: './koc-list.component.html',
  styleUrls: ['./koc-list.component.css'],
})
export class KocListComponent {

  @ViewChild('addKoc') addKoc!: AddKocComponent;

  showFilter = false;
  filters: FieldFilter[] = [];
  showSort = false;
  isSortOpen = false;
 
  currentSorts: SortRule[] = [];
  currentFilters: FieldFilter[] = [];


  /** ===== STREAM ===== */
  private search$ = new BehaviorSubject<string>('');
  private filters$ = new BehaviorSubject<FieldFilter[]>([]);
  private sort$ = new BehaviorSubject<SortRule[] | null>(null);

  kocList$!: Observable<KocData[]>;

  /** UI state */
  selectAll = false;
  searchText = '';
  

  constructor(
    private kocService: KocService,
    private filterService: FilterService,
    // private sortService: SortService
  ) {
    this.initStream();
  }

 
  private initStream() {
  this.kocList$ = combineLatest([
    this.kocService.getKocs(),
    this.search$,
    this.filterService.filters$,
    this.sort$
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
      if (sort && sort.length > 0) {  // ← sort giờ là SortRule[] | null
  result = [...result].sort((a, b) => {
    for (const rule of sort) {  // ← duyệt mảng rules
      const v1 = (a as any)[rule.field];
      const v2 = (b as any)[rule.field];

      if (v1 == null && v2 == null) continue;
      if (v1 == null) return rule.direction === 'asc' ? 1 : -1;
      if (v2 == null) return rule.direction === 'asc' ? -1 : 1;

      let cmp = 0;
      switch (rule.type) {
        case 'text':
          cmp = String(v1).localeCompare(String(v2), 'vi', { sensitivity: 'base' });
          break;
        case 'number':
          cmp = Number(v1) - Number(v2);
          break;
        case 'date':
          cmp = new Date(v1).getTime() - new Date(v2).getTime();
          break;
      }

      if (cmp !== 0) {
        return rule.direction === 'asc' ? cmp : -cmp;
      }
    }
    return 0;
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

  onFiltersChange(filters: FieldFilter[] | null) {
    this.filters = filters ?? [];
    this.filterService.setFilters(this.filters);
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

  getTagColor(text: string): string {
    const colors = [
      '#1abc9c', '#3498db', '#9b59b6',
      '#e67e22', '#2ecc71',
      '#f39c12', '#16a085'
    ];

    let hash = 0;
    for (let i = 0; i < text.length; i++) {
      hash = text.charCodeAt(i) + ((hash << 5) - hash);
    }
    return colors[Math.abs(hash) % colors.length];
  }

  // Resize logic
  private resizingColumn: HTMLElement | null = null;
  private startX = 0;
  private startWidth = 0;

  startResize(event: MouseEvent) {
    event.preventDefault();
    event.stopPropagation();

    const handle = event.target as HTMLElement;
    const th = handle.closest('th');
    if (!th) return;

    this.resizingColumn = th as HTMLElement;
    this.startX = event.clientX;
    this.startWidth = this.resizingColumn.offsetWidth;

    document.addEventListener('mousemove', this.onMouseMove);
    document.addEventListener('mouseup', this.stopResize);
  }

  @HostListener('document:mousemove', ['$event'])
  onMouseMove = (event: MouseEvent) => {
    if (!this.resizingColumn) return;

    const delta = event.clientX - this.startX;
    const newWidth = Math.max(50, this.startWidth + delta); // Min width 50px

    this.resizingColumn.style.width = `${newWidth}px`;
    this.resizingColumn.style.minWidth = `${newWidth}px`;

    // Cập nhật left cho sticky columns nếu cần
    this.updateStickyPositions();
  }

  @HostListener('document:mouseup')
  stopResize = () => {
    this.resizingColumn = null;
    document.removeEventListener('mousemove', this.onMouseMove);
    document.removeEventListener('mouseup', this.stopResize);
  }

  private updateStickyPositions() {
    const ths = Array.from(document.querySelectorAll('.koc-table th'));
    
    let left = 0;
    ths.forEach((th: Element) => {
      if (th.classList.contains('sticky-col')) {
        (th as HTMLElement).style.left = `${left}px`;
        left += (th as HTMLElement).offsetWidth;
      }
    });
  }

  showFullLink(link: string | undefined) {
    if (link) {
      alert(link);

    }
  }

  onSortChange(sorts: SortRule[] | null) {
    this.currentSorts = sorts ? [...sorts] : [];
    this.sort$.next(sorts); // ← truyền thẳng, không cần kiểm tra length
  }

  onExcelUpload(event: Event) {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (!file) return;

    const reader = new FileReader();

    reader.onload = () => {
      const data = new Uint8Array(reader.result as ArrayBuffer);
      const workbook = XLSX.read(data, { type: 'array' });

      const sheet = workbook.Sheets[workbook.SheetNames[0]];
      const rows = XLSX.utils.sheet_to_json<any>(sheet);

      const kocs = rows.map(row => {
        const channelName =
          typeof row.channelName === 'string'
            ? row.channelName.trim()
            : null;

      const rawVideoLink =
        typeof row.videoLink === 'string'
          ? row.videoLink.trim()
          : null;

      const videoLink =
        rawVideoLink && rawVideoLink.startsWith('http')
          ? rawVideoLink
          : null;

        return {
          channelName,
          dateFound: parseDDMMYYYY(row.dateFound),
          labels: typeof row.label === 'string' ? row.label.split('|') : [],
          products: typeof row.product === 'string' ? row.product.split('|') : [],
          status: row.status ?? '',
          videoLink,
          linkChannel: channelName
            ? `https://www.tiktok.com/@${channelName}`
            : '',
          staff: 'Hà Châu',
          manager: 'Trưởng Team',
          isDuplicate: false,
          createdAt: new Date()
        };
      });

      // ✅ CHỈ upload dữ liệu đã clean
      const cleanKocs = cleanupInvalidKocs(kocs);
      this.bulkUploadExcel(cleanKocs);
    };

    reader.readAsArrayBuffer(file);
  }


  async bulkUploadExcel(kocs: any[]) {
    // 1️⃣ Lấy KOC hiện có (chỉ lấy channelName hợp lệ)
    const existing = new Set(
      (await this.kocService.getKocsSnapshot())
        .map(k => k.channelName)
        .filter((name): name is string => typeof name === 'string' && name.trim() !== '')
        .map(name => name.toLowerCase())
    );

    // 2️⃣ Lọc KOC Excel hợp lệ + chưa tồn tại
    const filtered = kocs.filter(k =>
      typeof k.channelName === 'string' &&
      k.channelName.trim() !== '' &&
      !existing.has(k.channelName.toLowerCase())
    );

    if (!filtered.length) {
      alert('⚠️ Không có KOC mới');
      return;
    }

    // 3️⃣ Upload
    await this.kocService.bulkAddExcel(filtered);
    alert(`✅ Upload ${filtered.length} KOC từ Excel`);
  }
}


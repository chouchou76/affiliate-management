import { Component, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Observable, BehaviorSubject, combineLatest, map, tap } from 'rxjs';

import { KocService } from '../services/koc.service';
import { KocData } from '../models/koc.model';
import { AddKocComponent } from '../add-koc/add-koc.component';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-koc-list',
  standalone: true,
  imports: [CommonModule, AddKocComponent, FormsModule],
  templateUrl: './koc-list.component.html',
  styleUrls: ['./koc-list.component.css'],
})
export class KocListComponent {

  // @ViewChild(AddKocComponent) addKocPopup!: AddKocComponent;

  @ViewChild('addKoc') addKoc!: AddKocComponent;


  /** ===== STREAM ===== */
  private search$ = new BehaviorSubject<string>('');
  kocList$!: Observable<KocData[]>;

  /** UI state */
  selectAll = false;
  searchText = '';

  constructor(private kocService: KocService) {
    this.initStream();
  }

  /** =========================
   *  INIT STREAM (REALTIME + SEARCH)
   *  ========================= */
  private initStream() {
    this.kocList$ = combineLatest([
      this.kocService.getKocs(),
      this.search$
    ]).pipe(
      map(([list, search]) => {
        const keyword = search.toLowerCase().trim();

        let normalized = list.map(item => ({
          ...item,
          labels: item.labels ?? [],
          products: item.products ?? [],
          linkChannel:
            item.linkChannel || `https://www.tiktok.com/@${item.channelName}`,
          isDuplicate: false,
          selected: item.selected ?? false
        }));

        normalized = this.markDuplicates(normalized);

        // 🔍 SEARCH
        if (keyword) {
          normalized = normalized.filter(item =>
            item.channelName.toLowerCase().includes(keyword) ||
            item.staff?.toLowerCase().includes(keyword) ||
            item.manager?.toLowerCase().includes(keyword)
          );
        }

        return normalized;
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
}

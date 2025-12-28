import { Component, OnInit, Input, ChangeDetectionStrategy, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { KocService } from '../services/koc.service';
import { KocData } from '../models/koc.model';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase';

@Component({
  selector: 'app-koc-list',
  standalone: true,
  templateUrl: './koc-list.component.html',
  styleUrls: ['./koc-list.component.css'],
  imports: [CommonModule],
})

export class KocListComponent implements OnChanges {

  @Input() kocList: KocData[] = [];

  statuses: string[] = [
    'Chưa liên hệ',
    'Đã liên hệ',
    'Đồng ý',
    'Từ chối',
    'Đã gửi mẫu',
    'Đã nhận mẫu',
    'Đã lên video'
  ];

  constructor(private kocService: KocService) {}
  ngOnChanges(): void {

  }

  ngOnInit(): void {
    this.kocService.getKocs().subscribe(data => {
      this.kocList = data.map(item => ({
        ...item,
        linkChannel: item.linkChannel || `https://www.tiktok.com/@${item.channelName}`,
        isDuplicate: false
      }));

      this.markDuplicates();
    });
  }

  private markDuplicates() {
    this.kocList.forEach(item => {
      const count = this.kocList.filter(
        d => d.channelName === item.channelName
      ).length;
      item.isDuplicate = count > 1;
    });
  }

  updateField(item: KocData, field: keyof KocData, value: any) {
    if (!item.id) return;
    if (value === undefined || value === null) return;

    this.kocService.updateKoc(item.id, {
      [field]: value
    });
  }

  private updateKoc(id: string, data: Partial<KocData>) {
    const ref = doc(db, 'kocs', id);
    return updateDoc(ref, data);
  }
}

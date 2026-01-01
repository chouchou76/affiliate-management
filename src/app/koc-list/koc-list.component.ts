import { Component, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Observable, map } from 'rxjs';

import { KocService } from '../services/koc.service';
import { KocData } from '../models/koc.model';
import { AddKocComponent } from '../add-koc/add-koc.component';

@Component({
  selector: 'app-koc-list',
  standalone: true,
  imports: [CommonModule, AddKocComponent],
  templateUrl: './koc-list.component.html',
  styleUrls: ['./koc-list.component.css'],
})
export class KocListComponent {

  @ViewChild(AddKocComponent) addKocPopup!: AddKocComponent;

  /** 🔥 STREAM REALTIME TỪ FIRESTORE */
  kocList$!: Observable<KocData[]>;

  constructor(private kocService: KocService) {
    this.initStream();
  }

  private initStream() {
    this.kocList$ = this.kocService.getKocs().pipe(
      map(list => {
        // chuẩn hóa dữ liệu + đánh dấu trùng
        const withDefaults = list.map(item => ({
          ...item,
          labels: item.labels ?? [],
          products: item.products ?? [],
          linkChannel:
            item.linkChannel || `https://www.tiktok.com/@${item.channelName}`,
          isDuplicate: false
        }));

        return this.markDuplicates(withDefaults);
      })
    );
  }

  edit(item: KocData) {
    this.addKocPopup.openPopup(item);
  }

  remove(item: KocData) {
    if (!item.id) return;
    if (confirm('Bạn chắc chắn muốn xóa KOC này?')) {
      this.kocService.deleteKoc(item.id);
    }
  }

  /** 🔁 Sau khi save → Firestore tự emit → bảng tự update */
  onSaved() {
    // KHÔNG CẦN reload
  }

  /** đánh dấu KOC trùng tên kênh */
  private markDuplicates(list: KocData[]): KocData[] {
    const mapCount = new Map<string, number>();

    list.forEach(item => {
      mapCount.set(
        item.channelName,
        (mapCount.get(item.channelName) || 0) + 1
      );
    });

    return list.map(item => ({
      ...item,
      isDuplicate: (mapCount.get(item.channelName) || 0) > 1
    }));
  }
}

// import {
//   Component,
//   Input,
//   ViewChild,
//   AfterViewInit
// } from '@angular/core';
// import { CommonModule } from '@angular/common';
// import { KocService } from '../services/koc.service';
// import { KocData } from '../models/koc.model';
// import { AddKocComponent } from '../add-koc/add-koc.component';
// import { map, Observable } from 'rxjs';

// @Component({
//   selector: 'app-koc-list',
//   standalone: true,
//   imports: [CommonModule, AddKocComponent],
//   templateUrl: './koc-list.component.html',
//   styleUrls: ['./koc-list.component.css'],
// })
// export class KocListComponent implements AfterViewInit {

//   @Input() kocList: KocData[] = [];

//   @ViewChild(AddKocComponent) addKocPopup!: AddKocComponent;

//   kocList$!: Observable<any[]>;

//   statuses: string[] = [
//     'Chưa liên hệ',
//     'Đã liên hệ',
//     'Đồng ý',
//     'Từ chối',
//     'Đã gửi mẫu',
//     'Đã nhận mẫu',
//     'Đã lên video'
//   ];

//   constructor(private kocService: KocService) {}

//   ngAfterViewInit(): void {
//     // đảm bảo ViewChild đã sẵn sàng
//   }

//   ngOnInit(): void {
//     this.kocService.getKocs().subscribe(data => {
//       this.kocList = data.map(item => ({
//         ...item,
//         linkChannel: item.linkChannel || `https://www.tiktok.com/@${item.channelName}`,
//         isDuplicate: false
//       }));
//       this.markDuplicates();
//     });
//   }

//   edit(item: KocData) {
//     if (!this.addKocPopup) {
//       console.error('Popup chưa render');
//       return;
//     }
//     this.addKocPopup.openPopup(item);
//   }

//   remove(item: KocData) {
//     if (!item.id) return;
//     if (confirm('Bạn chắc chắn muốn xóa KOC này?')) {
//       this.kocService.deleteKoc(item.id);
//     }
//   }

//   updateField(item: KocData, field: keyof KocData, value: any) {
//     if (!item.id) return;
//     if (value === undefined || value === null) return;

//     this.kocService.updateKoc(item.id, {
//       [field]: value
//     });
//   }

//   reload() {
//     const kocList$ = this.kocService.getKocs().pipe(
//       map(data =>
//         data.map(item => ({
//           ...item,
//           labels: item.labels ?? [],
//           products: item.products ?? [],
//           isDuplicate: false
//         }))
//       )
//     );
//   }

//   private markDuplicates() {
//     this.kocList.forEach(item => {
//       const count = this.kocList.filter(
//         d => d.channelName === item.channelName
//       ).length;
//       item.isDuplicate = count > 1;
//     });
//   }
// }

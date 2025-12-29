import {
  Component,
  Input,
  ViewChild,
  AfterViewInit
} from '@angular/core';
import { CommonModule } from '@angular/common';
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
export class KocListComponent implements AfterViewInit {

  @Input() kocList: KocData[] = [];

  @ViewChild(AddKocComponent) addKocPopup!: AddKocComponent;

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

  ngAfterViewInit(): void {
    // đảm bảo ViewChild đã sẵn sàng
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

  edit(item: KocData) {
    if (!this.addKocPopup) {
      console.error('Popup chưa render');
      return;
    }
    this.addKocPopup.openPopup(item);
  }

  remove(item: KocData) {
    if (!item.id) return;
    if (confirm('Bạn chắc chắn muốn xóa KOC này?')) {
      this.kocService.deleteKoc(item.id);
    }
  }

  updateField(item: KocData, field: keyof KocData, value: any) {
    if (!item.id) return;
    if (value === undefined || value === null) return;

    this.kocService.updateKoc(item.id, {
      [field]: value
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
}

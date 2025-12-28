import { Component, OnInit, Input, ChangeDetectionStrategy, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';

interface KocData {
  expectedAirDate: any;
  actualAirDate: any;
  videoLink: any;
  channelName: string;
  staff: string;
  manager: string;
  dateFound: string;
  channel: string;
  cast: string;
  commission: string;
  note: string;
  labels: string[];
  product: string[];
  status: string;
  tiktokVideoLink: string;
  videoId: string;
  airDate: string;
  totalViews: number;
  traffic: string;
  castApproval: string;
  sampleSendDate: string;
  shopManagement: string;
  viewTiktok: string;
  viewOther: string;
  viewCount: number;
  releaseTime: string;
  title: string;
  dataRetrievalTime: string;
  gmv: number;
  views: number;
  likes: number;
  comments: number;
  shares: number;
  saves: number;
  isDuplicate: boolean;
  recontact: string;
  linkChannel?: string;  
}

@Component({
  selector: 'app-koc-list',
  standalone: true,
  templateUrl: './koc-list.component.html',
  styleUrls: ['./koc-list.component.css'],
  imports: [CommonModule],
  // changeDetection: ChangeDetectionStrategy.OnPush,
})

export class KocListComponent implements OnChanges {
  @Input() kocList: KocData[] = [];  // Nhận dữ liệu từ AppComponent
Array: any;

  constructor() { }
  // ngOnChanges(changes: SimpleChanges): void {
  //   throw new Error('Method not implemented.');
  // }

  // ngOnInit(): void {
  //   // Tính toán LINK KÊNH tự động và kiểm tra trùng tên kênh
  //   this.kocList.forEach(item => {
  //     item.linkChannel = `https://www.tiktok.com/@${item.channelName}`;  // Tạo link tự động
  //     const count = this.kocList.filter(d => d.channelName === item.channelName).length;
  //     item.isDuplicate = count > 1;  // Kiểm tra nếu trùng tên kênh
  //   });
  // }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['kocList']) {
      this.kocList.forEach(item => {
        item.linkChannel = `https://www.tiktok.com/@${item.channelName}`;
        const count = this.kocList.filter(d => d.channelName === item.channelName).length;
        item.isDuplicate = count > 1;
      });
    }
  }

  // Hàm để xử lý sự kiện khi dữ liệu được thêm vào từ AddKocComponent
  updateKocList(kocData: KocData): void {
    this.kocList.push(kocData);
  }
}

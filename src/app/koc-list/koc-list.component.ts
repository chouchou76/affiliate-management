import { Component, OnInit, Input, ChangeDetectionStrategy, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { KocService } from '../services/koc.service';
import { KocData } from '../models/koc.model';

// interface KocData {
//   expectedAirDate: any;
//   actualAirDate: any;
//   videoLink: any;
//   channelName: string;
//   staff: string;
//   manager: string;
//   dateFound: string;
//   channel: string;
//   cast: string;
//   commission: string;
//   note: string;
//   labels: string[];
//   product: string[];
//   status: string;
//   tiktokVideoLink: string;
//   videoId: string;
//   airDate: string;
//   totalViews: number;
//   traffic: string;
//   castApproval: string;
//   sampleSendDate: string;
//   shopManagement: string;
//   viewTiktok: string;
//   viewOther: string;
//   viewCount: number;
//   releaseTime: string;
//   title: string;
//   dataRetrievalTime: string;
//   gmv: number;
//   views: number;
//   likes: number;
//   comments: number;
//   shares: number;
//   saves: number;
//   isDuplicate: boolean;
//   recontact: string;
//   linkChannel?: string;  
// }

@Component({
  selector: 'app-koc-list',
  standalone: true,
  templateUrl: './koc-list.component.html',
  styleUrls: ['./koc-list.component.css'],
  imports: [CommonModule],
})

export class KocListComponent implements OnChanges {

  @Input() kocList: KocData[] = [];

  constructor(private kocService: KocService) {}
  ngOnChanges(changes: SimpleChanges): void {
    throw new Error('Method not implemented.');
  }

  ngOnInit(): void {
    this.kocService.getKocs().subscribe(data => {
      this.kocList = data.map(item => ({
        ...item,
        linkChannel: `https://www.tiktok.com/@${item.channelName}`,
        isDuplicate: false // xử lý dưới
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
}

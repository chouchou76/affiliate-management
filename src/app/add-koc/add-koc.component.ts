import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { KocService } from '../services/koc.service';
import { KocData } from '../models/koc.model';
import { TiktokCrawlService } from '../services/tiktok-crawl.service';

@Component({
  selector: 'app-add-koc',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './add-koc.component.html',
  styleUrls: ['./add-koc.component.css']
})
export class AddKocComponent {

  isPopupOpen = false;
  isSubmitting = false;
  isEditMode = false;

  kocData: KocData = this.initForm();

  @Output() saved = new EventEmitter<void>();
  @Output() closed = new EventEmitter<void>();

  availableLabels = ['ENZYCO', 'HAPAKU'];
  availableProducts = ['Rửa Bát', 'Ngâm Rau', 'Nước Lau Sàn', 'Túi Than'];
  availableStatuses = [
    'Chưa liên hệ',
    'Đã liên hệ',
    'Đồng ý',
    'Từ chối',
    'Đã gửi mẫu',
    'Đã nhận mẫu',
    'Đã lên video'
  ];

  constructor(
    private kocService: KocService,
    private crawlService: TiktokCrawlService
  ) {}


  /* =====================
      OPEN POPUP
  ===================== */
  openPopup(koc?: KocData) {
    this.isPopupOpen = true;

    if (koc) {
      this.isEditMode = true;
      this.kocData = { ...koc }; // clone tránh mutate list
    } else {
      this.isEditMode = false;
      this.kocData = this.initForm();
    }
  }

  closePopup() {
    this.isPopupOpen = false;
    this.isEditMode = false;
    this.resetForm();
    this.closed.emit();
  }

  addTag(list: string[], input: HTMLInputElement) { 
    const value = input.value.trim(); 
    if (value && !list.includes(value)) { 
      list.push(value); 
    } 
    input.value = ''; 
  } 

  addSelectTag(list: string[], event: Event) { const value = (event.target as HTMLSelectElement).value; 
    if (value && !list.includes(value)) { 
      list.push(value); 
    } 
    (event.target as HTMLSelectElement).value = ''; 
  } 

  removeTag(list: string[], index: number) { 
    list.splice(index, 1); 
  }
  
  async saveKoc() {
    if (!this.kocData.channelName) {
      alert('Vui lòng nhập Tên kênh');
      return;
    }

    this.isSubmitting = true;

    try {
      const payload: Partial<KocData> = {
        ...this.kocData,
        linkChannel: `https://www.tiktok.com/@${this.kocData.channelName}`
      };

      if (this.isEditMode && this.kocData.id) {
        // ✅ UPDATE – KHÔNG TẠO ID MỚI
        await this.kocService.updateKoc(this.kocData.id, payload);
      } else {
        // ✅ ADD NEW
        await this.kocService.addKoc({
          ...payload,
          createdAt: new Date()
        } as KocData);
      }

      this.saved.emit();
      this.closePopup();
    } catch (e) {
      console.error(e);
      alert('❌ Lỗi khi lưu');
    } finally {
      this.isSubmitting = false;
    }
  }

  async onVideoLinkBlur() {
    if (!this.kocData.videoLink) return;

    try {
      const data = await this.crawlService
        .crawl(this.kocData.videoLink)
        .toPromise();

      Object.assign(this.kocData, data);
    } catch (e) {
      alert('Không crawl được video TikTok');
    }
  }


  private initForm(): KocData {
    return {
      channelName: '',
      linkChannel: '',
      isDuplicate: false,
      dateFound: '',

      cast: '',
      commission: '',
      note: '',
      recontact: '',

      labels: [],
      products: [],
      status: '',

      staff: 'Lê Châu',
      manager: 'Trưởng Team',

      gmv: 0,
      views: 0,
      likes: 0,
      comments: 0,
      shares: 0,
      saves: 0,

      createdAt: null
    };
  }

  private resetForm() {
    this.kocData = this.initForm();
  }
}

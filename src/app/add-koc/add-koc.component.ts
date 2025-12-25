import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { KocService } from '../services/koc.service';
import { KocData } from '../models/koc.model';
import { serverTimestamp } from '@angular/fire/firestore';

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

  kocData: KocData = this.initForm();

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

  constructor(private kocService: KocService) {}

  /* ==========================
      POPUP
  ========================== */
  openPopup() {
    this.isPopupOpen = true;
  }

  closePopup() {
    this.isPopupOpen = false;
    this.resetForm();
  }

  /* ==========================
      TAG HANDLER
  ========================== */
  addTag(list: string[], input: HTMLInputElement) {
    const value = input.value.trim();
    if (value && !list.includes(value)) {
      list.push(value);
    }
    input.value = '';
  }

  addSelectTag(list: string[], event: Event) {
    const value = (event.target as HTMLSelectElement).value;
    if (value && !list.includes(value)) {
      list.push(value);
    }
    (event.target as HTMLSelectElement).value = '';
  }

  removeTag(list: string[], index: number) {
    list.splice(index, 1);
  }

  /* ==========================
      SAVE FIREBASE
  ========================== */
  async saveKoc() {
    if (!this.kocData.channelName || !this.kocData.linkChannel) {
      alert('Vui lòng nhập Tên kênh và Link kênh');
      return;
    }

    this.isSubmitting = true;

    try {
      await this.kocService.addKoc({
        ...this.kocData,
        createdAt: serverTimestamp()
      });

      alert('✅ Lưu KOC thành công!');
      this.closePopup();
    } catch (error) {
      console.error('Firebase error:', error);
      alert('❌ Lỗi khi lưu dữ liệu');
    } finally {
      this.isSubmitting = false;
    }
  }

  /* ==========================
      INIT / RESET
  ========================== */
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

      staff: 'Lê Châu',        // sau này lấy từ auth
      manager: 'Trưởng Team',  // role

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

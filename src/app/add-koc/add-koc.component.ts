// import { Component, EventEmitter, Output } from '@angular/core';
// import { CommonModule } from '@angular/common';
// import { FormsModule } from '@angular/forms';
// import { KocService } from '../services/koc.service';
// import { KocData } from '../models/koc.model';
// import { TikTokApiService } from '../services/tiktok-api.service';

// @Component({
//   selector: 'app-add-koc',
//   standalone: true,
//   imports: [CommonModule, FormsModule],
//   templateUrl: './add-koc.component.html',
//   styleUrls: ['./add-koc.component.css']
// })
// export class AddKocComponent {

//   isPopupOpen = false;
//   isSubmitting = false;
//   isEditMode = false;
//   isCrawling = false;

//   selectedLabels: string[] = [];
//   selectedProducts: string[] = [];


//   kocData: KocData = this.initForm();

//   @Output() saved = new EventEmitter<void>();
//   @Output() closed = new EventEmitter<void>();

//   availableLabels = ['ENZYCO', 'HAPAKU'];
//   availableProducts = ['Rửa Bát', 'Ngâm Rau', 'Nước Lau Sàn', 'Túi Than'];
//   availableStatuses = [
//     'Chưa liên hệ',
//     'Đã liên hệ',
//     'Đồng ý',
//     'Từ chối',
//     'Đã gửi mẫu',
//     'Đã nhận mẫu',
//     'Đã lên video'
//   ];

//   constructor(
//     private kocService: KocService,
//     private tiktokApi: TikTokApiService
//   ) {}

//   openPopup(koc?: KocData) {
//     this.isPopupOpen = true;

//     if (koc) {
//       this.isEditMode = true;
//       this.kocData = { ...koc }; // clone tránh mutate list
//     } else {
//       this.isEditMode = false;
//       this.kocData = this.initForm();
//     }
//   }

//   closePopup() {
//     this.isPopupOpen = false;
//     this.isEditMode = false;
//     this.resetForm();
//     this.closed.emit();
//   }

//   addTag(list: string[], input: HTMLInputElement) { 
//     const value = input.value.trim(); 
//     if (value && !list.includes(value)) { 
//       list.push(value); 
//     } 
//     input.value = ''; 
//   } 

//   addSelectTag(targetArray: string[], event: Event) {
//     const value = (event.target as HTMLSelectElement).value;
//     if (!value) return;

//     if (!targetArray.includes(value)) {
//       targetArray.push(value);
//     }

//     // reset select
//     (event.target as HTMLSelectElement).value = '';
//   }

//   removeTag(list: string[], index: number) { 
//     list.splice(index, 1); 
//   }
  
//   async saveKoc() {
//     if (!this.kocData.channelName) {
//       alert('Vui lòng nhập Tên kênh');
//       return;
//     }

//     this.isSubmitting = true;

//     try {
//       const payload: Partial<KocData> = {
//   channelName: this.kocData.channelName,
//   linkChannel: `https://www.tiktok.com/@${this.kocData.channelName}`,
//   videoLink: this.kocData.videoLink ?? undefined,
//   videoId: this.kocData.videoId ?? undefined,
//   title: this.kocData.title ?? '',
//   views: this.kocData.views,
//   likes: this.kocData.likes,
//   comments: this.kocData.comments,
//   shares: this.kocData.shares,
//   saves: this.kocData.saves,
//   isAd: this.kocData.isAd,
//   actualAirDate: this.kocData.actualAirDate,
//   dataRetrievalTime: this.kocData.dataRetrievalTime
// };


//       if (this.isEditMode && this.kocData.id) {
//         // ✅ UPDATE – KHÔNG TẠO ID MỚI
//         await this.kocService.updateKoc(this.kocData.id, payload);
//       } else {
//         // ✅ ADD NEW
//         await this.kocService.addKoc({
//           ...payload,
//           createdAt: new Date()
//         } as KocData);
//       }

//       this.saved.emit();
//       this.closePopup();
//     } catch (e) {
//       console.error(e);
//       alert('❌ Lỗi khi lưu');
//     } finally {
//       this.isSubmitting = false;
//     }
//   }

//     private initForm(): KocData {
//     return {
//       id: '',
//       channelName: '',
//       linkChannel: '',
//       isDuplicate: false,
//       dateFound: '',

//       videoLink: '',
//       videoId: '',
//       title: '',

//       cast: '',
//       commission: '',
//       note: '',
//       recontact: '',

//       labels: [] as string[],
//       products: [] as string[],
//       status: '',

//       staff: 'Lê Châu',
//       manager: 'Trưởng Team',

//       gmv: 0,
//       views: 0,
//       likes: 0,
//       comments: 0,
//       shares: 0,
//       saves: 0,

//       isAd: false,
//       actualAirDate: '',
//       dataRetrievalTime: '',

//       createdAt: null
//     };
//   }

//   private resetForm() {
//     this.kocData = this.initForm();
//   }

//   crawlTikTok() {
//     if (!this.kocData.videoLink) {
//       alert('Vui lòng nhập link video TikTok');
//       return;
//     }

//     this.isCrawling = true;

//     this.tiktokApi.crawlVideo(this.kocData.videoLink).subscribe({
//       next: (data) => {
//         // 🔥 Auto fill data
//         this.kocData.videoId = data.videoId ?? '';
//         this.kocData.videoLink = data.videoLink ?? '';
//         this.kocData.views = data.views;
//         this.kocData.likes = data.likes;
//         this.kocData.comments = data.comments;
//         this.kocData.shares = data.shares;
//         this.kocData.saves = data.saves;
//         this.kocData.title = data.title;
//         this.kocData.actualAirDate = data.actualAirDate;
//         this.kocData.isAd = data.isAd;
//         this.kocData.dataRetrievalTime = data.dataRetrievalTime;

//         alert('✅ Cào dữ liệu thành công');
//         this.isCrawling = false;
//       },
//       error: (err) => {
//         console.error(err);
//         alert('❌ Không cào được dữ liệu TikTok');
//         this.isCrawling = false;
//       }
//     });
//   }
// }
import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { KocService } from '../services/koc.service';
import { TikTokApiService } from '../services/tiktok-api.service';
import { KocData } from '../models/koc.model';

@Component({
  selector: 'app-add-koc',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './add-koc.component.html',
  styleUrls: ['./add-koc.component.css']
})
export class AddKocComponent {

  isPopupOpen = false;
  isSubmitting = false;
  isEditMode = false;
  isCrawling = false;

  form!: FormGroup;

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

  @Output() saved = new EventEmitter<void>();
  @Output() closed = new EventEmitter<void>();

  constructor(
    private fb: FormBuilder,
    private kocService: KocService,
    private tiktokApi: TikTokApiService
  ) {
    this.buildForm();
  }

  private buildForm() {
    this.form = this.fb.group({
      id: [''],
      channelName: [''],
      linkChannel: [''],
      dateFound: [''],
      isDuplicate: [false],

      staff: ['Lê Châu'],
      manager: ['Trưởng Team'],

      cast: [''],
      commission: [''],
      note: [''],
      recontact: [''],

      labels: [[]],
      products: [[]],
      status: [''],

      sampleSendDate: [''],
      expectedAirDate: [''],
      actualAirDate: [''],

      videoLink: [''],
      videoId: [''],
      title: [''],

      gmv: [0],
      views: [0],
      likes: [0],
      comments: [0],
      shares: [0],
      saves: [0],

      isAd: [false],
      dataRetrievalTime: [''],

      createdAt: [null]
    });
  }

  openPopup(koc?: KocData) {
    this.isPopupOpen = true;
    this.isEditMode = !!koc;

    if (koc) {
      this.form.patchValue(koc);
    } else {
      this.form.reset({
        staff: 'Lê Châu',
        manager: 'Trưởng Team',
        labels: [],
        products: []
      });
    }
  }

  closePopup() {
    this.isPopupOpen = false;
    this.isEditMode = false;
    this.form.reset();
    this.closed.emit();
  }

  addSelectTag(controlName: 'labels' | 'products', event: Event) {
    const value = (event.target as HTMLSelectElement).value;
    if (!value) return;

    const current = this.form.value[controlName] || [];
    if (!current.includes(value)) {
      this.form.patchValue({
        [controlName]: [...current, value]
      });
    }

    (event.target as HTMLSelectElement).value = '';
  }

  removeTag(controlName: 'labels' | 'products', index: number) {
    const arr = [...this.form.value[controlName]];
    arr.splice(index, 1);
    this.form.patchValue({ [controlName]: arr });
  }

  async saveKoc() {
    if (!this.form.value.channelName) {
      alert('Vui lòng nhập tên kênh');
      return;
    }

    this.isSubmitting = true;

    try {
      const payload: Partial<KocData> = {
        ...this.form.value,
        linkChannel: `https://www.tiktok.com/@${this.form.value.channelName}`
      };

      if (this.isEditMode && payload.id) {
        await this.kocService.updateKoc(payload.id, payload);
      } else {
        await this.kocService.addKoc({
          ...payload,
          createdAt: new Date()
        } as KocData);
      }

      this.saved.emit();
      this.closePopup();
    } catch (e) {
      console.error(e);
      alert('❌ Lỗi khi lưu KOC');
    } finally {
      this.isSubmitting = false;
    }
  }

  crawlTikTok() {
    const videoLink = this.form.value.videoLink;
    if (!videoLink) {
      alert('Vui lòng nhập link video TikTok');
      return;
    }

    this.isCrawling = true;

    this.tiktokApi.crawlVideo(videoLink).subscribe({
      next: (data) => {
        this.form.patchValue({
          videoId: data.videoId,
          views: data.views,
          likes: data.likes,
          comments: data.comments,
          shares: data.shares,
          saves: data.saves,
          title: data.title,
          actualAirDate: data.actualAirDate,
          isAd: data.isAd,
          dataRetrievalTime: data.dataRetrievalTime
        });

        alert('✅ Cào dữ liệu thành công');
        this.isCrawling = false;
      },
      error: () => {
        alert('❌ Không cào được dữ liệu TikTok');
        this.isCrawling = false;
      }
    });
  }
}

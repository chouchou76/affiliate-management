import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
  getFirestore,
  collection,
  getDocs,
  addDoc,
  query,
  orderBy
} from 'firebase/firestore';
import { KocService } from '../services/koc.service';
import { TikTokApiService } from '../services/tiktok-api.service';
import { KocData } from '../models/koc.model';
import { HostListener } from '@angular/core';

interface Product {
  id: string;
  name: string;
}

@Component({
  selector: 'app-add-koc',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './add-koc.component.html',
  styleUrls: ['./add-koc.component.css']
})
export class AddKocComponent {

  isPopupOpen = false;
  isSubmitting = false;
  isEditMode = false;
  isCrawling = false;
  isOpen = false;
  kocForm!: FormGroup;
  private editingId: string | null = null;

  products: Product[] = [];
  filteredProducts: Product[] = [];
  productInput = '';
  showProductDropdown = false;
  firestore = getFirestore();

  colorMap = {
    products: new Map<string, string>(),
    statuses: new Map<string, string>()
  };

  readonly COLOR_CLASSES = [
    'status-blue',
    'status-green',
    'status-purple',
    'status-red',
    'status-gray'
  ];

  statusOpen = false;

  selectStatus(status: string, event?: Event) {
    event?.stopPropagation(); // 🔥 CỰC QUAN TRỌNG

    this.form.patchValue({ status });
    this.closeStatusDropdown();
  }

  closeStatusDropdown() {
    this.statusOpen = false;
  }


  @HostListener('document:click')
    onDocumentClick() {
      this.statusOpen = false;
      // this.isOpen = false; 
    }

  form!: FormGroup;

  availableLabels = ['ENZYCO', 'HAPAKU'];
  availableProducts: string[] = [];
  availableStatuses = [
    'Chưa liên hệ',
    'Đã liên hệ',
    'Đồng ý',
    'Từ chối',
    'Đã gửi mẫu',
    'Đã nhận mẫu',
    'Đã lên video'
  ];

  async ngOnInit() {
    this.kocForm = this.fb.group({
      products: [[]]
    });

    await this.loadProducts();
  }

  @Output() saved = new EventEmitter<void>();
  @Output() closed = new EventEmitter<void>();

  constructor(
    private fb: FormBuilder,
    private kocService: KocService,
    private tiktokApi: TikTokApiService,
    // private productService: ProductService
  ) {
    this.buildForm();
  }

  private buildForm() {
    this.form = this.fb.group({
      
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
      const { id, ...formData } = koc;
      this.editingId = id!;
      this.form.patchValue(formData);
    } else {
      this.editingId = null;
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
    this.editingId = null;
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

      // 🔒 TUYỆT ĐỐI KHÔNG CHO ID LỌT VÀO FIRESTORE
      delete (payload as any).id;

      if (this.isEditMode && this.editingId) {
        await this.kocService.updateKoc(this.editingId, payload);
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
    console.log('EDIT MODE:', this.isEditMode);
    console.log('EDIT ID:', this.editingId);

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

  private getRandomColor(): string {
    const index = Math.floor(Math.random() * this.COLOR_CLASSES.length);
    return this.COLOR_CLASSES[index];
  }

  getColor(type: 'products' | 'statuses', value: string): string {
    const map = this.colorMap[type];

    if (!map.has(value)) {
      map.set(value, this.getRandomColor());
    }

    return map.get(value)!;
  }

  addProductToForm(name: string) {
    const products = this.form.value.products || [];

    if (!products.includes(name)) {
      this.form.patchValue({
        products: [...products, name]
      });
    }

    this.productInput = '';
    this.showProductDropdown = false;
  }

  isProductExist(name: string): boolean {
    return this.products.some(
      p => p.name.toLowerCase() === name.toLowerCase()
    );
  }

  // 🔹 LOAD PRODUCT
  async loadProducts() {
    const ref = collection(this.firestore, 'products');
    const q = query(ref, orderBy('createdAt', 'asc'));
    const snap = await getDocs(q);

    this.products = snap.docs.map(d => ({
      id: d.id,
      name: d.data()['name']
    }));

    this.filteredProducts = this.products;
  }

  // 🔹 FILTER
  filterProducts() {
    const key = this.productInput.toLowerCase();
    this.filteredProducts = this.products.filter(p =>
      p.name.toLowerCase().includes(key)
    );
  }

  // 🔹 SELECT
  async selectProduct(product: Product, event?: Event) {
    event?.stopPropagation(); // 🔥 CỰC KỲ QUAN TRỌNG

    const current = this.kocForm.value.products as Product[];

    if (!current.find(p => p.id === product.id)) {
      this.kocForm.patchValue({
        products: [...current, product]
      });
    }

    this.closeDropdown();
  }


  // 🔹 ENTER → ADD OR SELECT
  async onEnter() {
    if (!this.productInput.trim()) return;

    const exist = this.products.find(
      p => p.name.toLowerCase() === this.productInput.toLowerCase()
    );

    if (exist) {
      this.selectProduct(exist);
      return;
    }

    const ref = collection(this.firestore, 'products');
    const docRef = await addDoc(ref, {
      name: this.productInput.trim(),
      createdAt: new Date()
    });

    const newProduct = {
      id: docRef.id,
      name: this.productInput.trim()
    };

    this.products.push(newProduct);
    this.selectProduct(newProduct);
  }


  removeProduct(id: string) {
    const list = this.kocForm.value.products.filter((p: Product) => p.id !== id);
    this.kocForm.patchValue({ products: list });
  }

  resetInput() {
    this.productInput = '';
    this.filteredProducts = this.products;
    this.isOpen = false;
  }

  openDropdown() {
    this.isOpen = true;
  }

  closeDropdown() {
    this.isOpen = false;
    this.productInput = '';
    this.filteredProducts = this.products;
  }

  openStatusDropdown(event?: Event) {
    event?.stopPropagation();
    this.statusOpen = true;
  }
  
  openLabelDropdown(event?: Event) {
    event?.stopPropagation();
    this.labelOpen = true;
  }
    labelOpen = false;
    selectLabel(label: string, event?: Event) {
    event?.stopPropagation();

    const current = this.form.value.labels || [];

    if (!current.includes(label)) {
      this.form.patchValue({
        labels: [...current, label]
      });
    }

    this.closeLabelDropdown();
  }
  removeLabel(index: number) {
    const arr = [...this.form.value.labels];
    arr.splice(index, 1);
    this.form.patchValue({ labels: arr });
  }
  closeLabelDropdown() {
    this.labelOpen = false;
  }

}

// import { Component, Input, Output, EventEmitter } from '@angular/core';
// import { CommonModule } from '@angular/common';
// import { FormsModule } from '@angular/forms';
// import { SortConfig } from '../models/filter.model';
// import { FILTER_FIELDS } from '../models/filter.model';
// import { KocData } from '../models/koc.model';

// @Component({
//   selector: 'app-sort-builder',
//   standalone: true,
//   imports: [CommonModule, FormsModule],
//   templateUrl: './sort-builder.component.html',
//   styleUrls: ['./sort-builder.component.css']
// })
// export class SortBuilderComponent {

//   @Input() sort: SortConfig | null = null;
//   @Output() sortChange = new EventEmitter<SortConfig | null>();

//   fields = FILTER_FIELDS;

//   setField(field: keyof KocData) {
//     const fieldConfig = this.fields.find(f => f.field === field);

//     if (!fieldConfig || fieldConfig.type === 'boolean') return;

//     this.sort = {
//       field,
//       type: fieldConfig.type, // ✅ OK
//       direction: 'asc'
//     };

//     this.emit();
//   }


//   toggleDirection() {
//     if (!this.sort) return;
//     this.sort.direction = this.sort.direction === 'asc' ? 'desc' : 'asc';
//     this.emit();
//   }

//   clear() {
//     this.sort = null;
//     this.emit();
//   }

//   private emit() {
//     this.sortChange.emit(this.sort);
//   }

//   sortableFields = this.fields.filter(
//     f => f.type !== 'boolean'
//   );

//   onFieldChange(field: keyof KocData) {
//     const config = this.fields.find(f => f.field === field);
//     if (!config || config.type === 'boolean') return;

//     this.sort = {
//       field,
//       type: config.type,
//       direction: 'asc'
//     };

//     this.emit();
//   }

//   onDirectionChange(direction: 'asc' | 'desc') {
//     if (!this.sort) return;

//     this.sort = {
//       ...this.sort,
//       direction
//     };

//     this.emit();
//   }

// }

import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SortConfig } from '../models/filter.model';
import { FILTER_FIELDS } from '../models/filter.model';
import { KocData } from '../models/koc.model';

@Component({
  selector: 'app-sort-builder',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './sort-builder.component.html',
  styleUrls: ['./sort-builder.component.css']
})
export class SortBuilderComponent {

  @Input() sort: SortConfig | null = null;
  @Output() sortChange = new EventEmitter<SortConfig | null>();

  fields = FILTER_FIELDS;

  sortableFields = this.fields.filter(f => f.type !== 'boolean');

  // Lấy label đẹp từ FILTER_FIELDS
  getFieldLabel(field: string): string {
    const config = this.fields.find(f => f.field === field);
    return config?.label || field;
  }

  // Label cho direction dựa trên type
  getDirectionLabel(dir: 'asc' | 'desc'): string {
    if (!this.sort) return '';

    const type = this.sort.type;

    if (dir === 'asc') {
      if (type === 'text') return 'A → Z';
      if (type === 'date') return 'Cũ → Mới';
      return '0 → 9';
    } else {
      if (type === 'text') return 'Z → A';
      if (type === 'date') return 'Mới → Cũ';
      return '9 → 0';
    }
  }

  onFieldChange(field: string) {
    if (!field) return;

    const config = this.fields.find(f => f.field === field);
    if (!config || config.type === 'boolean') return;

    // ✅ Kiểm tra field có thực sự là key của KocData không
    if (this.isValidField(field)) {
      this.sort = {
        field: field as keyof KocData,  // Bây giờ TS chấp nhận vì đã kiểm tra
        type: config.type,
        direction: 'asc'
      };
      this.emit();
    }
  }

  // Thêm type guard
  private isValidField(field: string): field is keyof KocData {
    return field in ({} as KocData); // hoặc đơn giản hơn:
    // return this.fields.some(f => f.field === field);
  }
  

  onDirectionChange(direction: 'asc' | 'desc') {
    if (!this.sort) return;

    this.sort = {
      ...this.sort,
      direction
    };

    this.emit();
  }

  clear() {
    this.sort = null;
    this.emit();
  }

  private emit() {
    this.sortChange.emit(this.sort);
  }
}
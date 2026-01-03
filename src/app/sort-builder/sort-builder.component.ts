// sort-builder.component.ts (ĐÃ SỬA HOÀN CHỈNH)
import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FILTER_FIELDS } from '../models/filter.model';

export interface SortRule {
  field: string;        // dùng string để tránh lỗi keyof
  type: 'text' | 'number' | 'date';
  direction: 'asc' | 'desc';
}

@Component({
  selector: 'app-sort-builder',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './sort-builder.component.html',
  styleUrls: ['./sort-builder.component.css']
})
export class SortBuilderComponent implements OnInit {

  @Input() sorts: SortRule[] = [];           // Nhận mảng rules từ ngoài
  @Output() sortsChange = new EventEmitter<SortRule[] | null>();

  sortRules: SortRule[] = [];
  autoSort: boolean = true;

  fields = FILTER_FIELDS;
  availableFields = this.fields.filter(f => f.type !== 'boolean');

  ngOnInit() {
    this.sortRules = [...this.sorts];
  }

  getFieldLabel(field: string): string {
    return this.fields.find(f => f.field === field)?.label || field;
  }

  getDirectionLabel(type: 'text' | 'number' | 'date', dir: 'asc' | 'desc'): string {
    if (dir === 'asc') {
      return type === 'text' ? 'A → Z' : type === 'date' ? 'Cũ → Mới' : '0 → 9';
    } else {
      return type === 'text' ? 'Z → A' : type === 'date' ? 'Mới → Cũ' : '9 → 0';
    }
  }

  // Sửa: dùng $event: Event và ép kiểu đúng
  addRule(event: Event) {
    const select = event.target as HTMLSelectElement;
    const selectedField = select.value;

    if (!selectedField) return;

    const config = this.availableFields.find(f => f.field === selectedField);
    if (!config) return;

    const newRule: SortRule = {
      field: selectedField,
      type: config.type as 'text' | 'number' | 'date',
      direction: 'asc'
    };

    this.sortRules.push(newRule);
    this.emit();

    // Reset select
    select.value = '';
  }

  changeDirection(index: number, direction: 'asc' | 'desc') {
    this.sortRules[index].direction = direction;
    this.emit();
  }

  removeRule(index: number) {
    this.sortRules.splice(index, 1);
    this.emit();
  }

  onAutoSortChange() {
    // Có thể emit thêm nếu cần lưu trạng thái autoSort
    this.emit();
  }

  private emit() {
    this.sortsChange.emit(this.sortRules.length > 0 ? this.sortRules : null);
  }
}
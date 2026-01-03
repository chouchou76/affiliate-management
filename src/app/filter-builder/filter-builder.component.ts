import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FieldFilter, FieldType } from '../models/filter.model';
import { FILTER_FIELDS, OPERATORS } from '../models/filter.model';
import { KocData } from '../models/koc.model';

@Component({
  selector: 'app-filter-builder',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './filter-builder.component.html',
  styleUrls: ['./filter-builder.component.css']
})
export class FilterBuilderComponent implements OnInit {

  @Input() filters: FieldFilter[] = [];           // Nhận filters từ parent (koc-list)
  @Output() filtersChange = new EventEmitter<FieldFilter[] | null>();

  // Local copy để thao tác realtime
  localFilters: FieldFilter[] = [];

  fields = FILTER_FIELDS;
  operators = OPERATORS;

  // Field mặc định khi thêm rule mới (phải là keyof KocData)
  private defaultField: keyof KocData = 'channelName';

  ngOnInit() {
    this.localFilters = this.filters.length > 0 ? [...this.filters] : [];
  }

  addRule() {
    this.localFilters.push({
      field: this.defaultField,
      operator: 'contains',
      value: ''
    });
    this.emit();
  }

  removeRule(index: number) {
    this.localFilters.splice(index, 1);
    this.emit();
  }

  onFieldChange(rule: FieldFilter) {
    const config = this.fields.find(f => f.field === rule.field);
    if (config) {
      const ops = this.operators[config.type];
      rule.operator = ops[0]?.value || 'contains';
      rule.value = '';
    }
    this.emit();
  }

  // Gọi emit() mỗi khi value thay đổi (input change)
  onValueChange() {
    this.emit();
  }

  getFieldType(field: keyof KocData): FieldType {
    return this.fields.find(f => f.field === field)?.type ?? 'text';
  }

  getOperatorsForField(field: keyof KocData) {
    const type = this.getFieldType(field);
    return this.operators[type] || [];
  }

  emit() {
    if (this.localFilters.length === 0) {
      this.filtersChange.emit(null);
    } else {
      // Chỉ emit các rule đã chọn field (an toàn)
      const validFilters = this.localFilters.filter(f => f.field);
      this.filtersChange.emit(validFilters.length > 0 ? [...validFilters] : null);
    }
  }
}
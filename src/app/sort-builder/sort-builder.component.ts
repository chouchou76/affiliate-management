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

  setField(field: keyof KocData) {
    const fieldConfig = this.fields.find(f => f.field === field);

    if (!fieldConfig || fieldConfig.type === 'boolean') return;

    this.sort = {
      field,
      type: fieldConfig.type, // ✅ OK
      direction: 'asc'
    };

    this.emit();
  }


  toggleDirection() {
    if (!this.sort) return;
    this.sort.direction = this.sort.direction === 'asc' ? 'desc' : 'asc';
    this.emit();
  }

  clear() {
    this.sort = null;
    this.emit();
  }

  private emit() {
    this.sortChange.emit(this.sort);
  }

  sortableFields = this.fields.filter(
    f => f.type !== 'boolean'
  );

  onFieldChange(field: keyof KocData) {
    const config = this.fields.find(f => f.field === field);
    if (!config || config.type === 'boolean') return;

    this.sort = {
      field,
      type: config.type,
      direction: 'asc'
    };

    this.emit();
  }

  onDirectionChange(direction: 'asc' | 'desc') {
    if (!this.sort) return;

    this.sort = {
      ...this.sort,
      direction
    };

    this.emit();
  }

}

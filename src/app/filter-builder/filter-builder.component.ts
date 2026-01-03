import { Component, EventEmitter, Output, ElementRef, HostListener, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FieldFilter } from '../models/filter.model';
import { KocData } from '../models/koc.model';
import { FilterFieldConfig, FieldType, FILTER_FIELDS, OPERATORS } from '../models/filter.model';
import { FilterService } from '../services/filter.service';

@Component({
  selector: 'app-filter-builder',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './filter-builder.component.html',
  styleUrls: ['./filter-builder.component.css']
})
export class FilterBuilderComponent {

  @Input() filters: FieldFilter[] = [];
  @Output() filtersChange = new EventEmitter<FieldFilter[]>();

  fields = FILTER_FIELDS;
  operators = OPERATORS;
  
  constructor(private filterService: FilterService) {
    this.filterService.filters$.subscribe(f => {
      this.filters = [...f];
    });
  }

  addRule() {
    this.filters.push({
      field: 'channelName',
      operator: 'contains',
      value: ''
    });
    this.filtersChange.emit([...this.filters]);
  }

  updateRule(index: number, rule: FieldFilter) {
    this.filterService.update(index, rule);
  }

  removeRule(index: number) {
    this.filterService.remove(index);
  }

  onFieldChange(rule: FieldFilter) {
    const fieldConfig = this.fields.find(f => f.field === rule.field)!;
    rule.operator = this.operators[fieldConfig.type][0].value;
    rule.value = '';
    this.emit();
  }

  emit() {
    this.filtersChange.emit([...this.filters]);
  }

  getFieldType(field: keyof KocData): FieldType {
    return this.fields.find(f => f.field === field)?.type || 'text';
  }
}

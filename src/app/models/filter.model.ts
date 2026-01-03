import { KocData } from './koc.model';

export type FilterOperator =
  | 'eq'
  | 'contains'
  | 'not_contains'
  | 'empty'
  | 'not_empty'
  | 'before'
  | 'after'
  | 'today'
  | 'this_week'
  | 'last_week'
  | 'next_week'
  | 'this_month'
  | 'last_month'
  | 'next_month'
  | 'gt'
  | 'lt';


export interface FieldFilter {
  field: keyof KocData;
  operator: FilterOperator;
  value?: any;
}

export interface SortConfig {
  field: keyof KocData;
  direction: 'asc' | 'desc';
}

export type FieldType = 'text' | 'date' | 'number' | 'boolean';

export interface FilterFieldConfig {
  field: keyof KocData;
  label: string;
  type: FieldType;
}

export const FILTER_FIELDS: FilterFieldConfig[] = [
  { field: 'channelName', label: 'Tên kênh', type: 'text' },
  // { field: 'staff', label: 'Nhân viên', type: 'text' },
  // { field: 'manager', label: 'Quản lý', type: 'text' },
  { field: 'cast', label: 'Cast', type: 'text' },
  { field: 'commission', label: 'Hoa hồng', type: 'text' },
  { field: 'note', label: 'Ghi chú', type: 'text' },
  { field: 'labels', label: 'Nhãn hàng', type: 'text' },
  { field: 'products', label: 'Sản phẩm', type: 'text' },
  { field: 'status', label: 'Trạng thái', type: 'text' },

  { field: 'dateFound', label: 'Ngày tìm', type: 'date' },
  { field: 'sampleSendDate', label: 'Ngày gửi mẫu', type: 'date' },
  { field: 'sampleReceiveDate', label: 'Ngày nhận mẫu', type: 'date' },
  { field: 'expectedAirDate', label: 'Ngày air dự kiến', type: 'date' },
  { field: 'actualAirDate', label: 'Ngày air thực tế', type: 'date' },

  { field: 'gmv', label: 'GMV', type: 'number' },
  { field: 'views', label: 'View', type: 'number' },
  { field: 'likes', label: 'Like', type: 'number' },
  { field: 'comments', label: 'Comment', type: 'number' },
  { field: 'shares', label: 'Share', type: 'number' },
  { field: 'saves', label: 'Save', type: 'number' },

  { field: 'isAd', label: 'Is Ad', type: 'boolean' }
];

export const OPERATORS: Record<
  FieldType,
  { value: FilterOperator; label: string }[]
> = {
  text: [
    { value: 'contains', label: 'Chứa' },
    { value: 'eq', label: 'Chính xác' },
    { value: 'not_contains', label: 'Không chứa' },
    { value: 'empty', label: 'Trống' },
    { value: 'not_empty', label: 'Không trống' }
  ],
  date: [
    { value: 'eq', label: 'Đúng ngày' },
    { value: 'before', label: 'Trước ngày' },
    { value: 'after', label: 'Sau ngày' },
    { value: 'today', label: 'Hôm nay' },
    { value: 'this_week', label: 'Tuần này' },
    { value: 'last_week', label: 'Tuần trước' },
    { value: 'next_week', label: 'Tuần sau' },
    { value: 'this_month', label: 'Tháng này' },
    { value: 'last_month', label: 'Tháng trước' },
    { value: 'next_month', label: 'Tháng sau' },
    { value: 'empty', label: 'Trống' },
    { value: 'not_empty', label: 'Không trống' }
  ],
  number: [
    { value: 'eq', label: '=' },
    { value: 'gt', label: '>' },
    { value: 'lt', label: '<' },
    { value: 'empty', label: 'Trống' },
    { value: 'not_empty', label: 'Không trống' }
  ],
  boolean: [
    { value: 'eq', label: 'Yes' }
  ]
};

export type SortDirection = 'asc' | 'desc';

export type SortableFieldType = Exclude<FieldType, 'boolean'>;

export interface SortConfig {
  field: keyof KocData;
  direction: 'asc' | 'desc';
  type: SortableFieldType;
}

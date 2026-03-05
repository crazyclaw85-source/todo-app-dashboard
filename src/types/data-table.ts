import type {
  ColumnDef,
  ColumnFilter,
  ColumnSort,
  RowData
} from '@tanstack/react-table';

declare module '@tanstack/react-table' {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  interface ColumnMeta<TData extends RowData, TValue> {
    label?: string;
    variant?: string;
    placeholder?: string;
    options?: { label: string; value: string }[];
    range?: [number, number];
    unit?: string;
  }
}

export interface Option {
  label: string;
  value: string;
  icon?: React.ComponentType<{ className?: string }>;
  count?: number;
}

export interface ExtendedColumnSort<TData> extends ColumnSort {
  id: Extract<keyof TData, string>;
}

export interface ExtendedColumnFilter<TData> extends ColumnFilter {
  id: Extract<keyof TData, string>;
  variant: string;
  operator: string;
  filterId: string;
}

export interface DataTableFilterField<TData> {
  id: Extract<keyof TData, string>;
  label: string;
  placeholder?: string;
  options?: Option[];
}

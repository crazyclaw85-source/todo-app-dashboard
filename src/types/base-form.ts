import { Control, FieldPath, FieldValues } from 'react-hook-form';

export interface BaseFormFieldProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
> {
  control: Control<TFieldValues>;
  name: TName;
  label?: string;
  description?: string;
  required?: boolean;
  disabled?: boolean;
  className?: string;
}

export interface FormOption {
  label: string;
  value: string;
  disabled?: boolean;
}

export interface CheckboxGroupOption {
  disabled?: boolean;
  label: string;
  value: string;
}

export interface RadioGroupOption {
  label: string;
  value: string;
  disabled?: boolean;
}

export interface DatePickerConfig {
  placeholder?: string;
  disabledDates?: Date[];
  mode?: 'single' | 'range';
  minDate?: Date;
  maxDate?: Date;
}

export interface SliderConfig {
  min: number;
  max: number;
  step?: number;
  formatValue?: (value: number) => string;
}

export interface TextareaConfig {
  rows?: number;
  maxLength?: number;
  showCharCount?: boolean;
  resize?: 'none' | 'vertical' | 'horizontal' | 'both';
}

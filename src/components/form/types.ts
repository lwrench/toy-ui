export type KV<T = any> = Record<string, T>;

export type ComponentType = keyof JSX.IntrinsicElements | React.ComponentType<any>;

export interface Item {
  label: string;
}

export interface Callbacks<
  FormData = any,
  FieldValue = FormData[keyof FormData],
  FieldKey = keyof FormData,
> {
  onChange?: (value: Partial<FormData>, values: Partial<FormData>) => void;
  onSubmit?: (values: FormData) => void;
}

export interface FormInstance {
  getFieldsValues: () => KV;
  getFieldValue: (field: string | string[]) => KV;
  resetFields: () => void;
  setFieldValue: (field: string | string[], value: unknown) => void;
  setFieldsValues: (values: KV) => void;
  validate: () => boolean | Promise<boolean>;
  submit: () => void;
}

export interface FormProps<
  FormData = any,
  FieldValue = FormData[keyof FormData],
  FieldKey = keyof FormData,
> {
  wrapper: ComponentType;
  form?: FormInstance;
  onChange?: (value: Partial<FormData>, values: Partial<FormData>) => void;
  onSubmit?: (values: FormData) => void;
}

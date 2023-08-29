export type KV<T = any> = Record<string, T>;

export interface Item {
  label: string;
}

export interface FormInstance {
  getFieldsValues: () => KV;
  getFieldValue: (field: string | string[]) => KV;
  resetFields: () => void;
  setFieldValue: (field: string | string[], value: unknown) => void;
  setFieldsValues: (values: KV) => void;
  validate: () => boolean | Promise<boolean>;
}

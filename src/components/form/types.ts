import { ReactElement, ReactNode } from 'react';
import { innerCallbackType } from './store';

export type KV<T = any> = Record<string, T>;

export type ComponentType = keyof JSX.IntrinsicElements | React.ComponentType<any>;
export type KeyType = string | number | symbol;

export interface Item {
  label: string;
}

export interface Callbacks<
  FormData = any,
  FieldValue = FormData[keyof FormData],
  FieldKey extends KeyType = keyof FormData,
> {
  onChange?: (value: Partial<FormData>, values: Partial<FormData>) => void;
  onSubmit?: (values: FormData) => void;
}

export interface StoreInternalMethods<
  FormData = any,
  FieldValue = FormData[keyof FormData],
  FieldKey extends KeyType = keyof FormData,
> {
  registerField: () => void;
  internalGetFieldValue: (field: string) => void;
  internalSetFieldValue: (field: string, value: any) => void;
  internalSetCallbacks: (
    callbacks: Pick<FormProps<FormData, FieldValue, FieldKey>, innerCallbackType>,
  ) => void;
}

export interface FormInstance<
  FormData = any,
  FieldValue = FormData[keyof FormData],
  FieldKey extends KeyType = keyof FormData,
> {
  getFieldsValues: () => KV;
  getFieldValue: (field: string) => KV;
  resetFields: () => void;
  setFieldValue: (field: string, value: unknown) => void;
  setFieldsValues: (values: KV) => void;
  validate: () => boolean | Promise<boolean>;
  submit: () => void;
  getInternalMethods: (key?: string) => StoreInternalMethods<FormData, FieldValue, FieldKey> | KV;
}

export interface FormProps<
  FormData = any,
  FieldValue = FormData[keyof FormData],
  FieldKey extends KeyType = keyof FormData,
> {
  wrapper?: ComponentType;
  form?: FormInstance;
  onChange?: (value: Partial<FormData>, values: Partial<FormData>) => void;
  onSubmit?: (values: FormData) => void;
}

export interface FormContextProps<
  FormData = any,
  FieldValue = FormData[keyof FormData],
  FieldKey extends KeyType = keyof FormData,
> {
  store?: FormInstance<FormData, FieldValue, FieldKey>;
}

export interface ControllableProps {
  value?: any;
  onChange?: (v?: any) => void;
}
export interface FormItemProps<
  FormData = any,
  FieldValue = FormData[keyof FormData],
  FieldKey extends KeyType = keyof FormData,
> {
  field?: FieldKey;
  label?: ReactNode;
  children?: ReactNode | ((props: ControllableProps) => ReactNode);
}

// validator
type StoreValue = any;

export type Validator = (
  rule: Rule,
  value: StoreValue,
  callback?: (error?: string) => void,
) => Promise<void | any> | void;

export type Rule = {
  required?: boolean;
  message?: string | ReactElement;
  validateTrigger?: string | string[];
  field: string;
  validator: Validator;
};

export type Rules = Record<string, Rule[]>;

export type PendingValidateData = Record<string, unknown>;

export type Error = {
  name: string;
  errors: Array<string | boolean>;
};
export type Errors = Error[];

export type Series = Record<string, { rule: Rule; value: unknown; source: PendingValidateData }[]>;

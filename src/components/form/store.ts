import { cloneDeep, get, set, has } from 'lodash';
import FormItem from './item';
import { FormProps, KV } from './types';

export const INTERNAL_METHODS_KEY = 'RC_FORM_INTERNAL_HOOKS';

export type innerCallbackType = 'onSubmit' | 'onChange';

export default class Store<
  FormData = any,
  FieldValue = FormData[keyof FormData],
  FieldKey = keyof FormData,
> {
  callbacks: Pick<FormProps<FormData, FieldValue, FieldKey>, innerCallbackType> = {};

  registerFields: FormItem[] = [];

  store = {};

  private registerField = (item: FormItem) => {
    this.registerFields.push(item);
    return () => {
      this.registerFields = this.registerFields.filter((x) => x !== item);
    };
  };

  private internalSetCallbacks = (
    callbacks: Pick<FormProps<FormData, FieldValue, FieldKey>, innerCallbackType>,
  ) => {
    this.callbacks = callbacks;
  };

  getInternalMethods(key?: string) {
    if (key === INTERNAL_METHODS_KEY) {
      return {
        registerField: this.registerField,
        internalSetCallbacks: this.internalSetCallbacks,
      };
    }
    return {};
  }

  getFieldsValues() {
    return cloneDeep(this.store);
  }

  getFieldValue(field: string | string[]) {
    if (has(this.store, field)) {
      return cloneDeep(get(this.store, field));
    }
  }

  private internalGetFieldValue(field: string | string[]) {
    if (has(this.store, field)) {
      return get(this.store, field);
    }
  }

  private internalSetFieldValue(field: string | string[], value: FieldValue) {
    if (!field) {
      return;
    }

    set(this.store, field, value);
  }

  setFieldValue(field: string | string[], value: unknown) {
    set(this.store, field, value);
  }

  setFieldsValues(values: KV) {
    this.store = cloneDeep(values);
  }

  resetFields() {
    this.store = {};
  }

  validate(): boolean | Promise<boolean> {
    return false;
  }

  submit() {}
}

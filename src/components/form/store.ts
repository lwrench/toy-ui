import { cloneDeep, get, set, has } from 'lodash';
import { KV } from './types';

export const INTERNAL_METHODS_KEY = 'RC_FORM_INTERNAL_HOOKS';

export default class Store {
  callbacks = {};

  registerFields = [];

  store = {};

  private registerField = (item) => {
    this.registerFields.push(item);
    return () => {
      this.registerFields = this.registerFields.filter((x) => x !== item);
    };
  };

  private setCallbacks = (callbacks: Callbacks) => {
    this.callbacks = callbacks;
  };

  getInternalMethods(key?: string) {
    if (key === INTERNAL_METHODS_KEY) {
      return {
        registerField: this.registerField,
        setCallbacks: this.setCallbacks,
      };
    }
  }

  getFieldsValues() {
    return cloneDeep(this.store);
  }

  getFieldValue(field: string | string[]) {
    if (has(this.store, field)) {
      return cloneDeep(get(this.store, field));
    }
  }

  resetFields() {
    this.store = {};
  }

  setFieldValue(field: string | string[], value: unknown) {
    set(this.store, field, value);
  }

  setFieldsValues(values: KV) {
    this.store = cloneDeep(values);
  }

  validate(): boolean | Promise<boolean> {
    return false;
  }

  submit() {}
}

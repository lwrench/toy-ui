import { cloneDeep, get, set, has } from 'lodash';
import { KV } from './types';

export default class Store {
  store = {};

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
}

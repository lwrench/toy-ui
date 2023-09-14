import { cloneDeep, get, set, has } from 'lodash';
import FormItem from './item';
import { FormProps, KV, KeyType } from './types';

export const INTERNAL_METHODS_KEY = 'RC_FORM_INTERNAL_HOOKS';

export type innerCallbackType = 'onSubmit' | 'onChange';

export type NotifyType = 'setFieldValue' | 'reset' | 'internalSetFieldValue';

export type ChangeInfoType<T> = {
  prev: any;
  field?: T;
  next?: Record<string, any>;
};
export default class Store<
  FormData = any,
  FieldValue = FormData[keyof FormData],
  FieldKey extends KeyType = keyof FormData,
> {
  callbacks: Pick<FormProps<FormData, FieldValue, FieldKey>, innerCallbackType> = {};

  registerFields: FormItem[] = [];

  store = {};

  public registerField = (item: FormItem) => {
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

  private triggerOnChange(value: Partial<FormData>) {
    if (value && Object.keys(value).length) {
      const { onChange } = this.callbacks;
      onChange && onChange(value, this.getFieldsValues());
    }
  }

  public getInternalMethods = (key?: string) => {
    if (key === INTERNAL_METHODS_KEY) {
      return {
        registerField: this.registerField,
        internalSetCallbacks: this.internalSetCallbacks,
        internalGetFieldValue: this.internalGetFieldValue,
        internalSetFieldValue: this.internalSetFieldValue,
      };
    }
    return {};
  };

  getFieldsValues = () => {
    return cloneDeep(this.store);
  };

  getFieldValue = (field: string) => {
    if (has(this.store, field)) {
      return cloneDeep(get(this.store, field));
    }
  };

  private internalGetFieldValue = (field: string) => {
    if (has(this.store, field)) {
      return get(this.store, field);
    }
  };

  private internalSetFieldValue = (field: string, value: FieldValue) => {
    if (!field) {
      return;
    }

    set(this.store, field, value);
    this.triggerOnChange({ [field]: value } as unknown as Partial<FormData>);
  };

  private notify = (type: NotifyType, info: ChangeInfoType<FieldKey>) => {
    this.registerFields.forEach((item) => {
      item.onStoreChange &&
        item.onStoreChange(type, {
          ...info,
        });
    });
  };

  setFieldValue = (field: string, value: unknown) => {
    set(this.store, field, value);
  };

  setFieldsValues = (values: KV) => {
    this.store = cloneDeep(values);
  };

  resetFields = () => {
    this.store = {};
  };

  validate = (): boolean | Promise<boolean> => {
    return false;
  };

  submit = () => {};
}

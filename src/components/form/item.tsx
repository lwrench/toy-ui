import React, { Component, ReactElement, ReactNode } from 'react';
import { FormContext } from './context';
import { ChangeInfoType, INTERNAL_METHODS_KEY, NotifyType } from './store';
import { ControllableProps, FormContextProps, FormItemProps, KeyType } from './types';

export function isFieldMatch(propsField: string, changedField: string) {
  return propsField === changedField;
}

export default class Item<
  FormData = any,
  FieldValue = FormData[keyof FormData],
  FieldKey extends KeyType = keyof FormData,
> extends Component<FormItemProps<FormData, FieldValue, FieldKey>> {
  static defaultProps = {
    trigger: 'onChange',
    triggerPropName: 'value',
  };

  private mounted = false;

  private removeRegisterField: null | (() => void) = null;

  static contextType = FormContext;

  context: FormContextProps<FormData, FieldValue, FieldKey> = {};

  constructor(props: FormItemProps<FormData, FieldValue, FieldKey>) {
    super(props);
  }

  public componentDidMount() {
    this.mounted = true;

    const { store } = this.context;
    if (store) {
      const innerMethods = store.getInternalMethods(INTERNAL_METHODS_KEY);
      this.removeRegisterField = innerMethods.registerField(this);
    }
  }

  public componentWillUnmount() {
    this.removeRegisterField && this.removeRegisterField();

    this.removeRegisterField = null;
    this.mounted = false;
  }

  public hasFieldProps = (): boolean => {
    return !!this.props.field;
  };

  private updateFormItem = () => {
    if (!this.mounted) return;
    this.forceUpdate();
  };

  public onStoreChange = (type: NotifyType, info: ChangeInfoType<FieldKey>) => {
    const { field: propsField } = this.props;

    switch (type) {
      case 'internalSetFieldValue':
        if (isFieldMatch(propsField as string, info.field as string)) {
          this.updateFormItem();
        }
    }
  };

  private getFieldValue = () => {
    const field = this.props.field;
    const store = this.context.store;
    console.log('getFieldValue', store);
    return field
      ? store?.getInternalMethods(INTERNAL_METHODS_KEY).internalGetFieldValue(field)
      : undefined;
  };

  private setFieldValue = (value: any) => {
    const store = this.context.store;
    const field = this.props.field;

    const internalSetFieldValue =
      store?.getInternalMethods(INTERNAL_METHODS_KEY).internalSetFieldValue;

    internalSetFieldValue && internalSetFieldValue(field, value);
  };

  public handleChange = (value: unknown) => {
    console.log('handleChange', value);
    this.setFieldValue(value);
  };

  getChild = () => {
    const { children } = this.props;
    let child = children;
    if (typeof children === 'function') {
      child = children({ value: this.getFieldValue(), onChange: this.handleChange });
    }
    return child as ReactNode;
  };

  renderControl = (children: ReactNode) => {
    const { store } = this.context;
    const child = React.Children.only(children) as ReactElement;

    const controllableProps: ControllableProps = {};
    controllableProps['onChange'] = this.handleChange;
    controllableProps['value'] = this.getFieldValue();

    return React.cloneElement(child, controllableProps);
  };

  render() {
    const { label, field } = this.props;

    let child = this.getChild();

    if (this.hasFieldProps() && React.Children.count(child) === 1) {
      child = this.renderControl(child);
    }

    return (
      <div className="form-item">
        <div className="form-item-label">
          <label>{label}:</label>
        </div>
        <div className="form-item-control">
          {child}
          <div className="form-item-control-message"></div>
        </div>
      </div>
    );
  }
}

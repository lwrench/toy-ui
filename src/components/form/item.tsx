import React, { Component } from 'react';
import { FormContext } from './context';
import { INTERNAL_METHODS_KEY } from './store';
import { FormContextProps, FormItemProps } from './types';

export default class Item<
  FormData = any,
  FieldValue = FormData[keyof FormData],
  FieldKey = keyof FormData,
> extends Component<FormItemProps<FormData, FieldValue, FieldKey>> {
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

  getChild = () => {
    const { children } = this.props;
    const { store } = this.context;
    let child = children;
    // if (isFunction(children)) {
    //   child = children(
    //     store.getFields(),
    //     {
    //       ...store,
    //     },
    //     this.props.isFormList && {
    //       value: this.getFieldValue(),
    //       onChange: this.handleTrigger,
    //     },
    //   );
    // }
    // this.childrenElement = child;
    return child;
  };

  render() {
    const { label, name } = this.props;

    const child = this.getChild();

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

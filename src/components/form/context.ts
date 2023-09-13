import { createContext, Context } from 'react';
import { FormContextProps } from './types';

const NOOP = () => {};

export const FormContext = createContext<FormContextProps>({
  store: {
    getFieldsValues: NOOP,
    getFieldValue: NOOP,
    resetFields: NOOP,
    setFieldValue: NOOP,
    setFieldsValues: NOOP,
    validate: NOOP,
    submit: NOOP,
    getInternalMethods: NOOP,
  } as any,
});

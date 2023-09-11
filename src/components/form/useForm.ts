import { useRef } from 'react';
import { FormInstance } from './types';
import Store from './store';

function getFormInstance(): FormInstance {
  const store = new Store();
  return {
    getFieldsValues: store.getFieldsValues,
    getFieldValue: store.getFieldValue,
    resetFields: store.resetFields,
    setFieldsValues: store.setFieldsValues,
    setFieldValue: store.setFieldValue,
    validate: store.validate,
    submit: store.submit,
  };
}

export default function useForm(form?: FormInstance) {
  const formRef = useRef(form);

  if (!formRef.current) {
    if (form) {
      formRef.current = form;
    } else {
      formRef.current = getFormInstance();
    }
  }

  return [formRef.current];
}

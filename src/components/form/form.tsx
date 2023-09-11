import React, { forwardRef, PropsWithChildren, useImperativeHandle } from 'react';
import { ComponentType, FormInstance, FormProps } from './types';
import useForm from './useForm';

function Form<
  FormData extends unknown = any,
  FieldValue = FormData[keyof FormData],
  FieldKey = keyof FormData,
>(props: PropsWithChildren<FormProps>, ref: React.Ref<FormInstance>) {
  const { wrapper: Wrapper = 'form', form, onChange, onSubmit } = props;

  const [formInstance] = useForm(form);

  useImperativeHandle(ref, () => {
    return formInstance;
  });

  return (
    <Wrapper
      onSubmit={(e: HTMLFormElement | any) => {
        e.preventDefault();
        e.stopPropagation();
        formInstance.submit();
      }}
    >
      {props.children}
    </Wrapper>
  );
}

export default forwardRef(Form);

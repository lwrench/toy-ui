import React, { forwardRef, PropsWithChildren, useImperativeHandle } from 'react';
import { ComponentType, FormInstance, FormProps } from './types';
import useForm from './useForm';
import { INTERNAL_METHODS_KEY } from './store';
import { FormContext } from './context';

function Form<
  FormData extends unknown = any,
  FieldValue = FormData[keyof FormData],
  FieldKey = keyof FormData,
>(props: PropsWithChildren<FormProps>, ref: React.Ref<FormInstance>) {
  const { wrapper: Wrapper = 'form', form, onChange, onSubmit } = props;

  const [formInstance] = useForm(form);

  const internalMethods = formInstance.getInternalMethods(INTERNAL_METHODS_KEY);

  internalMethods?.internalSetCallbacks({
    onChange: props.onChange,
    onSubmit: props.onSubmit,
  });

  useImperativeHandle(ref, () => {
    return formInstance;
  });

  const contextProps = {
    store: formInstance,
  };

  return (
    <FormContext.Provider value={contextProps}>
      <Wrapper
        onSubmit={(e: HTMLFormElement | any) => {
          e.preventDefault();
          e.stopPropagation();
          formInstance.submit();
        }}
      >
        {props.children}
      </Wrapper>
    </FormContext.Provider>
  );
}

export default forwardRef(Form);

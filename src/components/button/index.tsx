import React, { ReactNode, forwardRef, useRef } from 'react';
import { ButtonProps } from './interface';

function processChildren(children?: ReactNode) {
  return React.Children.map(children, (child) =>
    typeof child === 'string' || typeof child === 'number' ? <span>{child}</span> : child,
  );
}

function Button(props: ButtonProps, ref) {
  const {
    style,
    className,
    type,
    size,
    shape,
    disabled,
    loading,
    status,
    htmlType,
    icon,
    onClick,
  } = props;

  const iconNode = loading ? <IconLoading /> : icon;
  const innerButtonRef = useRef();
  const buttonRef = ref || innerButtonRef;

  return <button ref={buttonRef}></button>;
}

const ButtonComponent = forwardRef<unknown, ButtonProps>(Button);
ButtonComponent.displayName = 'Button';

export default ButtonComponent;

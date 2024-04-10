import { CSSProperties, ReactNode } from 'react';

export interface BaseButtonProps {
  style: CSSProperties;
  className: string | string[];
  type: 'default' | 'primary' | 'link';
  status: 'default' | 'waring' | 'danger' | 'success';
  size: 'small' | 'default' | 'large';
  shape: 'circle' | 'round' | 'square';
  disabled: boolean;
  loading: boolean;
  icon: ReactNode;
  onClick: (e: Event) => void;
  htmlType: 'button' | 'submit' | 'reset';
}

export type ButtonProps = Partial<BaseButtonProps>;

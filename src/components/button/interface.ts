export interface ButtonProps {
  type: 'default' | 'primary' | 'link';
  status: 'default' | 'waring' | 'danger' | 'success';
  size: 'small' | 'default' | 'large';
  shape: 'circle' | 'round' | 'square';
  disabled: boolean;
  loading: boolean;
}

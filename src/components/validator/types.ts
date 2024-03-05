import { ReactElement } from 'react';
import { defaultValidator } from './default';

export type StoreValue = any;

export type Validator = (
  rule: Rule,
  value: StoreValue,
  callback: (error?: Errors) => void,
  source: Record<string, unknown>,
) => Promise<void | any> | void;

export type Rule = {
  required?: boolean;
  type?: defaultValidator;
  message?: string | ReactElement;
  validateTrigger?: string | string[];
  field: string;
  validator: Validator;
};

export type Rules = Record<string, Rule[]>;

export type PendingValidateData = Record<string, unknown>;

export type Error = {
  name: string;
  errors: Array<string | boolean>;
};
export type Errors = Error[];

export type Series = Record<string, { rule: Rule; value: unknown; source: PendingValidateData }[]>;

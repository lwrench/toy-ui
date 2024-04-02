import string from './string';

const validator = {
  string,
};

export type defaultValidator = keyof typeof validator;
export default validator;

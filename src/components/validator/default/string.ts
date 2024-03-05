import { Errors, Rule, StoreValue, Validator } from '../types';

const string: Validator = (
  rule: Rule,
  value: StoreValue,
  callback: (errors?: Errors) => void,
  source: Record<string, unknown>,
) => {
  const errors: Errors = [];
  // 存在 required 或者不存在 required 但对应的字段有值的情况下都需要进行验证
  const validate =
    rule.required || (!rule.required && Object.prototype.hasOwnProperty.call(source, rule.field));
  if (validate) {
    if (!rule.required && (value === undefined || value === null || value === '')) {
      // 如果不存在 required 并且对应的字段值为空则通过验证
      return callback();
    } else if (
      rule.required &&
      (!Object.prototype.hasOwnProperty.call(source, rule.field) ||
        value === undefined ||
        value === null ||
        value === '')
    ) {
      // 如果存在 required 并且对应的字段值为空则不通过验证
      errors.push({ name: rule.field, errors: ['请输入内容'] });
    }
  }
  callback(errors);
};

export default string;

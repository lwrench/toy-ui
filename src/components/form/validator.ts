import { ReactElement } from 'react';
import { Errors, PendingValidateData, Rule, Rules, Series } from './types';

export class Schema {
  rules: Rules = {};
  constructor(descriptor: Rules) {
    this.define(descriptor);
  }

  define(rules: Rules) {
    this.rules = {};
    Object.keys(rules).forEach((name) => {
      const item = rules[name];
      // 将所有的字段策略都设置成数组类型
      this.rules[name] = Array.isArray(item) ? item : [item];
    });
  }

  validate(source_: PendingValidateData, callback: any) {
    const source = source_;
    const errors: Errors = [];

    const series: Series = {};
    const keys = Object.keys(this.rules);
    keys.forEach((z) => {
      // 字段中验证规则数组
      const arr = this.rules[z];
      // 对应的字段值
      const value = source[z];
      arr.forEach((r) => {
        const rule = r;
        rule.field = z;
        series[z] = series[z] || [];
        // 为每个验证策略配置对应的上下文内容，从而可以获取验证的规则，验证字段的值
        series[z].push({
          rule,
          value,
          source,
        });
      });
    });

    console.log('series', series);

    const seriesKeys = Object.keys(series);

    seriesKeys.forEach((sk) => {
      const arr = series[sk];
      arr.forEach((a) => {
        const { rule, value, source } = a;
        const result = rule?.validator(rule, value);
        const skErrors = errors?.[sk]?.errors.push({ name: sk, errors: [] });
      });
    });

    callback(errors);
  }
}

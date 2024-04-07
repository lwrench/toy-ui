import { Errors, PendingValidateData, Rule, Rules, Series } from './types';
import validator, { defaultValidator } from './default';

function asyncParallelArray(arr, func, callback) {
  // 每个字段需要验证的策略总数
  let total = 0;
  const results = [];
  // 计算字段策略的验证进度
  const count = (error) => {
    results.push(...(error || []));
    total++;
    // 等待每个字段策略中策略全部验证完毕再计算下一个字段的验证
    if (total === arr.length) {
      callback(results);
    }
  };
  // 遍历字段策略中的策略
  arr.forEach((a) => {
    func(a, count);
  });
}

function asyncMap(objArr: Series, func, callback) {
  const errors: Errors = [];
  const objArrKeys = Object.keys(objArr);
  const objArrLength = objArrKeys.length;
  // 需要验证的字段总数
  let total = 0;
  return new Promise((resolve, reject) => {
    // 计算字的验证进度，同时如果字段验证完毕则把相关结果返回
    const next = (error: Errors) => {
      errors.push(...error);
      // 等待每个字段策略中策略全部验证完毕再计算下一个字段的验证
      total++;
      // 当 total === objArrLength 的时候就是字段策略循环验证完毕的时候
      if (total === objArrLength) {
        // 同时执行回调函数，兼容不同的写法需求
        callback && callback(errors);
        // 如果存在错误则 reject 错误信息，否则就 resolve 表示成功
        errors.length ? reject(errors) : resolve(true);
      }
    };
    // 遍历执行验证每一个字段策略
    objArrKeys.forEach((key) => {
      const arr = objArr[key];
      asyncParallelArray(arr, func, next);
    });
  });
}

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
        rule.validator = this.getValidationMethod(rule);
        rule.field = z;
        series[z] = series[z] || [];
        series[z].push({
          rule,
          value,
          source,
        });
      });
    });

    console.log('series', series);

    // 验证每一个规则的函数
    function singleValidator(data, doIt) {
      const rule = data.rule;
      function cb(e = []) {
        let errorList = Array.isArray(e) ? e : [e];
        // 判断验证规则如果存在 message 字段则使用 message 字段的内容
        if (errorList.length && rule.message !== undefined) {
          errorList = [].concat(rule.message);
        }
        doIt(errorList);
      }
      // 执行校验策略函数的时候把对应的规则和需要校验的数据源也传递过去
      rule.validator(rule, data.value, cb, data.source);
    }

    return asyncMap(series, singleValidator, callback);
  }

  getValidationMethod(rule: Rule) {
    // 如果 validator 是函数，则使用配置的 validator 函数也就是自定义验证函数
    if (typeof rule.validator === 'function') {
      return rule.validator;
    }
    // 获取对应的验证函数类型，默认为 string
    const type: defaultValidator = rule.type || 'string';
    // 验证策略函数组 validators 中获取对应的验证函数，没有则为 undefined
    return validator[type] || undefined;
  }
}

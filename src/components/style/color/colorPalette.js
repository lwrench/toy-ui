/**
 * less plugin 是 less官方推荐的在less中使用js的方式，需要注意的是less version > 3.0，具体使用说明可以参考
 * https://lesscss.org/features/#import-atrules-feature
 *
 * color-palette 函数参考Arco Design
 * https://github.com/arco-design/color/blob/9e81e2c1e6a20f9fdf7b140f7d85cc6ba87bff6e/src/palette.js#L7
 */
module.exports = {
  install: function (less, pluginManager, functions) {
    functions.add('color-palette', function (color, index) {
      return generate(color.value, { index: index.value });
    });
  },
};

const Color = require('color');
const { getColorString } = require('./utils');

// 动态梯度算法
function colorPalette(originColor, i, format) {
  const color = Color(originColor);
  const h = color.hue();
  const s = color.saturationv();
  const v = color.value();

  const hueStep = 2;
  const maxSaturationStep = 100;
  const minSaturationStep = 9;

  const maxValue = 100;
  const minValue = 30;

  function getNewHue(isLight, i) {
    let hue;
    if (h >= 60 && h <= 240) {
      hue = isLight ? h - hueStep * i : h + hueStep * i;
    } else {
      hue = isLight ? h + hueStep * i : h - hueStep * i;
    }
    if (hue < 0) {
      hue += 360;
    } else if (hue >= 360) {
      hue -= 360;
    }
    return Math.round(hue);
  }

  function getNewSaturation(isLight, i) {
    let newSaturation;

    if (isLight) {
      newSaturation = s <= minSaturationStep ? s : s - ((s - minSaturationStep) / 5) * i;
    } else {
      newSaturation = s + ((maxSaturationStep - s) / 4) * i;
    }
    return newSaturation;
  }

  function getNewValue(isLight, i) {
    return isLight
      ? v + ((maxValue - v) / 5) * i
      : v <= minValue
      ? v
      : v - ((v - minValue) / 4) * i;
  }

  const isLight = i < 6;
  const index = isLight ? 6 - i : i - 6;

  const retColor =
    i === 6
      ? color
      : Color({
          h: getNewHue(isLight, index),
          s: getNewSaturation(isLight, index),
          v: getNewValue(isLight, index),
        });

  return getColorString(retColor, format);
}

// 动态梯度算法
function colorPaletteDark(originColor, i, format) {
  const lightColor = Color(colorPalette(originColor, 10 - i + 1));
  const originBaseColor = Color(originColor);

  const originBaseHue = originBaseColor.hue();
  const originBaseSaturation = originBaseColor.saturationv();
  const baseColor = Color({
    h: originBaseColor.hue(),
    s: getNewSaturation(6),
    v: originBaseColor.value(),
  });

  const baseSaturation = baseColor.saturationv();
  const step = Math.ceil((baseSaturation - 9) / 4);
  const step1to5 = Math.ceil((100 - baseSaturation) / 5);

  function getNewSaturation(_index) {
    if (_index < 6) {
      return baseSaturation + (6 - _index) * step1to5;
    }
    if (_index === 6) {
      if (originBaseHue >= 0 && originBaseHue < 50) {
        return originBaseSaturation - 15;
      }
      if (originBaseHue >= 50 && originBaseHue < 191) {
        return originBaseSaturation - 20;
      }
      if (originBaseHue >= 191 && originBaseHue <= 360) {
        return originBaseSaturation - 15;
      }
    }

    return baseSaturation - step * (_index - 6);
  }

  const retColor = Color({
    h: lightColor.hue(),
    s: getNewSaturation(i),
    v: lightColor.value(),
  });

  return getColorString(retColor, format);
}

/**
 * @param {string} color
 * @param {Object} options
 * @param {number} options.index 1 - 10 (default: 6)
 * @param {boolean} options.dark
 * @param {boolean} options.list
 * @param {string} options.format 'hex' | 'rgb' | 'hsl'
 *
 * @return string | string[]
 */
function generate(color, options = {}) {
  const { dark, list, index = 6, format = 'hex' } = options;

  if (list) {
    const list = [];
    const func = dark ? colorPaletteDark : colorPalette;
    for (let i = 1; i <= 10; i++) {
      list.push(func(color, i, format));
    }
    return list;
  }
  return dark ? colorPaletteDark(color, index, format) : colorPalette(color, index, format);
}

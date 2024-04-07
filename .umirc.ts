import path from 'path';
import { defineConfig } from 'dumi';

export default defineConfig({
  title: 'toy',
  favicon:
    'https://user-images.githubusercontent.com/9554297/83762004-a0761b00-a6a9-11ea-83b4-9c8ff721d4b8.png',
  logo: 'https://user-images.githubusercontent.com/9554297/83762004-a0761b00-a6a9-11ea-83b4-9c8ff721d4b8.png',
  outputPath: 'docs-dist',
  mode: 'doc',
  base: 'toy-ui',
  publicPath: '/toy-ui/',
  exportStatic: {},
  extraBabelPlugins: [
    [
      'babel-plugin-import',
      {
        libraryName: '@lwrench/toy-ui',
        camel2DashComponentName: false,
        customName: () => {
          return '../index.tsx';
        },
        customStyleName: (name) => {
          return '../style/index.scss';
        },
      },
      '@lwrench/toy-ui',
    ],
  ],
  webpack5: {},
  sass: {},
  // more config: https://d.umijs.org/config
});

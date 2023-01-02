import { defineConfig } from 'dumi';

export default defineConfig({
  title: 'toy',
  favicon:
    'https://user-images.githubusercontent.com/9554297/83762004-a0761b00-a6a9-11ea-83b4-9c8ff721d4b8.png',
  logo: 'https://user-images.githubusercontent.com/9554297/83762004-a0761b00-a6a9-11ea-83b4-9c8ff721d4b8.png',
  outputPath: 'docs-dist',
  mode: 'doc',
  // publicPath: './',
  exportStatic: {},
  // extraBabelPlugins: [
  //   [
  //     'import',
  //     {
  //       libraryName: '@lwrench/toy-ui',
  //       camel2DashComponentName: false,
  //       customStyleName: (name: string) => {
  //         console.error('name', name)
  //         return `./components/${name.toLowerCase()}/style/index.ts`; // 注意：这里 ./ 不可省略
  //       },
  //     },
  //     '@lwrench/toy-ui',
  //   ],
  // ],
  webpack5: {},
  // more config: https://d.umijs.org/config
});

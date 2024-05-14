import { defineConfig } from 'umi';

console.log('process.env.ENV', process.env.ENV);

export default defineConfig({
  title: 'XTools',
  base: '/XTools/',
  publicPath: '/XTools/',
  exportStatic: {},
  esbuildMinifyIIFE: true,
  define:{
    ENV: process.env.ENV
  },
  metas:[
    {
      keywords:'XTools,xtools,xutaotao,图片压缩,图片切割,Json格式化,在线工具,前端工具,前端开发,专注工具，助力高效,完全本地化工具,无需云端,不担心隐私泄露'
    }
  ]
});
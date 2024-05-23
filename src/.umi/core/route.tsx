// @ts-nocheck
// This file is generated by Umi automatically
// DO NOT CHANGE IT MANUALLY!
import routeProps from './routeProps';

if (process.env.NODE_ENV === 'development') {
  Object.entries(routeProps).forEach(([key, value]) => {
    const internalProps = ['path', 'id', 'parentId', 'isLayout', 'isWrapper', 'layout', 'clientLoader'];
    Object.keys(value).forEach((prop) => {
      if (internalProps.includes(prop)) {
        throw new Error(
          `[UmiJS] route '${key}' should not have '${prop}' prop, please remove this property in 'routeProps'.`
        )
      }
    })
  })
}

import React from 'react';

export async function getRoutes() {
  const routes = {"imageCompress/singleImageCompress":{"path":"imageCompress/singleImageCompress","id":"imageCompress/singleImageCompress","parentId":"@@/global-layout"},"imageCompress/batchImageCompress":{"path":"imageCompress/batchImageCompress","id":"imageCompress/batchImageCompress","parentId":"@@/global-layout"},"imageCompress/index":{"path":"imageCompress","id":"imageCompress/index","parentId":"@@/global-layout"},"imgFormatConversion":{"path":"imgFormatConversion","id":"imgFormatConversion","parentId":"@@/global-layout"},"colorConversion":{"path":"colorConversion","id":"colorConversion","parentId":"@@/global-layout"},"imgFilter/index":{"path":"imgFilter","id":"imgFilter/index","parentId":"@@/global-layout"},"jsonFormatting":{"path":"jsonFormatting","id":"jsonFormatting","parentId":"@@/global-layout"},"imageSlicing":{"path":"imageSlicing","id":"imageSlicing","parentId":"@@/global-layout"},"jsonDiff":{"path":"jsonDiff","id":"jsonDiff","parentId":"@@/global-layout"},"imgScan":{"path":"imgScan","id":"imgScan","parentId":"@@/global-layout"},"chrono":{"path":"chrono","id":"chrono","parentId":"@@/global-layout"},"index":{"path":"/","id":"index","parentId":"@@/global-layout"},"home":{"path":"home","id":"home","parentId":"@@/global-layout"},"@@/global-layout":{"id":"@@/global-layout","path":"/","isLayout":true}} as const;
  return {
    routes,
    routeComponents: {
'imageCompress/singleImageCompress': React.lazy(() => import(/* webpackChunkName: "src__pages__imageCompress__singleImageCompress" */'../../../src/pages/imageCompress/singleImageCompress.tsx')),
'imageCompress/batchImageCompress': React.lazy(() => import(/* webpackChunkName: "src__pages__imageCompress__batchImageCompress" */'../../../src/pages/imageCompress/batchImageCompress.tsx')),
'imageCompress/index': React.lazy(() => import(/* webpackChunkName: "src__pages__imageCompress__index" */'../../../src/pages/imageCompress/index.tsx')),
'imgFormatConversion': React.lazy(() => import(/* webpackChunkName: "src__pages__imgFormatConversion" */'../../../src/pages/imgFormatConversion.tsx')),
'colorConversion': React.lazy(() => import(/* webpackChunkName: "src__pages__colorConversion" */'../../../src/pages/colorConversion.tsx')),
'imgFilter/index': React.lazy(() => import(/* webpackChunkName: "src__pages__imgFilter__index" */'../../../src/pages/imgFilter/index.tsx')),
'jsonFormatting': React.lazy(() => import(/* webpackChunkName: "src__pages__jsonFormatting" */'../../../src/pages/jsonFormatting.tsx')),
'imageSlicing': React.lazy(() => import(/* webpackChunkName: "src__pages__imageSlicing" */'../../../src/pages/imageSlicing.tsx')),
'jsonDiff': React.lazy(() => import(/* webpackChunkName: "src__pages__jsonDiff" */'../../../src/pages/jsonDiff.tsx')),
'imgScan': React.lazy(() => import(/* webpackChunkName: "src__pages__imgScan" */'../../../src/pages/imgScan.tsx')),
'chrono': React.lazy(() => import(/* webpackChunkName: "src__pages__chrono" */'../../../src/pages/chrono.tsx')),
'index': React.lazy(() => import(/* webpackChunkName: "src__pages__index" */'../../../src/pages/index.tsx')),
'home': React.lazy(() => import(/* webpackChunkName: "src__pages__home" */'../../../src/pages/home.tsx')),
'@@/global-layout': React.lazy(() => import(/* webpackChunkName: "layouts__index" */'/Users/xutaotao/Documents/s/XTools/src/layouts/index.tsx')),
},
  };
}

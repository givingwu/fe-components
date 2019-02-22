# fe-components
This repository used to collect all react/jquery/vue/* components previously i wrote.

## Components List
### React
#### React Components
  + [BMap](./src/react/components/BMap/index.js) 之前编写的跟百度地图相关的组件。
    + [LazyloadMap](./src/react/components/BMap/LazyloadMap.jsx) 懒加载百度地图API的组件。
    + [Location](./src/react/components/BMap/Location.jsx) 获取用户地理信息组件，先调用 `getLocationByGeo`，然后才回退到`getLocationByIP`。
    + [DrivingRoute](./src/react/components/BMap/DrivingRoute.jsx) 传入起点(start)、终点(end)、途径点(waypoints)绘制驾车路线组件。
    + [AutoCompleteInput](./src/react/components/BMap/AutoCompleteInput.jsx) 顾名思义。
  + [Calendar](./src/react/components/Calendar/index.jsx) 简单的 React Calendar 的组件，可基于此实现更高级扩展的功能。
  + [ColorCollect](./src/react/components/ColorCollect/index.jsx) 利用 webWorker 收集图片颜色的组件。
  + *[ColorGradient](./src/react/components/ColorGradient/index.jsx) 自动渐变，暂未实现。
  + [ListView](./src/react/components/ListView/index.jsx) ListView 组件的实现。
  + [MobilePreview](./src/react/components/MobilePreview/index.jsx) 提供一个 iPhone 外壳内部自填充 `children` 元素的容器组件。
  + [Placeholder](./src/react/components/Placeholder/index.jsx) 炫酷的 CSS 实现的 `Placeholder` 效果。
  + [TreeView](./src/react/components/TreeView/index.jsx)
  + [TransitionFade](./src/react/components/TransitionFade/index.jsx)
  + [Turntable](./src/react/components/Turntable/index.jsx) 大转盘的组件。
  + [WarningError](./src/react/components/WarningError/index.jsx) ant-mobile 组件。

#### React HOC
  + [withLazyLoadMap](./src/react/hoc/withLazyLoadMap/index.jsx) 高阶组件版实现。
  + *[withUrlOpts](./src/react/hoc/withUrlOpts/index.jsx) 不建议使用，仅供参考。
#### React Multiple Pages
  RoadHog + Webpack，参考 [code](./src/react/ReactMultiPagesConfig/webpack.config.js) 查看详情。

### Vue
#### Vue Components
  + [Vue-Table-Tree](https://github.com/vuchan/vue-tree-table) Vue Table + Tree 的实现。
  + [Vue-Virtual-List](https://github.com/vuchan/vue-virtual-list) Vue 虚拟滚动列表的实现。
  + [ ] TODO: Vue-Virtual-Tree

### jQuery
#### jQuery Components
  + [CheckBox](./src/jquery/CheckBox/index.js) 没什么好说的，JS实现的自定义 Checkbox。
  + [InputNumber](./src/jquery/InputNumber/index.js) 电商购物车加减按钮，功能丰富。支持 最大、最下、浮点数、步长等。
  + [OpacityBanner](./src/jquery/OpacityBanner/index.js) 电商首页透明切换等banner，类 [tmall](https://www.tmall.com) 首页 banner 效果。
  + [PreviewSwitcher](./src/jquery/PreviewSwitcher/index.js) 电商商品详情页，动态切换预览图。
  + [CategoryMenu](./src/jquery/CategoryMenu/index.js) 电商 懒加载 种类菜单列表，优化首屏渲染很有效果，支持服务端数据和本地数据。
  + *[Cascader](./src/jquery/Cascader/index.js) 电商切换区域的级联选择器，实现中ing...
  + *[LazyLoadDOM](./src/jquery/LazyLoadDOM/index.js) 电商客户端渲染，根据用户交互懒加载特定的 DOM 节点。


## The questions previously met
0. [js 语法错误，编译不报错，阻塞在进度条步骤](https://github.com/ant-design/ant-design-pro/issues/1520)
1. [win7 在npm run build时一直停留在91% additional asset processing](https://github.com/iview/iview-admin/issues/295)
2. [fix: import from lost dep will cause 100% cpu](https://github.com/umijs/umi/pull/526)
3. [yarn start一直卡在roadhog server不动](https://github.com/sorrycc/roadhog/issues/647)
4. [FAQ: dev/build 卡死、慢、CPU 100% 等问题](https://github.com/umijs/umi/issues/521)

## Thanks
License MIT.

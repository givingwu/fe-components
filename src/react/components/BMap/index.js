/**
 * Inspired from [`react-bmap`](https://github.com/huiyan-fe/react-bmap)
 * 1. Does not need to install any Unusable and Complex dependecies.
 * 2. Let Driving Route supports wayPoints.
 * 3. Lazyload BMap lib JS SDK.
 * 4. Only keep four components.
 * 5. Same API with `react-bmap`.
 * @author Vuchan(givingwu@gmail.com)
 */

/**
 * 地图基础组件
 */
export { default as BMap } from './Map';
export { default as LazyloadMap } from './LazyloadMap';

/**
 * 常用场景组件
 */
export { default as Location } from './Location';
export { default as DrivingRoute } from './DrivingRoute';
export { default as AutoCompleteInput } from './AutoCompleteInput';

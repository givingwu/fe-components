/**
 * @class LazyloadMap
 * @description lazy loading BMap
 * @author Vuchan(givingwu@gmail.com)
 */
import React from 'react';
import PropTypes from 'prop-types';
import { loadScript } from './utils';

export default class LazyloadMap extends React.Component {
  static propTypes = {
    // 懒加载相关
    loading: PropTypes.oneOfType([PropTypes.string, PropTypes.element]), // loading effects
    url: PropTypes.string, // SDK url
    onload: PropTypes.func, // load success
    onfail: PropTypes.func, // load failed
  }

  static defaultProps = {
    loading: '加载地图中...', // string | ReactNode
    url: 'http://api.map.baidu.com/api?v=2.0&ak=71vwhDVH0K9gfrx2qL3NSdR9Pq3lxbEF&callback=initializeBMap',
    onload: () => {},
    onfail: (e) => { alert(`加载地图失败，请重试: ${e}；`); },
  }

  static timer = null;
  static record = 0;

  static initialized() {
    const timeout = 1e4;

    return new Promise((resolve, reject) => {
      if (
        window.BMap &&
        typeof window.BMap === 'object' &&
        !('apiLoad' in window.BMap)
      ) {
        resolve(window.BMap);
      } else {
        // 如果timer已经被初始化则重置 不开启N个无头尾的timer
        if (LazyloadMap.timer) {
          clearInterval(LazyloadMap.timer);
        }

        LazyloadMap.timer = setInterval(() => {
          LazyloadMap.record += 10;

          if (
            window.BMap &&
            typeof window.BMap === 'object' &&
            !('apiLoad' in window.BMap)
          ) {
            resolve(window.BMap);
            clearInterval(LazyloadMap.timer);
          }

          if (LazyloadMap.record >= timeout) {
            clearInterval(LazyloadMap.timer);
            reject(new Error('加载超时， 请重试'));
          }
        }, 10);
      }
    });
  }

  state = {
    loaded: false
  }

  async componentWillMount() {
    const { url, onload, onfail } = this.props;
    const onLoadSuccess = () => {
      this.setState({
        loaded: true,
      }, () => {
        onload && onload(window.BMap);
      });
    };

    if (!window.BMap) {
      try {
        console.time('componentWillMount:await-load-Bmap-used');
        await loadScript(url);
        await LazyloadMap.initialized();
        console.timeEnd('componentWillMount:await-load-Bmap-used');

        onLoadSuccess(window.BMap);
      } catch (e) {
        onfail && onfail(e instanceof Error ? e : new Error(e));
      }
    } else {
      onLoadSuccess(window.BMap);
    }
  }

  componentWillUnmount() {
    LazyloadMap.timer = null;
    LazyloadMap.record = 0;
  }

  render() {
    return this.state.loaded ? this.props.children : this.props.loading;
  }
}

// flag to records whether BMap SDK was initialized,
// if it did BMap will be an object
window.BMap = undefined;

// 在 loadScript(url) 后server并不会返回实际SDK代码 而是返回了如下的 JavaScript
// 所以用一个定时器listening `loaded` 属性并在 loaded 后释放 await 的 yield
/* (function () {
  window.BMap_loadScriptTime = (new Date).getTime();
  window.BMap = window.BMap || {};
  window.BMap.apiLoad = function () {
    delete window.BMap.apiLoad;
    if (typeof initializeBMap == "function") {
      initializeBMap()
    }
  };
  var s = document.createElement('script');
  s.src = 'http://api.map.baidu.com/getscript?v=2.0&ak=71vwhDVH0K9gfrx2qL3NSdR9Pq3lxbEF&services=&t=20180629105706';
  document.body.appendChild(s);
})(); */
// 废弃
// 改成使用 直接回调形式 window.initializeBMap = Map.prototype.initialize;
window.initializeBMap = LazyloadMap.initialized;

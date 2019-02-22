/**
 * @class LazyloadMap
 * @HOC   withLazyLoadMap
 * @author Vuchan(givingwu@gmail.com)
 */
import React from 'react';
import PropTypes from 'prop-types';
import { loadScript } from './utils';

export default function withLazyLoadMap(WrappedComponent) {
  return class Map extends React.Component {
    static propTypes = {
      // 懒加载相关
      lazyLoadSDK: PropTypes.bool, // open lazy load
      url: PropTypes.string, // SDK url
      onLoad: PropTypes.func, // load success
      onFail: PropTypes.func, // load failed
      loading: PropTypes.oneOfType([PropTypes.string, PropTypes.element]), // loading effects
    }

    static defaultProps = {
      lazyLoadSDK: true,
      url: 'http://api.map.baidu.com/api?v=2.0&ak=71vwhDVH0K9gfrx2qL3NSdR9Pq3lxbEF&callback=initializeBMap',
      loading: '加载地图中...', // string | ReactNode
      onLoad: () => {},
      onFail: (e) => { alert(`加载地图失败，请重试: ${e}；`); },
    }

    static initialized() {
      const timeout = 30 * 1e3; // 30s
      let record = 10;

      return new Promise((resolve, reject) => {
        if (
          window.BMap &&
          typeof window.BMap === 'object' &&
          !('apiLoad' in window.BMap)
        ) {
          resolve(window.BMap);
        } else {
          let timer = setInterval(() => {
            record += 10;

            if (
              window.BMap &&
              typeof window.BMap === 'object' &&
              !('apiLoad' in window.BMap)
            ) {
              // onSuccess();
              resolve(window.BMap);
              clearInterval(timer);
            }

            if (record >= timeout) {
              clearInterval(timer);
              reject(new Error('加载超时， 请重试'));
            }
          }, 10);
        }
      });
    }

    async componentWillMount() {
      const { lazyLoadSDK, url, onLoad, onFail } = this.props;

      if (lazyLoadSDK && !window.BMap) {
        try {
          await loadScript(url);
          await Map.initialized();

          this.setState({
            loaded: true,
          }, () => {
            onLoad && onLoad(window.BMap);
          });
        } catch (e) {
          onFail && onFail(e);
        }
      } else if (!window.BMap) {
        throw new ReferenceError('window.BMap is not defined!');
      } else {
        onLoad && onLoad(window.BMap);
      }
    }

    async componentDidMount() {
      await Map.initialized();
    }

    render() {
      return this.state.loaded ? <WrappedComponent /> : this.props.loading;
    }
  };
};

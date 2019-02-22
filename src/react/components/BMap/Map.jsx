import * as React from 'react';
import PropTypes from 'prop-types';
import { bindEvent, bindToggleMethods, getOptions } from './utils';


export default class Map extends React.Component {
  static propTypes = {
    onload: PropTypes.func,
    autoCenter: PropTypes.bool, // 优先使用 center, center无效才会使用 autoCenter
    // TODO: http://lbsyun.baidu.com/jsdemo.htm#b0_7 定位控件

    // other API see following link:
    // https://github.com/huiyan-fe/react-bmap/blob/master/src/components/map.md
    center: PropTypes.oneOfType([PropTypes.string, PropTypes.shape({
        lng: PropTypes.number.isRequired,
        lat: PropTypes.number.isRequired
      })
    ]),
    zoom: PropTypes.number,
    minZoom: PropTypes.number,
    maxZoom: PropTypes.number,
    style: PropTypes.object,
    mapStyle: PropTypes.string,
  }

  static defaultProps = {
    autoCenter: true,
    center: '',
    zoom: 10,
    minZoom: 3,
    maxZoom: 19,
    style: {},
    mapStyle: JSON.stringify(''),
    onload: (map) => { console.log(' Map initialized success', map); }
  }

  static get events() {
    return [
      'click',
      'dblclick',
      'rightclick',
      'rightdblclick',
      'maptypechange',
      'mousemove',
      'mouseover',
      'mouseout',
      'movestart',
      'moving',
      'moveend',
      'zoomstart',
      'zoomend',
      'addoverlay',
      'addcontrol',
      'removecontrol',
      'removeoverlay',
      'clearoverlays',
      'dragstart',
      'dragging',
      'dragend',
      'addtilelayer',
      'removetilelayer',
      'load',
      'resize',
      'hotspotclick',
      'hotspotover',
      'hotspotout',
      'tilesloaded',
      'touchstart',
      'touchmove',
      'touchend',
      'longpress'
    ];
  }

  static get toggleMethods() {
    return {
      enableScrollWheelZoom: ['enableScrollWheelZoom', 'disableScrollWheelZoom'],
      enableDragging: ['enableDragging', 'disableDragging'],
      enableDoubleClickZoom: ['enableDoubleClickZoom', 'disableDoubleClickZoom'],
      enableKeyboard: ['enableKeyboard', 'disableKeyboard'],
      enableInertialDragging: ['enableInertialDragging', 'disableInertialDragging'],
      enableContinuousZoom: ['enableContinuousZoom', 'disableContinuousZoom'],
      enablePinchToZoom: ['enablePinchToZoom', 'disablePinchToZoom'],
      enableAutoResize: ['enableAutoResize', 'disableAutoResize'],
    };
  }

  static get options() {
    return [
      'minZoom',
      'maxZoom',
      'mapType',
      'enableMapClick'
    ];
  }

  componentDidMount() {
    const { center, autoCenter } = this.props;

    if (!center && autoCenter) {
      this.getLocation();
    }

    this.initMap();
    this.forceUpdate();
  }

  componentDidUpdate(prevProps) {
    const preCenter = prevProps.center;
    const center = this.props.center;

    if (typeof center === 'string') { // 可以传入城市名
      if (preCenter !== center) {
        this.map.centerAndZoom(center);
      }
    } else {
      const isCenterChanged = (preCenter && center && preCenter.lng !== center.lng) || preCenter.lat !== center.lat || this.props.forceUpdate;
      const isZoomChanged = (prevProps.zoom !== this.props.zoom && this.props.zoom) || this.props.forceUpdate;
      const center = new window.BMap.Point(center.lng, center.lat);

      if (isCenterChanged && isZoomChanged) {
        this.map.centerAndZoom(center, this.props.zoom);
      } else if (isCenterChanged) {
        this.map.setCenter(center);
      } else if (isZoomChanged) {
        this.map.zoomTo(this.props.zoom);
      }
    }
  }

  getLocation = () => {
    const self = this;
    const { zoom } = this.props;
    const geolocation = new window.BMap.Geolocation(); // http://lbsyun.baidu.com/jsdemo.htm#b0_7

    geolocation.getCurrentPosition(function gotLocalPos(r) {
      if (this.getStatus() === window.BMAP_STATUS_SUCCESS) {
        const point = r.point;

        self.map.panTo(point);
        self.map.setCenter(point);
        self.map.centerAndZoom(point, zoom);
      } else {
        getLocalCity();
      }
    }, {
      enableHighAccuracy: true
    });

    function getLocalCity() {
      const city = new window.BMap.LocalCity();

      city.get((r) => {
        const cityName = r.name;

        self.map.setCenter(cityName);
        self.map.centerAndZoom((r.point || cityName), zoom);
      });
    }
  }

  // 创建Map实例
  initMap = () => {
    let options = Map.options;
    options = getOptions.call(this, options);

    if (this.props.enableMapClick !== true) {
      options.enableMapClick = false;
    }

    const map = new window.BMap.Map(this.refs.map, options);
    this.props.onload(map);
    this.map = map;

    if (this.props.mapStyle) {
      map.setMapStyle(this.props.mapStyle);
    }

    const zoom = this.props.zoom;

    // 在 centerAndZoom() 之前执行事件绑定否则load无法正常触发
    bindEvent.call(this, map, Map.events);

    if (typeof this.props.center === 'string') { // 可以传入城市名
      map.centerAndZoom(this.props.center);
    } else { // 正常传入经纬度坐标
      let center = new window.BMap.Point(this.props.center.lng, this.props.center.lat);
      map.centerAndZoom(center, zoom); // 初始化地图,设置中心点坐标和地图级别
    }

    bindToggleMethods.call(this, map, Map.toggleMethods);

    let lastZoom = zoom;
    map.addEventListener('zoomend', () => {
      let zoom = map.getZoom();
      this.props.zoom_changed && this.props.zoom_changed(zoom, lastZoom);

      lastZoom = zoom;
    });
  }

  renderChildren = () => {
    const { children } = this.props;

    if (!children || !this.map) return;

    return React.Children.map(children, (child) => {
      if (!child) return;
      if (typeof child.type === 'string') {
        return child;
      } else {
        return React.cloneElement(child, {
          map: this.map,
        });
      }
    });
  }

  onRender = () => {
    if (!this.props.render || !this.map) {
      return;
    }

    return this.props.render(this.map);
  }

  render() {
    const style = {
      height: '100%',
      position: 'relative',
      ...this.props.style,
    };

    return (
      <div style={style}>
        <div ref="map" className={this.props.className} style={{ height: '100%' }}>加载地图中...</div>

        {this.renderChildren()}
        {this.onRender()}
      </div>
    );
  }
}

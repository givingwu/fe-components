/**
 * Customized Form item Input
 * Could use with `rc-form` and `ant-from`
 */
import React from 'react';
import PropTypes from 'prop-types';
// import { Input } from 'antd';
// import { geneBMapPoint } from './utils';

const descMap = {
  start: '请输入起点',
  waypoint: '请输入途径点位置',
  end: '请输入终点',
};

export default class AutoCompleteInput extends React.Component {
  static propTypes = {
    type: PropTypes.oneOf(['start', 'end', 'waypoint']).isRequired,
    className: PropTypes.string,
    style: PropTypes.object,
    autoComplete: PropTypes.bool,
    map: PropTypes.object.isRequired,
    name: PropTypes.string,
    onAutoComplete: PropTypes.func,
    onSearchFail: PropTypes.func,
  }

  static defaultProps = {
    // type: 'waypoint',
    className: '',
    style: {},
    name: 'auto-complete-input',
    autoComplete: true,
    onAutoComplete: () => {},
    onSearchFail: addr => alert(`${addr || '地图'}无法解析到结果!`),
  }

  state = {
    value: {
      lng: 0,
      lat: 0,
      address: '',
    },
  }

  marker = null;

  componentWillMount() {
    this.geo = new window.BMap.Geocoder();
  }

  componentDidMount() {
    const self = this;
    const { type, autoComplete, onAutoComplete, onSearchFail } = this.props;

    // TODOs: 增加非 `BMap.Autocomplete` 的支持，
    // 根据debounce后的用户的输入address 去获取 Point
    if (autoComplete) {
      // this.setPointMarker();
      this.autoCompleteInput = new window.BMap.Autocomplete({
        input: this.refs.input,
        location: this.props.map
      });
      this.autoCompleteInput.addEventListener('onconfirm', (event) => {
        // the newest map reference
        let { province, city, district, business, street, streetNumber } = event.item.value;
        let address = province + city + district + business + street + streetNumber;

        this.geo.getPoint(address, (point) => {
          const { map } = this.props;
          if (!point) {
            return onSearchFail(address);
          }

          // clear previous marker
          if (self.marker) {
            map.removeOverlay(self.marker);
          }

          const marker = new window.BMap.Marker(point);
          map.centerAndZoom(point, 12);
          map.addOverlay(marker);
          self.marker = marker;

          point = {
            ...point,
            address,
            type,
          };

          this.onChange(point);
          onAutoComplete && onAutoComplete(point);
        });
      });
    }
  }

  componentWillReceiveProps(nextProps) {
    // Should be a controlled component.
    if ('value' in nextProps) {
      const value = nextProps.value;

      if (value) {
        this.setState({ value });
      }
    }
  }

  componentDidUpdate(props) {
    const { value, map } = props;

    if (Object.keys(map).lenght && value && value.lat && value.lng && !this.marker) {
      const point = new window.BMap.Point(value.lng, value.lat);
      const marker = new window.BMap.Marker(point);

      map.centerAndZoom(point, 12);
      map.addOverlay(marker);

      this.marker = marker;
    }
  }

  componentWillUnmount = () => {
    if (this.marker) {
      this.props.map.removeOverlay(this.marker);
    }

    this.marker = null;
    this.geo = null;
  }

  onChange = (value) => {
    /* console.log('onChange====================================');
    console.trace(value);
    console.log('onChange===================================='); */

    if (!value.address) {
      value.lat = 0;
      value.lng = 0;

      // clear previous marker
      if (this.marker) {
        this.props.map.removeOverlay(this.marker);
      }
    }

    this.setState({
      value,
    }, () => {
      this.props.onChange(value);
    });
  }

  render() {
    const { style, name, type, map, className } = this.props;
    const { value } = this.state;

    return (
      <input
        className={className}
        ref="input"
        name={name}
        onChange={e => this.onChange({ address: e.target.value })}
        disabled={!map}
        style={style}
        value={value && typeof value === 'object' ? value.address : ''}
        placeholder={descMap[type]}
      />
    );
  }
}

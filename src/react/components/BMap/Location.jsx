import React, { Component } from 'react'
import PropTypes from 'prop-types'

export default class Location extends Component {
  static propTypes = {
    children: PropTypes.array.isRequired
  }

  state = {
    address: null
  }

  componentDidMount = () => {
    this.map = this.props.map;
    this.getLocation()
  }

  // 浏览器定位
  getLocationByGeo = () => {
    if (!window.BMap) {
      throw new Error('BMap is not an Object.');
    }

    return new Promise((resolve, reject) => {
      const geoLocation = new window.BMap.Geolocation();

      geoLocation.enableSDKLocation();
      geoLocation.getCurrentPosition(function getCurrPos(r) {
        if (this.getStatus() === window.BMAP_STATUS_SUCCESS) {
          resolve(r);
        } else {
          reject();
        }
      });
    });
  }

  getLocationByIP = () => {
    if (!window.BMap) {
      throw new Error('BMap is not an Object.');
    }

    return new Promise((resolve) => {
      const localCity = new window.BMap.LocalCity();
      localCity.get((r) => { resolve(r); });
    });
  };

  getLocation = async () => {
    try {
      const r = await getLocationByGeo();
      return Promise.resolve(r);
    } catch (e) {
      const r = await getLocationByIP();
      return Promise.resolve(r);
    }
  };

  render() {
    return children;
  }
}

import React from 'react';
import PropTypes from 'prop-types';

export default class DrivingRoute extends React.PureComponent {
  static propTypes = {
    // 起点
    start: PropTypes.shape({
        lng: PropTypes.number,
        lat: PropTypes.number,
      }),
    // 终点
    end: PropTypes.shape({
      lng: PropTypes.number,
      lat: PropTypes.number,
    }),
    // 途径点 [Point, Point, Point]
    waypoints: PropTypes.array,
    onSearchSuccess: PropTypes.func,
    onSearchFail: PropTypes.func,
  }

  /**
   * 设置默认的props属性
   */
  static defaultProps = {
    start: '',
    end: '',
    waypoints: [],
    onSearchSuccess: (info) => { console.log(`获取驾驶路线成功${JSON.stringify(info)}`); },
    onSearchFail: (msg) => { console.log(msg); },
  }

  componentDidUpdate() {
    this.initialize();
  }

  componentDidMount() {
    this.initialize();
  }

  componentWillUnmount() {
    this.destroy();
  }

  destroy() {
    this.driving && this.driving.clearResults();
    this.driving = null;
  }

  initialize() {
    const self = this;
    const { map, onSearchSuccess, onSearchFail, start, waypoints, end } = this.props;

    if (!map || !(start && end)) {
      return;
    }

    this.destroy();

    // clear all overlays in map and resets it
    if (map.getOverlays().length) {
      map.clearOverlays();
      // map.reset();
    }

    const driveInfomation = {
      distance: 0,
      time: 0
    };

    this.driving = new window.BMap.DrivingRoute(map, {
      renderOptions: {
        map,
        policy: this.props.policy || window.BMAP_DRIVING_POLICY_LEAST_TIME,
        autoViewport: true,
      },
      onSearchComplete: function onComplete(results) {
        if (!self.driving || !self.driving.getStatus) return;
        if (self.driving && self.driving.getStatus() !== window.BMAP_STATUS_SUCCESS) {
          return onSearchFail('获取行车路线失败！');
        }

        const plan = results.getPlan(0);

        driveInfomation.time = plan.getDuration(true);
        driveInfomation.distance = plan.getDistance(true);

        onSearchSuccess(driveInfomation);
      },
    });


    let startPoint = '';
    let endPoint = '';
    let wayPoints = [];

    if (start.lng && start.lat) {
      startPoint = new window.BMap.Point(start.lng, start.lat);
    }

    if (waypoints && waypoints.length) {
      waypoints.forEach((point, index) => {
        if (point && typeof point === 'object' && point.lng && point.lat) {
          wayPoints[index] = new window.BMap.Point(point.lng, point.lat);
        } else {
          wayPoints[index] = null;
        }
      });
    }

    if (end.lng && end.lat) {
      endPoint = new window.BMap.Point(end.lng, end.lat);
    }

    if (
      startPoint &&
      endPoint &&
      (startPoint instanceof window.BMap.Point) &&
      (endPoint instanceof window.BMap.Point)
    ) {
      this.driving.search(startPoint, endPoint, {
        waypoints: wayPoints.filter(t => t && t instanceof window.BMap.Point),
      });
    }
  }

  render() {
    return null;
  }
}

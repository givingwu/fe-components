import * as React from 'react';

interface Point {
  lat: string;
  lng: string;
}

interface MapProps {
  center?: String | Point,
  zoom?: Number,
  minZoom?: Number,
  maxZoom?: Number,
  style?: CSSStyleDeclaration,
  enableMapClick?: boolean,
  enableScrollWheelZoom?: boolean,
  enableDragging?: boolean,
  enableDoubleClickZoom?: boolean,
  enableKeyboard?: boolean,
  enableInertialDragging?: boolean,
  enableContinuousZoom?: boolean,
  enablePinchToZoom?: boolean,
  enableAutoResize?: boolean,
  events: WindowEventMap
}

export default class Map extends React.Component<MapProps, any> {
  static defaultProps: {
    autoCenter: boolean,
    center?: string,
    zoom?: number,
    minZoom?: number,
    maxZoom?: number,
    style?: object,
    mapStyle?: string | object,
    onload?: () => void,
  }
  static get events(): () => array
  static get toggleMethods(): () => array
  static get options(): () => array
  componentDidMount:() => void
  componentDidUpdate:() => void
  getLocation:() => void
  componentDidUpdate:() => void
  initMap:() => void
  renderChildren(): JSX.Element;
  render(): JSX.Element
}

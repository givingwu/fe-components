import React from 'react'
import PropTypes from 'prop-types'
import { capitalize } from 'feewee/utils'
import ColorWorker from './colorCollectWorker.js';

console.log('Worker: ', ColorWorker);
// create new worker
const worker = new Worker(ColorWorker)
console.log(Worker, Worker.prototype, worker);


/**
 * 收集图片颜色
 * @description 给出一张图片 去除图片的所有色值 然后返回色值的map => { [keyN]: RGBAKey: val: RGBAVal }
 * @param {Object} { img: string }
 */
class ColorCollect extends React.Component {
  static propTypes = {
    src: PropTypes.string.isRequired
  }

  state = {
    error: null
  }

  events = [
    'load',
    'error'
  ]

  // eslint-disable-next-line
  componentWillMount = () => {
    const { src  } = this.props
    const image = new Image(src)
    image.src = src
    image.crossOrigin = "Anonymous"
    image.setAttribute('crossOrigin', '')

    console.log(image);

    this.img = image
    this.events.map(type => {
      this.img.addEventListener(type, this['on' + capitalize(type)], false)
    })
  }

  componentDidMount = () => {
  }

  componentWillUnmount = () => {
    this.events.map(type => {
      this.img.removeEventListener(type, this['on' + capitalize(type)])
    })
    this.img = this.events = null
  }

  onLoad = async () => {
    try {
      this.setState({
        colorMap: await this.calcColorRatio()
      }, () => {
        console.log('colorMap: ', this.state.colorMap);
      })
    } catch (error) {
      this.onError(error)
    }
  }

  onError = (error) => {
    this.setState({ error: error.message || '' })
  }

  calcColorRatio = () => {
    const { width, height } = this.img
    // const needPos = this.props.needPos

    const canvas = document.createElement('canvas')
    const context = canvas.getContext('2d')

    canvas.width = width;
    canvas.height = height;

    // canvas无法绘制8位的灰度图，只能绘制32位的图片，所以获取像素信息也只能获取32位的图片。
    context.drawImage(this.img, 0, 0, width, height)
    const { data } = context.getImageData(0, 0, width, height)

    return new Promise((resolve, reject) => {
      // // create new worker
      // const worker = new Worker(ColorWorker)
      // console.log(Worker, Worker.prototype, worker);

      worker.postMessage({
        type: 'startWorker',
        payload: data,
      })

      worker.addEventListener('message', function workerListener(event) {
        resolve(event.data)
        worker.terminate()
      })

      worker.addEventListener('error', (event) => {
        reject(event ? event.message || event.data || event : 'Worker error!')
        this.onError(event ? event.message || event.data || event : 'Worker error!')
      })
    })
  }

  renderChildren = () => {
    const { children, render, ...props } = this.props;
    const { error, colorMap } = this.state;
    const isEmptyChildren = children => React.Children.count(children) === 0;

    if (render) return render(props);
    if (typeof children === "function") return children({
      error,
      colorMap,
      ...props
    });
    if (children && !isEmptyChildren(children)) return React.Children.only(children);

    return null;
  }

  render() {
    let { children } = this.props;
    const { error, colorMap } = this.state;
    children = this.renderChildren(children);

    if (React.isValidElement(children)) {
      children = React.cloneElement(children, {
        colorMap,
        error,
      })
    }

    return (
      error || children
    )
  }
}

export default ColorCollect

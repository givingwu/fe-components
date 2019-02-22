/**
 * Inpired from `https://juejin.im/post/5992b6065188257dd3664dbc`
 * and Github `https://github.com/lijinke666/react-turntable`
 * thanks for those guys!
 */
import React, { PureComponent } from "react"
import PropTypes from "prop-types"

const defaultFontStyle = {
  color: "#9d3f0a",
  size: "16px",
  fontWeight: "bold",
  fontVertical: false,
  fontFamily: "Helvetica, Arial"
}

export function easeOut(t, b, c, d) {
  if ((t /= d / 2) < 1) return c / 2 * t * t + b;
  return -c / 2 * ((--t) * (t - 2) - 1) + b;
}

export default class ReactTurntable extends PureComponent {
  static propTypes = {
    className: PropTypes.string,
    width: PropTypes.number,
    height: PropTypes.number,
    padding: PropTypes.number,

    // 奖品数组
    prizes: PropTypes.array.isRequired,
    // 当收到外部传入的 prizeId 时，则在随机的 endTime 内结束选中，同时提醒用户所中的该奖项
    // 否则会无限滚动下去，不会开奖，不会停止。直到外部通知 prizeId 为止。
    prizeId: PropTypes.number,

    // pointer
    pointerEle: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.node
    ]),

    primaryColor: PropTypes.string,
    secondaryColor: PropTypes.string,

    speed: PropTypes.number,
    duration: PropTypes.number,

    onStart: PropTypes.func,
    onComplete: PropTypes.func,
    // onDraw: PropTypes.func,

    fontVertical: PropTypes.bool,
    fontStyle: PropTypes.object,
    transition: PropTypes.bool, // transition animation
    degree: PropTypes.number,
    canvasStyle: PropTypes.object,
  }

  static defaultProps = {
    className: 'turntable-wrapper',
    width: 500,
    height: 500,
    padding: 0,

    speed: 1000, //旋转速度
    duration: 5000, //旋转时间

    prizes: [],

    clickEle: "",
    pointerEle: "Click",

    primaryColor: '#ffd8c2',
    secondaryColor: '#ffe9dc',

    fontStyle: defaultFontStyle,
  }

  constructor(props) {
    super(props)
    this.canvas = null
    this.ctx = null
    this.animateId = null
    this.state = {
      isRotate: false,
      startRotate: 0,
    }
  }

  componentWillMount() {
    if (typeof this.props.getRef === 'function') {
      this.props.getRef(this)
    }

    if (this.props.prizes.length < 2) {
      throw new Error('options prizes It needs to be an array , Not less than two')
    }
  }

  componentDidMount() {
    this.compatibilityFrame()
    const { width, height, prizes, padding } = this.props

    this.prizes = prizes
    this.startRotate = 0
    this.rotateTime = 0
    this.rotateAllTime = 0
    this.rotateChange = 0

    this.ctx = this.canvas.getContext('2d')
    this.canvas.width = width
    this.canvas.height = height

    // award radiuas
    this.awardRotate = (Math.PI * 2) / prizes.length

    // canvas center(x, y)
    this.centerX = this.canvas.width / 2
    this.centerY = this.canvas.height / 2

    // radius
    this.R = this.canvas.width / 2 - padding

    this.TEXT_R = this.R - 50
    this.INSERT_R = 0
    this.drawTurntable()
  }

  componentWillUnmount() {
    this.destroyContext()
  }

  destroyContext() {
    window.cancelAnimationFrame(this.animateId)
    delete this.canvas
    delete this.ctx
    delete this.prizes
    delete this.startRotate
    delete this.rotateTime
    delete this.rotateAllTime
    delete this.rotateChange
    delete this.awardRotate
    delete this.centerX
    delete this.centerY
    delete this.R
    delete this.TEXT_R
    delete this.INSERT_R
  }

  drawTurntable() {
    const ctx = this.ctx
    ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)

    const {
      primaryColor,
      secondaryColor,
      // onDraw,
      fontStyle: propsFontStyle,
    } = this.props

    const {
      color,
      size,
      fontWeight,
      fontVertical,
      fontFamily,
    } = {
      ...defaultFontStyle,
      ...propsFontStyle
    }

    for (let [i, prize] of this.prizes.entries()) {
      const prizeText = typeof prize === 'string' ? prize : prize.name
      const _currentStartRotate = this.startRotate + this.awardRotate * i
      const _currentEndRotate = _currentStartRotate + this.awardRotate
      prize.degree = [Math.ceil(_currentStartRotate * 180 / Math.PI), Math.ceil(_currentEndRotate * 180 / Math.PI)]

      this.ctx.save()
      i % 2 === 0 ?
        ctx.fillStyle = primaryColor :
        ctx.fillStyle = secondaryColor
      ctx.beginPath()
      ctx.arc(this.centerX, this.centerY, this.R, _currentStartRotate, _currentEndRotate, false)
      ctx.arc(this.centerX, this.centerY, this.INSERT_R, _currentEndRotate, _currentStartRotate, true)
      ctx.fill()
      ctx.closePath()
      ctx.restore()

      ctx.save()
      ctx.beginPath()
      ctx.font = `${fontWeight} ${/.*px$/.test(size) ? size : size + 'px'} ${fontFamily}`

      ctx.fillStyle = color
      ctx.textBaseline = "middle"
      const currentX = Math.cos(_currentStartRotate + this.awardRotate / 2) * this.TEXT_R
      const currentY = Math.sin(_currentStartRotate + this.awardRotate / 2) * this.TEXT_R

      ctx.translate(
        this.centerX + currentX,
        this.centerY + currentY
      )
      ctx.rotate(_currentStartRotate + this.awardRotate / 2 + Math.PI / 2);

      const maxFontWidth = currentY / (this.TEXT_R / 2)
      const { width: fontWidth } = ctx.measureText(prizeText)

      if (fontVertical === true) {
        ctx.translate(0, Math.min(fontWidth, 25))
        ctx.rotate(90 / 180 * Math.PI)
      }

      ctx.fillText(prizeText, -fontWidth / 2, 0)

      ctx.closePath()
      ctx.restore()
    }

    // reset position
    // ctx.save()
    // move to the center of the canvas
    // ctx.translate(this.canvas.width / 2, this.canvas.height / 2);
    // ctx.beginPath()
    // ctx.rotate(-(90 / 180 * Math.PI))
    // rotate the canvas to the specified degrees
    // ctx.rotate(-90 * Math.PI / 180);

    // we’re done with the rotating so restore the unrotated context
    // ctx.restore();

    // // onDraw && onDraw(this.prizes);
  }

  rotateTurntable = () => {
    this.rotateTime += 20
    if (this.rotateTime >= this.rotateAllTime) {
      const prize = this.getSelectedPrize()
      this.setState({
        isRotate: false
      })
      this.props.onComplete && this.props.onComplete(prize)
      return
    }

    let _rotateChange = (
      this.rotateChange - easeOut(this.rotateTime, 0, this.rotateChange, this.rotateAllTime)
    ) * (Math.PI / 180)
    this.startRotate += _rotateChange
    this.drawTurntable()

    this.animateId = requestAnimationFrame(this.rotateTurntable)
  }

  getSelectedPrize = () => {
    let startAngle = this.startRotate * 180 / Math.PI,
      awardAngle = this.awardRotate * 180 / Math.PI,

      pointerAngle = 90,
      overAngle = (startAngle + pointerAngle) % 360,
      restAngle = 360 - overAngle,

      index = Math.floor(restAngle / awardAngle)

    return this.prizes[index]
  }

  compatibilityFrame() {
    window.requestAnimFrame = (() => {
      return window.requestAnimationFrame ||
        window.webkitRequestAnimationFrame ||
        window.mozRequestAnimationFrame ||
        ((callback) => window.setTimeout(callback, 1000 / 60))
    })()
    window.cancelAnimationFrame = window.cancelAnimationFrame || window.mozCancelAnimationFrame
  }

  onStartRotate = () => {
    if (this.state.isRotate) return
    const { speed, duration, onStart, transition, degree } = this.props

    onStart && onStart()

    if (transition) {
      this.setState({
        /* style: {
          transition: `transform ${duration}s ease-out`,
          transform: `rotate(${degree}deg)`,
        }, */
        isRotate: true,
      });
      return;
    }

    this.setState({
      isRotate: true
    }, () => {
      this.rotateTime = 0
      this.rotateAllTime = Math.random() * 5 + duration
      this.rotateChange = Math.random() * 10 + speed / 100
      this.rotateTurntable()
    })
  }

  transitionEnd = (event) => {
    // console.log('====================================');
    // console.log(event, event.propertyName, event.pseudoElement, event.elapsedTime);
    // console.log('====================================');
    if (event.propertyName !== "transform") return;
    const { onComplete, transition } = this.props;

    this.setState({
      isRotate: false,
    })

    transition && onComplete && onComplete();
  }

  render() {
    const { className, canvasStyle, pointerEle, width, height, transition, onComplete } = this.props

    return (
      <div className={className} style={{ width, height }}>
        <canvas style={canvasStyle} ref={(node) => this.canvas = node} onTransitionEnd={this.transitionEnd} />
        <div className="pointer-wrapper" onClick={this.onStartRotate}>{pointerEle}</div>
      </div>
    )
  }
}

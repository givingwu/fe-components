import $, { extend, isFunction, noop } from 'jquery'

const defaults = {
  ele: '.J_InputNumber',
  input: '.J_NumberInput',
  plusBtn: '.J_NumberPlus',
  minusBtn: '.J_NumberMinus',
  disabledCls: 'disabled',
  float: false,
  max: 99999999,
  min: 0,
  step: 0,
  currentValue: 0,
  callback: noop
}

const ACTIONS = {
  PLUS: 1,
  CHANGE: 0,
  MINUS: -1
}

class InputNumber {
  constructor (options) {
    this.options = extend(defaults, options)
    const { ele, plusBtn, input, minusBtn, currentValue } = this.options
    this.$ele = $(ele)
    this.$input = this.$ele.children(input)
    this.$plusBtn = this.$ele.children(plusBtn)
    this.$minusBtn = this.$ele.children(minusBtn)
    this.currentValue = +this.$input.val() || currentValue

    this.checkState()
    this.bindEvents()
  }

  checkState (nextValue) {
    nextValue = nextValue !== undefined ? nextValue : this.currentValue
    const { min, max, disabledCls } = this.options
    const gtMax = nextValue >= max
    const ltMin = nextValue <= min
    const disabledPlus = this.$plusBtn.hasClass(disabledCls)
    const disabledMinus = this.$minusBtn.hasClass(disabledCls)

    if (gtMax) {
      if (!disabledPlus) {
        this.$plusBtn.addClass(disabledCls)
      }
    } else {
      if (disabledPlus) {
        this.$plusBtn.removeClass(disabledCls)
      }
    }

    if (ltMin) {
      if (!disabledMinus) {
        this.$minusBtn.addClass(disabledCls)
      }
    } else {
      if (disabledMinus) {
        this.$minusBtn.removeClass(disabledCls)
      }
    }
  }

  bindEvents () {
    const self = this
    const { float } = this.options

    self.$plusBtn.click(function () {
      let value = self.getNextVal(ACTIONS.PLUS)

      self.$input.val(value)
      self.$input.attr('value', value)
    })

    self.$minusBtn.click(function () {
      let value = self.getNextVal(ACTIONS.MINUS)

      self.$input.val(value)
      self.$input.attr('value', value)
    })

    self.$input.on('change input', function (e) {
      let nextValue = e.target.value
      let isNumber = /^\d*$/.test(nextValue)

      if (isNumber) {
        if (!float) {
          if (!Number.isInteger(nextValue)) {
            nextValue = parseInt(nextValue)
          }
        }
      } else {
        nextValue = +nextValue.replace(/[^0-9]/g, '')
      }

      let value = self.getNextVal(ACTIONS.CHANGE, nextValue)

      self.$input.val(value)
      self.$input.attr('value', value)
    })
  }

  getNextVal (action, nextValue) {
    nextValue = nextValue !== undefined ? nextValue : this.currentValue
    const { min, max, step } = this.options

    if (Number.isNaN(nextValue)) {
      return 0
    }

    if (action === ACTIONS.PLUS) {
      nextValue = step ? nextValue - step : ++nextValue
    } else if (action === ACTIONS.MINUS) {
      nextValue = step ? nextValue - step : --nextValue
    }

    const gtMax = nextValue > max
    const ltMin = nextValue <= min

    if (gtMax) {
      nextValue = max
    }

    if (ltMin) {
      nextValue = min
    }

    this.execute(nextValue)

    return nextValue
  }

  execute (nextValue) {
    if (this.currentValue !== nextValue) {
      this.currentValue = nextValue
      this.checkState(nextValue)
      this.options.callback(nextValue)
    }
  }
}

$.fn.inputNumber = function $inputNumber (options = {}) {
  return this.each(function () {
    return new InputNumber(
      isFunction(options) ? {
        ...options,
        callback: options,
        ele: this
      } : {
        ...options,
        ele: this
      }
    )
  })
}

// Initialize .J_InputNumber with callback function
export default $(() => {
  return $('.J_InputNumber').inputNumber(function callback (value) {
    console.log(value)
  })
})

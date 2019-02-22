import $, { extend, isFunction, noop } from 'jquery'

const defaults = {
  ele: '.J_OpacityBanner',
  item: '.J_OpacityBannerItem',
  nav: '.J_OpacityBannerNav',
  activeCls: 'active',
  disabledCls: 'disabled',
  currentIndex: 0,
  defaultBackgroundColor: '#2B37E0',
  triggerEvents: 'mouseover click',
  duration: 3000,
  toggleDuration: 300,
  callback: noop
}

class OpacityBanner {
  constructor (options) {
    this.options = extend(defaults, options)
    const { ele, item, currentIndex, nav } = this.options

    this.$ele = $(ele)
    this.$items = this.$ele.find(item)
    this.$navs = this.$ele.find(nav)
    this.currentIndex = currentIndex || 0

    this.checkState()
    this.bindEvents()
    this.updateActiveByIndex(this.currentIndex)
  }

  checkState () {
    const self = this

    this.$items.each(function () {
      const $item = $(this)

      $item.css({
        backgroundColor: self.getColor($item)
      })
    })
  }

  bindEvents () {
    const { triggerEvents, nav } = this.options
    const selectorPrefixReg = /^(\.|#)/
    const navCls = nav.replace(selectorPrefixReg, '')

    this.$navs.on(triggerEvents, e => {
      let $target = $(e.target)
      let isNav = $target.hasClass(navCls)

      console.log("$currentItem.children('div').on('mouseleave'), isNav: ", isNav, 'index: ', this.getIndex($target))

      if (isNav) {
        this.updateActiveByIndex(this.getIndex($target), true)
      }
    })
  }

  updateActiveByIndex (nextIndex, forceUpdate) {
    if (isNaN(+nextIndex) || nextIndex < 0 || nextIndex === this.currentIndex) return
    console.trace('updateActiveByIndex', nextIndex)

    nextIndex = nextIndex >= this.$items.length ? 0 : nextIndex

    if (forceUpdate && this.timeoutId) {
      this.timeoutId = clearTimeout(this.timeoutId)
    }

    const { toggleDuration } = this.options
    const $currentItem = this.$items.eq(nextIndex)
    const $currentNav = this.$navs.eq(nextIndex)

    this.onEvents($currentItem)

    $currentItem.show()
    $currentItem.animate({
      zIndex: 1,
      opacity: 1
    },
    toggleDuration,
    () => {
      this.handleComplete($currentItem, $currentNav, nextIndex)
    })
  }

  handleComplete ($currentItem, $currentNav, nextIndex) {
    const { options: { activeCls, duration } } = this

    $currentItem
      .addClass(activeCls)
      .siblings()
      .hide()
      .removeClass(activeCls)
    $currentNav
      .addClass(activeCls)
      .siblings()
      .removeClass(activeCls)

    this.timeoutId = setTimeout(() => {
      clearTimeout(this.timeoutId)
      this.offEvents($currentItem)
      this.updateActiveByIndex(++nextIndex)
    }, duration)
    this.execute(nextIndex)
  }

  onEvents ($currentItem) {
    /* https://javascript.info/mousemove-mouseover-mouseout-mouseenter-mouseleave#extra-mouseout-when-leaving-for-a-child */
    $currentItem.children('div').on('mouseenter', (e) => {
      console.log("$currentItem.children('div').on('mouseenter')")
      let $target = $(e.target)
      const tagName = $target.prop('tagName')
      const isChildDiv = tagName === 'DIV'
      const isChildImg = tagName === 'IMG'

      if (isChildDiv || isChildImg) {
        if (this.timeoutId) {
          this.timeoutId = clearTimeout(this.timeoutId)
        }
      }
    })

    $currentItem.children('div').on('mouseleave', (e) => {
      console.log("$currentItem.children('div').on('mouseleave')")
      let $target = $(e.target)
      const tagName = $target.prop('tagName')
      const isChildDiv = tagName === 'DIV'
      const isChildImg = tagName === 'IMG'

      if (isChildDiv || isChildImg) {
        if (!this.timeoutId) {
          this.timeoutId = setTimeout(() => {
            clearTimeout(this.timeoutId)
            this.offEvents($currentItem)
            this.updateActiveByIndex(++this.currentIndex)
          }, this.options.duration)
        }
      }
    })
  }

  offEvents ($currentItem) {
    $currentItem.children('div').off()
  }

  getIndex ($item) {
    const attrIdx = $item.attr('data-index')
    const DOMIndex = $item.index()

    if (attrIdx !== undefined && !isNaN(+attrIdx)) {
      return +attrIdx
    }

    return DOMIndex
  }

  getColor ($item) {
    return $item.attr('data-background-color') || this.options.defaultBackgroundColor
  }

  execute (nextIndex) {
    if (this.currentIndex !== nextIndex) {
      this.currentIndex = nextIndex
      this.options.callback(nextIndex)
    }
  }
}

$.fn.initOpacityBanner = function $initOpacityBanner (options = {}) {
  return this.each(function () {
    return new OpacityBanner(
      isFunction(options)
        ? {
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

// Initialize .J_OpacityBanner with callback function
$(() => {
  $('.J_OpacityBanner').initOpacityBanner(
    (v) => console.log(v)
  )
})

export default OpacityBanner

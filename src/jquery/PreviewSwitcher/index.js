import $, { extend, isFunction, noop } from 'jquery'

window.pageConfig = window.pageConfig || {}
window.pageConfig.images = window.pageConfig.images || []

const defaults = {
  ele: '.J_Preview',
  item: '.J_PreviewItem',
  itemGap: 18,
  itemsWrapper: '.J_PreviewItems',
  itemsListWrapper: '.J_PreviewItemsList',
  nav: '.J_PreviewNav',
  prevBtn: '.J_PreviewPrev',
  nextBtn: '.J_PreviewNext',
  activeEle: '.J_PreviewCurrent > img',
  activeCls: 'active',
  disabledCls: 'disabled',
  triggerEvents: 'mouseover',
  currentIndex: 0,
  getOriginUrl: ($currentImage) => $currentImage.attr('data-origin'),
  fallbackUrl: require('assets/image/placeholder.png'),
  callback: noop
}

class PreviewSwitcher {
  constructor (options) {
    this.options = extend(defaults, options)
    const {
      ele,
      item,
      itemsWrapper,
      itemsListWrapper,
      nav,
      prevBtn,
      nextBtn,
      activeEle,
      currentIndex
    } = this.options

    this.$ele = $(ele)

    if (prevBtn) {
      this.$prevBtn = this.$ele.find(prevBtn)
    }
    if (nextBtn) {
      this.$nextBtn = this.$ele.find(nextBtn)
    }

    this.$nav = this.$ele.find(nav)
    this.$activeEle = this.$ele.find(activeEle)
    this.$items = this.$ele.find(item)

    if (this.$items.length) {
      this.$itemsWrapper = this.$ele.find(itemsWrapper)
      this.$itemsListWrapper = this.$ele.find(itemsListWrapper)
      this.currentIndex = currentIndex || 0

      this.initLayout()
      this.checkState()
      this.bindEvents()
      this.updateActiveByIndex(this.currentIndex)
    } else {
      this.$nav.addClass('hide')
    }
  }

  initLayout () {
    const { itemGap } = this.options
    this.wrapperWidth = this.$itemsWrapper.width()
    this.perItemWidth = this.$items.outerWidth() + itemGap
    this.allItemsWidth = this.$items.length * this.perItemWidth

    const { allItemsWidth, wrapperWidth } = this

    if (allItemsWidth > wrapperWidth + itemGap) {
      this.$itemsListWrapper.width(allItemsWidth)
    } else {
      this.$prevBtn && this.$prevBtn.addClass('hide')
      this.$nextBtn && this.$nextBtn.addClass('hide')
    }

    itemGap && this.$items.css({
      'margin-right': itemGap + 'px'
    })
  }

  checkState (nextLeftWidth) {
    const { disabledCls } = this.options
    const needDisablePrev = this.isMinOffset(nextLeftWidth)
    const needDisableNext = this.isMaxOffset(nextLeftWidth)
    const disabledPrev = this.$prevBtn.hasClass(disabledCls)
    const disabledNext = this.$nextBtn.hasClass(disabledCls)

    if (needDisablePrev) {
      if (!disabledPrev) {
        this.$prevBtn.addClass(disabledCls)
      }
    } else {
      if (disabledPrev) {
        this.$prevBtn.removeClass(disabledCls)
      }
    }

    if (needDisableNext) {
      if (!disabledNext) {
        this.$nextBtn.addClass(disabledCls)
      }
    } else {
      if (disabledNext) {
        this.$nextBtn.removeClass(disabledCls)
      }
    }
  }

  bindEvents () {
    const self = this
    const { perItemWidth } = this
    const { item, disabledCls, triggerEvents } = this.options
    const itemCls = item.replace(/^(\.|#)/, '')

    this.$prevBtn && this.$prevBtn.click(function click () {
      const disabled = $(this).hasClass(disabledCls)
      if (disabled) return

      const currLeftWidth = self.offsetLeft()
      const nextLeftWidth = currLeftWidth + perItemWidth

      self.$itemsListWrapper.animate({
        left: '+=' + perItemWidth
      })

      if (self.isMinOffset(currLeftWidth)) {
        $(this).addClass(disabledCls)
      } else {
        self.checkState(nextLeftWidth)
      }
    })

    this.$nextBtn && this.$nextBtn.click(function click () {
      const disabled = $(this).hasClass(disabledCls)
      if (disabled) return

      const currLeftWidth = self.$itemsListWrapper.position().left
      const nextLeftWidth = currLeftWidth - perItemWidth

      self.$itemsListWrapper.animate({
        left: '-=' + perItemWidth
      })

      if (self.isMaxOffset(currLeftWidth)) {
        $(this).addClass(disabledCls)
      } else {
        self.checkState(nextLeftWidth)
      }
    })

    this.$itemsListWrapper.on(triggerEvents, function mouseover (e) {
      let $target = $(e.target)
      const isImg = $target.prop('tagName') === 'IMG'
      const isLi = $target.prop('tagName') === 'LI'
      let isItem = !isImg && isLi && $target.hasClass(itemCls)

      if (isImg) {
        $target = $target.parent()
        isItem = $target.hasClass(itemCls)
      }

      if (isItem) {
        self.updateActiveByIndex(self.$items.index($target), true)
      }
    })
  }

  offsetLeft () {
    return this.$itemsListWrapper.position().left
  }

  isMinOffset (nextLeftWidth) {
    nextLeftWidth = nextLeftWidth !== undefined ? nextLeftWidth : this.offsetLeft()

    return nextLeftWidth === 0
  }

  isMaxOffset (nextLeftWidth) {
    nextLeftWidth = nextLeftWidth !== undefined ? nextLeftWidth : this.offsetLeft()
    const { allItemsWidth, wrapperWidth, options: { itemGap } } = this
    const maxOffset = allItemsWidth - wrapperWidth - itemGap

    return Math.abs(nextLeftWidth) >= maxOffset
  }

  updateActiveByIndex (nextIndex, updateEle) {
    const { activeCls } = this.options
    const $currentItem = this.$items.eq(nextIndex)

    $currentItem.addClass(activeCls).siblings().removeClass(activeCls)

    if (updateEle) {
      const $currentImage = $currentItem.children('img')
      const { getOriginUrl, fallbackUrl } = this.options
      const originUrl = getOriginUrl($currentImage) || fallbackUrl

      this.$activeEle.attr('src', originUrl)
      this.execute(nextIndex, originUrl)
    }
  }

  execute (nextIndex) {
    if (this.currentIndex !== nextIndex) {
      this.currentIndex = nextIndex
      this.options.callback(nextIndex)
    }
  }
}

$.fn.previewSwitcher = function $previewSwitcher (options = {}) {
  return this.each(function () {
    return new PreviewSwitcher(
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

// Initialize .J_Preview with callback function
export default PreviewSwitcher

import { loadScript as lazyloadScript, isFunction } from 'feewee/utils';
import { WX_JS_SDK } from 'utils/api';

export const loadWxJsSDK = function(cb) {
  function ready() {
    /**
     * window.__wxjs_environment
     * 在微信浏览器中 => 'browser'
     * 在微信小程序中 => 'miniprogram'
     * 在非微信环境中 => undefined
     */
    return isFunction(cb) ? cb(window.__wxjs_environment) : window.__wxjs_environment
  }

  return lazyloadScript(WX_JS_SDK).then(() => {
    if (!window.WeixinJSBridge || !window.WeixinJSBridge.invoke) {
      return document.addEventListener('WeixinJSBridgeReady', ready, false)
    } else {
      return ready()
    }
  }).catch(e => {
    console.error(e)
  })
}
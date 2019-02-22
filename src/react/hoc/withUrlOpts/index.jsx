import React, { Fragment } from 'react';
import DocumentTitle from 'react-document-title';
import { Spin } from 'antd';
import { Toast, WhiteSpace, Button } from 'antd-mobile';
import Error from 'components/WarningError';
import FloatingIcon from 'components/FloatingIcon';
import { isObject, isFunction, isString } from 'feewee/utils';
import { getQueryStringWrapper, getDisplayName, checkOptionsByKeys, getValueByGivenPathFromObject } from 'utils';
import { loadWxJsSDK } from './api';
import { MP_ENV, WX_H5_ENV } from 'utils/api';


const ERROR_WITH_REQUEST_MSG = '请求错误，请检查'
const DEFAULT_TITLE = 'DEFAULT_TITLE'


/**
 * @author vuchan<givingwu@gmail.com>
 * @description h5页面配置的UrlOpts HOC
 */
export default ({
  urlOptions = {}, //`object` url 中默认的 params: object
  pageTitle = DEFAULT_TITLE,
  titleKeyPath = 'title',
  showLoading = undefined,
  requestMethod,  //`func` 请求回调
  transformData, //`func` 自定义转义data函数
  requestLoadingText, //`string` 请求时候提示的文字内容
  requestErrorContent = ERROR_WITH_REQUEST_MSG, // `string | node` 请求错误的warning/error文字
  responseWholeDown = true, //`bool` 整体解构下传，还是以一个 `response` 为 `props` 下传
  checkUrlOptions = false, //`bool` 是否强制检查 options
  checkRequiredKeys = [],
  checkRequiredErrMsg = '',
  showFloatingIconInMiniProgram = true,
  showShareIconInMiniProgram = false,
}) => WrappedComponent => {
  if (showLoading === undefined) {
    if (isFunction(requestMethod)) {
      showLoading = true;
    }
  }

  return class withURLOpts extends React.PureComponent {
    static displayName = `withURLOpts(${getDisplayName(WrappedComponent)})`

    state = {
      loading: showLoading,
    }

    // instance properties
    options = null
    // flag to only execute `checkUrlOptions` once
    checkedUrlOptions = false

    componentDidMount = async () => {
      if (checkUrlOptions) {
        if (this.checkOptions()) {
          this.executeRequest()
        } else {
          this.setState({
            loading: false,
            ERROR_MSG: checkRequiredErrMsg,
          })
        }
      } else {
        this.executeRequest()
      }

      const env = await loadWxJsSDK((platform) => {
        this.isMiniProgram = platform === MP_ENV;
        this.isWeXinBrowser = platform === WX_H5_ENV;

        this.setState({
          isMiniProgram: this.isMiniProgram,
          isWeXinBrowser: this.isWeXinBrowser,
        })

        return platform;
      });

      this.isMiniProgram = env === MP_ENV;
      this.isWeXinBrowser = env === WX_H5_ENV;
    }

    executeRequest = () => {
      const ctx = WrappedComponent;
      const { onRequestSuccess, onRequestFailed } = ctx;
      const config = { hideLoading: true } // 因为界面上已经有了首屏渲染的loading effects

      /* console.log('ctx, onRequestSuccess, onRequestFailed====================================');
      console.log(ctx, onRequestSuccess, onRequestFailed);
      console.log('===================================='); */

      if (requestMethod) {
        requestMethod({ params: { ...urlOptions, ...this.options }, ...config } || config)
          .then((data) => {
            data = transformData ? transformData(data) : data;

            if (!data || !isObject(data)) {
              console.warn(`Are u sure u have returned a data and it is an object ${data}, right?`);
            }

            this.setState((prevState) => {
              let state = {};

              if (responseWholeDown) {
                state = { ...prevState, ...data, loading: false }
              } else {
                state = { response: data, loading: false }
              }

              return state;
            }, () => {
              isFunction(onRequestSuccess) && onRequestSuccess(responseWholeDown ? this.state : this.state.response).bind(ctx)
            })
          })
          .catch(error => {
            const { message } = error;
            console.error(error);

            Toast.fail(message, 3, () => {
              this.setState({
                loading: false,
                requestError: true,
                ERROR_MSG: message || ERROR_WITH_REQUEST_MSG,
              }, () => {
                isFunction(onRequestFailed) && onRequestFailed(this.state.ERROR_MSG).bind(ctx)
              })
            }, false);
          })
      }
    }

    checkOptions = () => {
      if (!this.options) {
        this.options = getQueryStringWrapper();
        console.info('url options', this.options)
      };

      if (this.options === null) return false;
      if (checkRequiredKeys.length) return checkOptionsByKeys(this.options, checkRequiredKeys);
    }

    getTitle = () => {
      if (titleKeyPath) {
        try {
          const title = getValueByGivenPathFromObject(this, titleKeyPath)

          if (title && isString(title) && title.trim()) {
            pageTitle = title.trim()
          }
        } catch(e) {
          console.error(e)
        }
      }

      return pageTitle;
    }

    getFloatingIcons = () => {
      if (!showFloatingIconInMiniProgram) return;

      const homeIconOption = {
        type: 'home',
        page: '/pages/newCar/Index/index',
        title: '返回主页',
        onClick() {
          const wx = window.wx;

          if (wx && isObject(wx) && wx.miniProgram) {
            wx.miniProgram.switchTab({
              url: homeIconOption.page
            })
          }
        }
      }

      const icons = [homeIconOption]

      if (showShareIconInMiniProgram) {
        const shareIconOpt = {
          type: 'share-alt',
          page: `/pages/common/SharePic/index?from=activity&url=${encodeURIComponent(window.location.href)}`,
          title: '返回页面',
          onClick() {
            const wx = window.wx;

            if (wx && isObject(wx) && wx.miniProgram) {
              wx.miniProgram.navigateTo({
                url: shareIconOpt.page
              })
            }
          }
        }

        icons.push(shareIconOpt)
      }

      return icons;
    }

    render() {
      const { isMiniProgram, loading, ERROR_MSG, requestError } = this.state

      // Firstly, checkUrlOptions
      if (checkUrlOptions && !this.checkedUrlOptions) {
        this.checkedUrlOptions = true;

        if (!this.checkOptions()) {
          return <DocumentTitle title={checkRequiredErrMsg}><Error>{checkRequiredErrMsg}</Error></DocumentTitle>
        }
      }

      // Secondly, Show Loading Effect
      if (loading) {
        return (
          <DocumentTitle title={"正在加载中..."}>
            <Spin style={{ paddingTop: 100 }} spinning={loading} tip={requestLoadingText}><WhiteSpace size="lg" /></Spin>
          </DocumentTitle>
        )
      }

      if (ERROR_MSG) {
        return (
          <DocumentTitle title={ERROR_MSG}>
            <Error>
              { ERROR_MSG || requestErrorContent }
              { requestError && <Button style={{ marginTop: 20 }} type="ghost" onClick={() => window.location.reload()}>点击刷新</Button> }
            </Error>
          </DocumentTitle>
        )
      }

      return (
        <DocumentTitle title={this.getTitle()}>
          <Fragment>
            { isMiniProgram && <FloatingIcon icons={this.getFloatingIcons()} /> }
            <WrappedComponent style={{ maxWidth: '100vw', width: '100%' }} ref={node => this.element = node} options={this.options || {}} {...this.state} />
          </Fragment>
        </DocumentTitle>
      )
    }
  };
}

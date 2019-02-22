import * as React from 'react';

interface WithUrlOpts {
  showLoading?: boolean; // 是否显示 loading
  urlOptions?: object; // `object` url 中默认的 params: object
  pageTitle: string;
  titleKeyPath?: string;
  requestMethod?: func;  // `func` 请求回调
  transformData?: (T) => T; // `func` 自定义转义data函数
  requestLoadingText?: string; // `string` 请求时候提示的文字内容
  requestErrorContent?: string; // `string | node` 请求错误的warning/error文字
  responseWholeDown?: bool; // `bool` 整体解构下传，还是以一个 `response` 为 `props` 下传
  checkUrlOptions?: bool; // `bool` 是否强制检查 options
  checkRequiredKeys?: array,
  checkRequiredErrMsg?: string,
}

// interface WithUrlOptsProps {[propsName: string]: any }

interface WithUrlOptsState {
  loading: bool;
}

declare namespace widthUrlOpts {
  export = WithUrlOpts;
  export = (options: WithUrlOpts) =>
  (WrappedComponent: React.Component<any, any>) =>
  class withURLOpts extends React.PureComponent<{[propsName: string]: any }, WithUrlOptsState> {
    static displayName: string;

    public state: WithUrlOptsState;

    private options: Object;

    private checkedUrlOptions: bool;

    constructor(props: AvatarProps);

    componentDidMount(): void;
    componentDidUpdate(prevProps: AvatarProps, prevState: AvatarState): void;
    executeRequest: () => void;
    checkOptions: () => bool;
    getTitle: () => string;
    render(): JSX.Element;
  }
}

declare module "withUrlOpts" {
  export = withUrlOpts
  export {
    WithUrlOpts,
    WithUrlOptsProps,
    WithUrlOptsState,
  };
}

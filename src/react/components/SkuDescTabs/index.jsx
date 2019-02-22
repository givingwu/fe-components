import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { Tabs } from 'antd-mobile'
import { StickyContainer, Sticky } from 'react-sticky'
import Placeholder from 'components/Placeholder'
import LazyLoad from 'react-lazyload';
import TransitionFade from 'components/TransitionFade';
import { isObject } from 'feewee/utils'
import { getSeriesInfo } from './api'
import TabBar from './TabBar';
import styles from './styles.less'


export default class SkuDescTabs extends PureComponent {
  static propTypes = {
    tabs: PropTypes.array.isRequired,
    title: PropTypes.string,
  }

  state = {
    tabs: [],
  }

  componentDidMount = () => {
    const { tabs = [] } = this.props;

    tabs.length && this.setState({
      tabs: tabs.map((t = {}) => ({ ...t, title: t.seriesName, value: t.seriesId, content: null }))/* .concat([{
        title: 'EveryDay - Logic',
        value: 613
      }, {
        title: '8 Mile - Eminem',
        value: 614,
      }, {
        title: 'Life is a struggle - 宋岳庭',
        value: 616
      }]) */
    }, () => {
      isObject(tabs[0]) && this.getTabsContent(tabs[0], 0)
    })
  }

  getTabsContent = (options, index) => {
    const { tabs: prevTabs } = this.state;
    const prevTab = prevTabs[index];

    if (prevTab && prevTab.content) return;

    prevTab && getSeriesInfo(options)
      .then(data => {
        this.setState(() => {
          prevTab.content = data

          return {
            tabs: [...prevTabs]
          };
        })
      })
  }

  renderTabBar = (props) => (
    <Sticky>
      {({ style, calculatedHeight, distanceFromTop, isSticky }) => {
        this.placeholderHeight = isSticky ? window.innerHeight - calculatedHeight : distanceFromTop >= 300 ? 300 : window.innerHeight - distanceFromTop

        return (
          <div style={{ ...style, zIndex: 1 }}>
            {/* <Tabs.DefaultTabBar {...props} page={Math.min(props.tabs.length, 3)} /> */}
            <TabBar prefixCls='custom-tab' {...props} />
          </div>
        )
      }}
    </Sticky>
  );

  render() {
    const { tabs = [] } = this.state;
    if (!tabs.length) return null;

    return (
      <StickyContainer className={styles.tab}>
        <Tabs
          tabs={tabs}
          // initialPage={0}
          renderTabBar={this.renderTabBar}
          onChange={(tab, idx) => this.getTabsContent(tab, idx)}
          tabBarActiveTextColor="rgb(4, 6, 20)"
          tabBarInactiveTextColor="rgb(159, 159, 159)"
          tabBarUnderlineStyle={{ border: '1px solid rgb(4, 6, 20)' }}
        >
          {
            tabs.map(({ title, content/* , images = [] */ }) => (
              <div key={title}>
                {
                  !content
                  ? <Placeholder style={{ height: this.placeholderHeight }} />
                  // : <div className={styles.tab__loading} ref={(node) => node && (node.innerHTML = content)}>暂无内容</div>
                  : content.map((image, index) => (
                      <LazyLoad key={image + '__' + index} once throttle={200} height={300} placeholder={<Placeholder />}>
                        <TransitionFade>
                          <img src={image} alt={this.props.title || image} />
                        </TransitionFade>
                      </LazyLoad>
                    ))
                }
              </div>
            ))
          }
        </Tabs>
      </StickyContainer>
    )
  }
}

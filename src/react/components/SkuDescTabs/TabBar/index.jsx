import React from 'react';
// import Gesture, { IGestureStatus } from 'rc-gesture';
import './styles.less';


export default class CustomTabBar extends React.PureComponent {
  static defaultProps = {
    prefixCls: 'rmc-tabs-tab-bar',
    animated: true,
    tabs: [],
    goToTab: () => { },
    activeTab: 0,
    page: 5,
    tabBarUnderlineStyle: {},
    tabBarBackgroundColor: '#fff',
    tabBarActiveTextColor: '',
    tabBarInactiveTextColor: '',
    tabBarTextStyle: {},
  };

  isTabBarVertical = (position = this.props.tabBarPosition) => position === 'left' || position === 'right';

  onPress = (index) => {
    const { goToTab, onTabClick, tabs } = this.props;
    onTabClick && onTabClick(tabs[index], index);
    goToTab && goToTab(index);
  }

  renderTab = (t, i) => {
    const {
      prefixCls, activeTab, tabBarTextStyle, instanceId,
      tabBarActiveTextColor, tabBarInactiveTextColor, renderTab,
    } = this.props;
    let ariaSelected = false;
    let cls = `${prefixCls}-bar`
    let textStyle = { ...tabBarTextStyle };

    if (i === activeTab) {
      ariaSelected = true
      cls += '-active'

      if (tabBarActiveTextColor) {
        textStyle.color = tabBarActiveTextColor;
      }
    } else if (tabBarInactiveTextColor) {
      textStyle.color = tabBarInactiveTextColor;
    }

    return (
      <div
        key={`t_${i}`}
        id={`m-tabs-${instanceId}-${i}`}
        role="tab"
        aria-selected={ariaSelected}
        className={cls}
        style={textStyle}
        onClick={() => this.onPress(i)}
      >
        {renderTab ? renderTab(t) : t.title}
      </div>
    )
  }

  render() {
    const {
      prefixCls, animated, tabs = [], /* page = 0, activeTab = 0, */
      tabBarBackgroundColor, tabBarUnderlineStyle, tabBarPosition,
      renderUnderline,
    } = this.props;
    // const isTabBarVertical = this.isTabBarVertical();
    const underlineProps = {
      style: {
        ...tabBarUnderlineStyle,
      },
      className: `${prefixCls}-underline`,
    };

    let cls = prefixCls;
    if (animated /* && !isMoving */) {
      cls += ` ${prefixCls}-animated`;
    }

    let style = {
      backgroundColor: tabBarBackgroundColor || '',
    }

    const Tabs = tabs.map((t, i) => {
      return this.renderTab(t, i);
    });


    return <div className={`${cls} ${prefixCls}-${tabBarPosition}`} style={style}>
      {/* <Gesture
        {...onPan }
        direction={isTabBarVertical ? 'vertical' : 'horizontal'}
      > */}
        <div role="tablist" className={`${prefixCls}-content`}>
          {Tabs}
          {
            renderUnderline ? renderUnderline(underlineProps) :
              <div {...underlineProps}></div>
          }
        </div>
      {/* </Gesture> */}
    </div>;
  }
}

import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import LazyLoad from 'react-lazyload';
import TransitionFade from 'components/TransitionFade';
import styles from "./styles.less";
export default ListView

ListView.ListItem = ListItem;
ListItem.Image = Image;
ListItem.Content = Content;

ListView.propTypes = {
  header: PropTypes.node,
  children: PropTypes.node.isRequired,
  footer: PropTypes.node,
}

ListItem.defaultProps = {
  border: true,
  mode: 'back',
  imageCls: '', // image's class
  contCls: '', // content's class
  extra: null,
}

ListItem.propTypes = {
  border: PropTypes.bool,
  header: PropTypes.node,
  className: PropTypes.string,
  onClick: PropTypes.func,
  // 图片展示模式
  mode: PropTypes.oneOf(['back', 'img']),
  children: PropTypes.node,
  extra: PropTypes.node,
  image: PropTypes.string,
  imageCls: PropTypes.string,
  title: PropTypes.string.isRequired,
  desc: PropTypes.node.isRequired,
  render: PropTypes.func,
  extraBefore: PropTypes.node,
  extraAfter: PropTypes.node,
  extraImage: PropTypes.node,
  footer: PropTypes.node,
}


const isEmptyChildren = children => React.Children.count(children) === 0;
const renderChildren = ({
  children,
  render,
  props = {}
}) => {
  if (render) return render(props);
  if (typeof children === "function") return children(props);
  if (children && !isEmptyChildren(children)) return React.Children.only(children);
  return null;
}


/**
 * @example
 * ```
  (<ListView>
    {
      list.map(t => <ListView.ListItem key={t.id} {...t} />)
    }
  </ListView>)
 * ```
 */
function ListView({
  className,
  children,
  header,
  footer,
}) {
  if (children && Array.isArray(children) && children.length === 0) {
    children = <div className={styles.list__none}>暂无数据</div>
  }

  return (
    <div className={classnames(className, styles.list)}>
      {header}
      {children}
      {footer}
    </div>
  );
}


/**
 * 文章列表 or 评论列表
 * 其共性为： img, title, desc, (time 但不在题目及考虑范围中)
 */
function ListItem({
  className,
  image: img = '',
  imageCls = '',
  contCls = '',
  onClick = () => {},
  mode = 'back', // 'img'
  border = true,
  header,
  title,
  desc,
  render,
  children,
  extraBefore,
  extraAfter,
  extraImage,
  footer,
  ...props
}) {
  const Item = (
    <div onClick={onClick} className={classnames(className, styles.list_item, !header && !footer && border ? styles.list_item__border : '' )}>
      {extraBefore}
      {img && <ListItem.Image extraImage={extraImage} imageCls={imageCls} mode={mode} src={img} alt={title} />}
      <ListItem.Content title={title} desc={desc} contCls={contCls}>
        {renderChildren({ render, children, props })}
      </ListItem.Content>
      {extraAfter}
    </div>
  );

  if (header || footer) {
    return (
      <LazyLoad once throttle={200} height={110}>
        <TransitionFade>
          <div className={classnames(styles.list_item__wrapper, border ? styles.list_item__border : '')}>
            {header}
            {Item}
            {footer}
          </div>
        </TransitionFade>
      </LazyLoad>
    );
  }

  // return Item;
  return (
    <LazyLoad once throttle={200} height={110}>
      <TransitionFade>{Item}</TransitionFade>
    </LazyLoad>
  )
}


function Image({
  mode,
  imageCls,
  extraImage,
  alt = 'list item',
  ...props
}) {
  const cls = classnames(
    styles.list_item__img,
    mode && mode === 'back' ? styles.list_item__back : '',
    imageCls ? imageCls  : ''
  );

  if (mode === 'back') {
    return (
      extraImage ? (
        <React.Fragment>
          {extraImage}
          <div className={cls} style={{ backgroundImage: `url(${props.src})` }} />
        </React.Fragment>
      ) : (
        <div className={cls} style={{ backgroundImage: `url(${props.src})` }} />
      )
    )
  }

  return (
    <div className={cls}>
      {extraImage}
      <img {...props} alt={alt}/>
    </div>
  )
}


function Content({
  contCls,
  title,
  desc,
  children,
  render,
  ...props
}) {
  return (
    <div className={classnames(styles.list_item__content, contCls)}>
      <div className={classnames(styles.list_item__content__inner)}>
        <h3>{title}</h3>
        <div>{desc}</div>
      </div>
      {renderChildren({ render, children, props })}
    </div>
  )
}

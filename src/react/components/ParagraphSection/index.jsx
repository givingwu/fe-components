import React from 'react';
import classnames from 'classnames';
import PropTypes from 'prop-types';
import styles from './styles.less'

export default function ParagraphSection({
  className,
  title,
  children,
}) {
  return (
    <section className={classnames(styles.section, className)}>
      { title && <h4 className={styles.section__title}>{title}</h4>}
      <div className={styles.section__content}>{children}</div>
    </section>
  );
}

ParagraphSection.defaultProps = {
  title: '暂无标题',
}

ParagraphSection.propTypes = {
  title: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
    PropTypes.node,
  ]),
  children: PropTypes.node.isRequired,
}
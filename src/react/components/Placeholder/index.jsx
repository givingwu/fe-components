import React from 'react';
import PropTypes from 'prop-types';
import './styles.less';
export default Placeholder;

Placeholder.propTypes = {
  className: PropTypes.string,
  style: PropTypes.object,
  children: PropTypes.node,
}

function Placeholder({
  style,
  className = '',
  children
}) {
  return (
    <div style={style} className={`placeholder ${className}`}>
      <div className="spinner">
        <div className="rect1"></div>
        <div className="rect2"></div>
        <div className="rect3"></div>
        <div className="rect4"></div>
        <div className="rect5"></div>
      </div>

      {
        children
        &&
        <div className="children">
          {children}
        </div>
      }
    </div>
  );
}
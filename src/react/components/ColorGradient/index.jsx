import React from 'react'
import PropTypes from 'prop-types'

// eslint-disable-next-line
function getColorByRule(colorMap, rule) {
}

const ColorGradient = ({
  colorMap,
  deg,
  rule, // ['max', 'min'], ['max', 'mid', 'min']
  children
}) => {
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
  // const backgroundColor = getColorByRule(colorMap, rule)

  return (
    <div>{renderChildren(children)}</div>
  )
}

ColorGradient.propTypes = {
  colorMap: PropTypes.arrayOf(PropTypes.object.isRequired).isRequired,
  rule: PropTypes.array.isRequired, // ['max', 'min', deg?: number], ['max', 'mid', 'min', deg?: number]
}

export default ColorGradient


import React from 'react'
import PropTypes from 'prop-types';
import { Transition } from 'react-transition-group';
export default TransitionFade;

TransitionFade.propTypes = {
  children: PropTypes.node.isRequired,
}

const duration = 300;
const defaultStyle = {
  transition: `opacity ${duration}ms ease-in-out`,
  opacity: 0,
}
const transitionStyles = {
  entering: { opacity: 0 },
  entered:  { opacity: 1 },
};

function TransitionFade({ in: inProp = true, children, ...rest }) {
  return (
    <Transition mountOnEnter in={inProp} timeout={duration}>
      {(state) => (
        <div style={{
          ...defaultStyle,
          ...transitionStyles[state]
        }}>
          {children}
        </div>
      )}
    </Transition>
  )
}


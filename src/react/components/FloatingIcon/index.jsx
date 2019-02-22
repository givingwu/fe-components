import React from 'react'
import PropTypes from 'prop-types'
import { Icon } from 'antd'
import styles from './styles.less'

const FloatingIcon = ({
  icons,
}) => {
  if (!icons || !icons.length) return null;

  return (
    <div className={styles.floating}>
      { icons.map((props) => <Icon {...props} />) }
    </div>
  )
}

FloatingIcon.propTypes = {
  icons: PropTypes.arrayOf(PropTypes.shape({
    type: PropTypes.string.isRequired,
    theme: PropTypes.string,
    onClick: PropTypes.func,
  }))
}

export default FloatingIcon

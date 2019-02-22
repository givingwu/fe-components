import { Icon, Result } from 'antd-mobile';
import styles from './styles.less';

const Types = {
  success: <Icon type="check-circle" className="spe" style={{ fill: '#1F90E6' }} />,
  error: <Icon type="cross-circle-o" className="spe" style={{ fill: '#F13642' }} />,
  waiting: 'https://gw.alipayobjects.com/zos/rmsportal/HWuSTipkjJRfTWekgTUG.svg',
  warning: 'https://gw.alipayobjects.com/zos/rmsportal/GIyMDJnuqmcqPLpHCSkj.svg',
}

/**
 * <Error /> | <Warning />
 */
export default ({
  type="warning",
  msg,
  src='https://gw.alipayobjects.com/zos/rmsportal/GIyMDJnuqmcqPLpHCSkj.svg',
  children,
}) => (
  <Result
    className={styles.error}
    img={src ? <img src={src} className="am-icon am-icon-md" alt="what's this?" /> : Types[type]}
    title={`Sorry${ msg ? ' ,' + msg : ''}`}
    message={children}
  />
)
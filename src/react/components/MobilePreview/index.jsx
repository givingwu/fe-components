import React from 'react';
import classNames from 'classnames';
import styles from './index.less';

const Phone = function frame(props) {
  return (
    <div className={styles.preview}>
      {props.children}
    </div>
  );
};

const PhoneHeader = function header(props) {
  return (
    <header className={styles.preview_hd}>{ props.title }</header>
  );
};

const PhoneBody = function body(props) {
  return (
    <main className={props.className}>{ props.children }</main>
  );
};

export default function MobilePreview({ title, children }) {
  const bodyClass = classNames({
    [styles.preview_bd]: true,
    [styles.preview_bg]: true,
  });

  return (
    <div className={styles.phone}>
      <Phone>
        <PhoneHeader title={title} />
        <PhoneBody className={bodyClass}>
          {children}
        </PhoneBody>
      </Phone>
    </div>
  );
}

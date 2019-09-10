import React from 'react';
import styles from './styles';

export default () => {
  const classes = styles();
  const link = 'https://github.com/jontonsoup4';
  return (
    <div className={classes['container']}>
      <a className={classes['name']} href={link} rel="noopener noreferrer" target='_blank'>
        Built by <span className={classes['link']}>@jontonsoup4</span>
      </a>
    </div>
  )
}

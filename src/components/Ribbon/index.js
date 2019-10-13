import Button from '@material-ui/core/Button';
import React from 'react';
import styles from './styles';

export default () => {
  const classes = styles();
  const username = 'jontonsoup4';
  const link = `https://github.com/${username}`;
  return (
    <div className={classes['container']}>
        <Button
          color='primary'
          component='a'
          className={classes['name']}
          href={link}
          rel="noopener noreferrer"
          target='_blank'
          variant='contained'
        >
          Built by <span className={classes['link']}>@{username}</span>
        </Button>
    </div>
  )
}

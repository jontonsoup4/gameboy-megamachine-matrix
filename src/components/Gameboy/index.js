import classNames from 'classnames';
import React from 'react';
import styles from './styles';
import * as constants from '../../utils/constants';

export default (props) => {
  const {
    isHovered,
    onMouseDown,
    onMouseOut,
    onMouseOver,
    velocity,
  } = props;
  const classes = styles();

  return (
    <div
      className={classes['container']}
      onMouseDown={onMouseDown}
      onMouseOut={onMouseOut}
      onMouseOver={onMouseOver}
    >
      <div className={classes['gameboy']}>
        <div className={classes['screen-cont']}>
          <div className={classes['power']}/>
          <div className={classNames(classes['screen'], {
            [classes['lighted']]: velocity > constants.NOTE_OFF,
            [classes['hovered']]: isHovered,
          })}>
          </div>
        </div>
        <div className={classes['controls-cont']}>
          <div className={classes['btn-direction']}>
            <div className={classes['vertical']}/>
            <div className={classes['horizontal']}/>
          </div>
          <div className={classes['btn-AB']}/>
          <div className={classes['btn-start-select']}/>
        </div>
        <div className={classes['speakers']}/>
      </div>
    </div>
  )
}

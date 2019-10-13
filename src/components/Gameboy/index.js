import withTheme from '@material-ui/core/styles/withTheme';
import React from 'react';
import styles from './styles';

export default withTheme((props) => {
  const {
    isHovered,
    onMouseDown,
    onMouseOut,
    onMouseOver,
    velocity,
    useGameboy,
  } = props;
  const classes = styles();
  const opacity = velocity ? velocity / 127 : 0;
  const backgroundColor = isHovered && !velocity
    ? 'rgba(255, 246, 212, 0.4)'
    : `rgba(255, 246, 212, ${opacity}`;

  return (
    <div
      className={classes['container']}
      onMouseDown={onMouseDown}
      onMouseOut={onMouseOut}
      onMouseOver={onMouseOver}
    >
      {useGameboy ? (
        <div className={classes['gameboy']}>
          <div className={classes['screen-cont']}>
            <div className={classes['power']}/>
            <div className={classes['screen']} style={{ backgroundColor }} />
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
      ) : (
        <div className={classes['dense']} style={{ backgroundColor }} />
      )}
    </div>
  )
})

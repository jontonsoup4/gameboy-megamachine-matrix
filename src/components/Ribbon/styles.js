import { makeStyles } from '@material-ui/core';

export default makeStyles((theme) => ({
  container: {
    height: '100vh',
    left: 0,
    overflow: 'hidden',
    pointerEvents: 'none',
    position: 'absolute',
    top: 0,
    width: '100vw',
  },
  name: {
    background: theme.palette.primary.main,
    boxShadow: theme.shadows[5],
    color: theme.palette.common.white,
    fontSize: 18,
    pointerEvents: 'all',
    position: 'absolute',
    right: -70,
    textAlign: 'center',
    textDecoration: 'none',
    top: 70,
    transform: 'rotate(45deg)',
    width: 300,
    zIndex: 10,
  },
}));

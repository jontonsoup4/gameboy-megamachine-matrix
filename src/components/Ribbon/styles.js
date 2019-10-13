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
    letterSpacing: 1.2,
    padding: 0,
    pointerEvents: 'all',
    position: 'absolute',
    right: -70,
    textAlign: 'center',
    textDecoration: 'none',
    textTransform: 'none',
    top: 70,
    transform: 'rotate(45deg)',
    width: 300,
    zIndex: 10,
  },
}));

import { makeStyles } from '@material-ui/core';

export default makeStyles((theme) => ({
  'button-group': {
    marginRight: theme.spacing(1),
  },
  frames: {
    color: `${theme.palette.common.white} !important`,
    backgroundColor: `${theme.palette.primary.main} !important`,
    width: 100,
  },
  select: {
    color: theme.palette.common.white,
    marginRight: theme.spacing(1),
    width: 60,
  },
  tempo: {
    color: theme.palette.common.white,
    marginRight: theme.spacing(1),
    width: 120,
  },
}));

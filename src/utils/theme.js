import { blueGrey, red } from '@material-ui/core/colors';
import { createMuiTheme } from '@material-ui/core/styles';

// A custom theme for this app
const theme = createMuiTheme({
  palette: {
    primary: {
      main: '#a93671',
    },
    secondary: {
      main: blueGrey['500'],
    },
    error: {
      main: red.A400,
    },
    background: {
      default: blueGrey['800'],
    },
  },
});

export default theme;

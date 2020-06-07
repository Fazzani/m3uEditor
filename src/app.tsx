import * as React from 'react';
import * as ReactDOM from 'react-dom';
import DisplayPlaylist from './components/list';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';

function App() {
  const _ipc: NodeJS.EventEmitter = window.require('electron').ipcRenderer;

  let prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');

  const [them, setthem] = React.useState(prefersDarkMode);

  const theme = React.useMemo(
    () =>
      createMuiTheme({
        palette: {
          type: prefersDarkMode && them ? 'dark' : 'light',
        },
      }),
    [prefersDarkMode, them],
  );

  React.useEffect(() => {
    _ipc.on('switch-theme', async (event: any, msg: any) => {
      prefersDarkMode = !!!prefersDarkMode;
      setthem(prefersDarkMode);
    });
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <DisplayPlaylist url="https://gist.githubusercontent.com/Fazzani/722f67c30ada8bac4602f62a2aaccff6/raw/0b75e84d15b955f7073cb0225e7919a03347d8e9/playlist1.m3u" />
    </ThemeProvider>
  );
}

// ReactDOM.render(<Select compiler="test" framework="fra" />, document.getElementById('root'));
ReactDOM.render(<App />, document.getElementById('root'));

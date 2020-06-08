import { hot } from 'react-hot-loader';
import * as React from 'react';
import DisplayPlaylist from './components/list';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import settings from 'electron-settings';
import { Container } from '@material-ui/core';

const defaultUri = 'https://gist.githubusercontent.com/Fazzani/722f67c30ada8bac4602f62a2aaccff6/raw/0b75e84d15b955f7073cb0225e7919a03347d8e9/playlist1.m3u';
function App() {
  const _ipc: NodeJS.EventEmitter = window.require('electron').ipcRenderer;

  let prefersDarkMode = settings.get('theme', useMediaQuery('(prefers-color-scheme: dark)'));
  const uriSetting = settings.get('uri', defaultUri) as string;
  console.log(`uri setting: ${uriSetting}`);

  const [them, setthem] = React.useState(prefersDarkMode);
  const [uri, setUri] = React.useState(uriSetting);

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
      settings.set('theme', prefersDarkMode);
      setthem(prefersDarkMode);
    });
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <DisplayPlaylist uri={uri} />
    </ThemeProvider>
  );
}

// ReactDOM.render(<Select compiler="test" framework="fra" />, document.getElementById('root'));
// ReactDOM.render(<App />, document.getElementById('root'));
export default hot(module)(App);

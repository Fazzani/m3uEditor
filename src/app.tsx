import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Select } from './components/select';
import DisplayPlaylist from './components/list';


// ReactDOM.render(<Select compiler="test" framework="fra" />, document.getElementById('root'));
ReactDOM.render(<DisplayPlaylist url="https://gist.githubusercontent.com/Fazzani/722f67c30ada8bac4602f62a2aaccff6/raw/0b75e84d15b955f7073cb0225e7919a03347d8e9/playlist1.m3u" />, document.getElementById('root'));

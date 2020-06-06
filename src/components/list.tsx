import React, { useEffect, useState } from 'react';
import { Playlist } from '../models/row';
import { makeStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import Avatar from '@material-ui/core/Avatar';
import ImageIcon from '@material-ui/icons/Image';

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
    // maxWidth: 360,
    backgroundColor: theme.palette.background.paper,
  },
}));

const DisplayPlaylist: React.FC<{ url: string }> = (props) => {
  const classes = useStyles();

  const [pl, setPl] = useState<Playlist>();
  const _ipc: NodeJS.EventEmitter = window.require('electron').ipcRenderer;
  useEffect(() => {
    _ipc.on('selected-file', async (event: any, msg: any) => {
      setPl(await Playlist.ReadFromFile(msg.fileLocation));
    });

    (async function loadUrl() {
      setPl(await Playlist.ReadFromUrl(props.url));
    })();
  }, []);

  return (
    <List className={classes.root}>
      {pl?.Rows?.map((r, index) => (
        <ListItem key={index}>
          <ListItemAvatar>
            <Avatar alt="tvg-logo" src={r.Properties['tvg-logo']}>
            </Avatar>
          </ListItemAvatar>
          <ListItemText primary={r.Name} secondary={r.Url} />
        </ListItem>
      ))}
    </List>
  );
};

export default DisplayPlaylist;

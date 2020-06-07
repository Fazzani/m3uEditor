import React, { useEffect, useState } from 'react';
import { Playlist, Row } from '../models/row';
import { makeStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import Avatar from '@material-ui/core/Avatar';
import { ListItemIcon, Checkbox, ListItemSecondaryAction, IconButton } from '@material-ui/core';
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
    // maxWidth: 360,
    backgroundColor: theme.palette.background.paper,
  },
}));

const theme = {
  background: 'linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)',
};

const DisplayPlaylist: React.FC<{ url: string }> = (props) => {
  const classes = useStyles();
  const _ipc: NodeJS.EventEmitter = window.require('electron').ipcRenderer;
  let [pl, setPl] = useState<Playlist>();

  const updatePl = () => {
    if (pl !== undefined) {
      pl = { ...pl };
      setPl(pl);
    }
  };
  const handleToggle = (r: Row) => () => {
    r.checked = !r.checked;
    updatePl();
  };

  const handleDelete = (index: number) => () => {
    if (pl !== undefined && index !== -1) {
      pl?.Rows?.splice(index, 1);
      updatePl();
    }
  };

    const handleEdit = (index: number) => () => {
    if (pl !== undefined && index !== -1) {
      //TODO: dislay modal
    }
  };

  useEffect(() => {
    _ipc.on('selected-file', async (event: any, msg: any) => {
      setPl(await Playlist.ReadFromFile(msg.fileLocation));
    });

    (async function loadUrl() {
      setPl(await Playlist.ReadFromUrl(props.url));
    })();
  }, []);

  return (
      <List className={classes.root} color="primary">
        {pl?.Rows?.map((r, index) => (
          <ListItem key={index} role={undefined} dense button onClick={handleToggle(r)}>
            <ListItemIcon>
              <Checkbox edge="start" checked={r.checked} tabIndex={-1} disableRipple />
            </ListItemIcon>
            <ListItemAvatar>
              <Avatar alt="tvg-logo" src={r.Properties['tvg-logo']} />
            </ListItemAvatar>
            <ListItemText primary={r.Name} secondary={r.Url} />
            <ListItemSecondaryAction >
               <IconButton edge="end" aria-label="edit" onClick={handleEdit(index)}>
                <EditIcon color="primary" />
              </IconButton>
              <IconButton edge="end" aria-label="delete" onClick={handleDelete(index)}>
                <DeleteIcon color="primary" />
              </IconButton>
            </ListItemSecondaryAction>
          </ListItem>
        ))}
      </List>
  );
};

export default DisplayPlaylist;

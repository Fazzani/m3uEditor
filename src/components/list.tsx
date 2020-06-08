import React, { useEffect, useState } from 'react';
import { Playlist, Row } from '../models/row';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import Avatar from '@material-ui/core/Avatar';
import { ListItemIcon, Checkbox, ListItemSecondaryAction, IconButton, Backdrop, CircularProgress, makeStyles, Theme, createStyles } from '@material-ui/core';
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';
import settings from 'electron-settings';
import { AutoSizer, List as FixedSizeList } from 'react-virtualized';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    backdrop: {
      zIndex: theme.zIndex.drawer + 1,
      color: '#fff',
    },
  }),
);

const DisplayPlaylist: React.FC<{ uri: string }> = (props) => {
  const classes = useStyles();
  const _ipc: NodeJS.EventEmitter = window.require('electron').ipcRenderer;
  let [pl, setPl] = useState<Playlist>();
  const [loading, setLoading] = React.useState(true);

  const updatePl = () => {
    if (pl !== undefined) {
      pl = { ...pl };
      setPl(pl);
    }
  };
  const handleToggle = (index: number) => () => {
    if (pl !== undefined) {
      pl.Rows[index].checked = !pl.Rows[index].checked;
      updatePl();
    }
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

  const loadUri = async (path: string) => {
    settings.set('uri', path);

    if (path.startsWith('http') || path.startsWith('https')) {
      setPl(await Playlist.ReadFromUrl(path));
    } else {
      setPl(await Playlist.ReadFromFile(path));
    }
  };

  useEffect(() => {
    _ipc.on('selected-file', async (event: any, msg: any) => {
      setLoading(true);
      console.log(`New file uri selected: ${msg.fileLocation}`);
      await loadUri(msg.fileLocation);
      setLoading(false);
    });

    (async function loadUrl() {
      setLoading(true);
      console.log(`in loadUrl: ${props.uri}`);
      await loadUri(props.uri);
      setLoading(false);
    })();
  }, []);

  if (!pl || loading) {
    return (
      <Backdrop className={classes.backdrop} open={loading}>
        <CircularProgress color="inherit" />
      </Backdrop>
    );
  }
  if (!pl.Rows) {
    return <p>Sorry, the list is empty.</p>;
  }

  const RowRender = (child: any) => {
    return (
      <div key={child.key} style={child.style}>
        <ListItem role={undefined} dense button onClick={handleToggle(child.index)} ContainerComponent='div'>
          <ListItemIcon>
            <Checkbox edge="start" checked={pl?.Rows[child.index].checked} tabIndex={-1} disableRipple />
          </ListItemIcon>
          <ListItemAvatar>
            <Avatar alt="tvg-logo" src={pl?.Rows[child.index].Properties['tvg-logo']} />
          </ListItemAvatar>
          <ListItemText primary={pl?.Rows[child.index].Name} secondary={pl?.Rows[child.index].Url} />
          <ListItemSecondaryAction>
            <IconButton edge="end" aria-label="edit" onClick={handleEdit(child.index)}>
              <EditIcon color="primary" />
            </IconButton>
            <IconButton edge="end" aria-label="delete" onClick={handleDelete(child.index)}>
              <DeleteIcon color="primary" />
            </IconButton>
          </ListItemSecondaryAction>
        </ListItem>
      </div>
    );
  };

  return (
    <AutoSizer>
      {({ height, width }) => (
        <FixedSizeList rowCount={pl?.Rows.length ?? 10} width={width} height={height} rowHeight={60} rowRenderer={RowRender} overscanRowCount={30}>
          {Row}
        </FixedSizeList>
      )}
    </AutoSizer>
  );
};

export default DisplayPlaylist;

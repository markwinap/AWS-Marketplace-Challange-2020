import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';

import ToolbarTop from '../../components/ToolbarTop';
import DrawerLeft from '../../components/DrawerLeft';
import CanvasImage from '../../components/CanvasImage';

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    height: '100%',
    width: '100%',
  },
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
  },
  content: {
    flexGrow: 1,
    height: '100%',
    width: '100%',
    padding: theme.spacing(3),
  },
}));

export default function Main() {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <CssBaseline />
      <ToolbarTop />
      <DrawerLeft />
      <main className={classes.content}>
        <CanvasImage />
      </main>
    </div>
  );
}

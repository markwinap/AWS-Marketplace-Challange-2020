import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { AppBar, Toolbar, Typography, Button } from '@material-ui/core';
import { Auth } from 'aws-amplify';

const useStyles = makeStyles((theme) => ({
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
  },
  title: {
    flexGrow: 1,
  },
}));

export default function ToolbarTop() {
  const classes = useStyles();

  return (
    <AppBar position="fixed" className={classes.appBar}>
      <Toolbar>
        <Typography variant="h6" className={classes.title}>
          COVID-19 Safe distance CV
        </Typography>
        <Button
          color="inherit"
          onClick={() => {
            Auth.signOut()
              .then((data) => console.log(data))
              .catch((err) => console.log(err));
          }}
        >
          Logout
        </Button>
      </Toolbar>
    </AppBar>
  );
}

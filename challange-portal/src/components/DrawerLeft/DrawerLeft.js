import React, { useContext, useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import {
  Drawer,
  Toolbar,
  Typography,
  Slider,
  MenuItem,
  TextField,
  FormControlLabel,
  Switch,
  LinearProgress,
} from '@material-ui/core';
import ColorPicker from 'material-ui-color-picker';
import { store } from '../../store.js';
import { Auth, Storage } from 'aws-amplify';

import * as rax from 'retry-axios';
import axios from 'axios';
const interceptorId = rax.attach();

const drawerWidth = 260;

const useStyles = makeStyles((theme) => ({
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
  },
  drawerPaper: {
    width: drawerWidth,
  },
  drawerContainer: {
    //overflow: 'auto',
    height: '100%',
  },
  containerMain: {
    paddingLeft: 16,
    height: '100%',
    paddingRight: 16,
  },
}));

const drones = [
  { name: 'Spark', value: 25 },
  { name: 'Phantom 4', value: 24 },
  { name: 'Phantom 4 Pro', value: 24 },
  { name: 'Phantom 4 Advanced', value: 24 },
  { name: 'Phantom 4 Pro v2.0', value: 24 },
  { name: 'Phantom 4 Pro v2.0', value: 35 },
  { name: 'Mavic Mini', value: 24 },
  { name: 'Mavic Air', value: 24 },
  { name: 'Mavic Pro', value: 28 },
  { name: 'Mavic 2 Pro', value: 28 },
  { name: '24mm', value: 24 },
  { name: '35mm', value: 35 },
  { name: '48mm', value: 48 },
  { name: '50mm', value: 50 },
  { name: '85mm', value: 85 },
  { name: '135mm', value: 135 },
];

export default function DrawerLeft() {
  const [lineColorPeople, setLineColorPeople] = useState('#D0EB00');
  const [fillColorPeople, setFillColorPeople] = useState('#ff000014');
  const [lineColorDistance, setLineColorDistance] = useState('#FF0000');
  const [lineTextColorDistance, setLineTextColorDistance] = useState('#5CFF00');
  const [lineWidthDistance, setLineWidthDistance] = useState(2);
  const [lineWidthPeople, setLineWidthPeople] = useState(2);
  const [drone, setDrone] = useState({});
  const [people, setPeople] = useState(true);
  const [line, setLine] = useState(true);
  const [droneHeight, setDroneHeight] = useState(10);
  const [upload, setUpload] = useState(0);
  const [uploading, setUploading] = useState(false);
  const [uploadingMsg, setUploadingMsg] = useState('');
  const [filename, setFilename] = useState('');

  useEffect(() => {
    Auth.currentSession()
      .then((data) => console.log(data))
      .catch((err) => console.log(err));

    return () => {};
  }, []);

  const classes = useStyles();
  const globalState = useContext(store);
  const { dispatch } = globalState;
  return (
    <Drawer
      className={classes.drawer}
      variant="permanent"
      classes={{
        paper: classes.drawerPaper,
      }}
    >
      <Toolbar />
      <div className={classes.drawerContainer}>
        <div className={classes.containerMain}>
          <Typography variant="h6" gutterBottom>
            Image
          </Typography>
          <TextField
            id="standard-basic"
            type="file"
            accept="image/jpg"
            name="Image"
            fullWidth
            onChange={async (e) => {
              const _file = e.target.files[0];
              console.log(_file);
              if (_file.size < 2000001) {
                dispatch({
                  type: 'iamge-url',
                  value: URL.createObjectURL(_file),
                });
                dispatch({
                  type: 'ml-data',
                  value: [],
                });
                setUploading(true);
                setFilename(_file.name);
                await Storage.put(_file.name, _file, {
                  progressCallback(progress) {
                    console.log(
                      `Uploaded: ${progress.loaded}/${progress.total}`
                    );
                    setUploadingMsg(
                      `Uploaded: ${progress.loaded}/${progress.total}`
                    );
                    setUpload((progress.loaded / progress.total) * 100);
                  },
                })
                  .then((res) => {
                    setUploading(false);
                    setUploadingMsg('Upload Completed');
                    setUpload(0);
                    console.log(res);
                  })
                  .catch((err) => {
                    console.log(err);
                    setUpload(0);
                    setUploadingMsg('Error');
                  });
                setUploadingMsg('Geting ML Object');
                const _temp = await Storage.get(
                  `${_file.name.split('.')[0]}.json`
                )
                  .then((res) => res)
                  .catch((err) => {
                    console.log(err);
                    return false;
                  });
                const _json = await axios({
                  method: 'get',
                  url: _temp,
                  raxConfig: {
                    retry: 10,
                    retryDelay: 1000,
                    statusCodesToRetry: [
                      [100, 199],
                      [400, 429],
                      [500, 599],
                    ],
                  },
                })
                  .then((res) => res.data)
                  .catch((err) => {
                    console.log(err);
                    return [];
                  });
                setUploadingMsg('Done');
                dispatch({
                  type: 'ml-data',
                  value: _json,
                });
              } else {
                alert('Filer larger than 2MB');
              }
            }}
          />
          {uploading ? (
            <LinearProgress
              variant="determinate"
              value={upload}
              color="secondary"
            />
          ) : null}
          <Typography variant="body2" gutterBottom>
            {uploadingMsg}
          </Typography>

          {false ? (
            <>
              <Typography variant="h6" gutterBottom>
                Drone
              </Typography>
              <TextField
                id="standard-select-currency"
                select
                //label="Select"
                value={drone}
                onChange={(e) => {
                  setDrone(e.target.value);
                  dispatch({
                    type: 'focal-length',
                    value: e?.target?.value?.value,
                  });
                }}
                fullWidth={true}
                helperText="Select your drone camera focal length"
              >
                {drones.map((e, i) => {
                  return (
                    <MenuItem key={`menu_item_drone_${i}`} value={e}>
                      {e.name}
                    </MenuItem>
                  );
                })}
              </TextField>
              <Typography variant="body2" gutterBottom>
                Drone Height (Meters)
              </Typography>
              <Slider
                defaultValue={10}
                name="drone-height"
                aria-labelledby="line-width-people"
                valueLabelDisplay="auto"
                onChange={(c, newValue) => {
                  //dispatch({ type: 'distance-threshold', value: newValue });
                  setDroneHeight(newValue);
                }}
                step={1}
                //marks
                min={1}
                max={200}
              />
            </>
          ) : null}

          <Typography variant="h6" gutterBottom>
            People
          </Typography>
          <FormControlLabel
            control={
              <Switch
                checked={people}
                onChange={() => {
                  dispatch({ type: 'people', value: !people });
                  setPeople(!people);
                }}
                name="checkedB"
              />
            }
            label="Enable"
          />
          {people ? (
            <>
              <Typography variant="body2" gutterBottom>
                Line Color
              </Typography>
              <ColorPicker
                name="line-color-people"
                //defaultValue="#000"
                //label={colorPeople}
                //hintText={colorPeople}
                //internalValue={colorPeople}
                placeholder={lineColorPeople}
                value={lineColorPeople}
                onChange={(c) => {
                  dispatch({ type: 'line-color-people', value: c });
                  setLineColorPeople(c);
                }}
              />
              <Typography variant="body2" gutterBottom>
                Fill Color
              </Typography>
              <ColorPicker
                name="fill-color-people"
                placeholder={fillColorPeople}
                value={fillColorPeople}
                onChange={(c) => {
                  dispatch({ type: 'fill-color-people', value: c });
                  setFillColorPeople(c);
                }}
              />
              <Typography variant="body2" gutterBottom>
                Line Width
              </Typography>
              <Slider
                defaultValue={2}
                name="line-width-people"
                aria-labelledby="line-width-people"
                valueLabelDisplay="auto"
                onChange={(c, newValue) => {
                  dispatch({ type: 'line-width-people', value: newValue });
                  setLineWidthPeople(newValue);
                }}
                step={1}
                marks
                min={1}
                max={10}
              />
            </>
          ) : null}

          <Typography variant="h6" gutterBottom>
            Distance
          </Typography>
          <FormControlLabel
            control={
              <Switch
                checked={line}
                onChange={() => {
                  dispatch({ type: 'line', value: !line });
                  setLine(!line);
                }}
                name="checkedB"
              />
            }
            label="Enable"
          />
          {line ? (
            <>
              <Typography variant="body2" gutterBottom>
                Text Color
              </Typography>
              <ColorPicker
                name="line-color-people"
                //defaultValue="#000"
                //label={colorPeople}
                //hintText={colorPeople}
                //internalValue={colorPeople}
                placeholder={lineTextColorDistance}
                value={lineTextColorDistance}
                onChange={(c) => {
                  dispatch({ type: 'line-text-color-distance', value: c });
                  setLineTextColorDistance(c);
                }}
              />
              <Typography variant="body2" gutterBottom>
                Line Color
              </Typography>
              <ColorPicker
                name="line-color-distance"
                placeholder={lineColorDistance}
                value={lineColorDistance}
                onChange={(c) => {
                  dispatch({ type: 'line-color-distance', value: c });
                  setLineWidthDistance(c);
                }}
              />
              <Typography variant="body2" gutterBottom>
                Line Width
              </Typography>
              <Slider
                defaultValue={2}
                name="line-width-distance"
                aria-labelledby="line-width-distance"
                valueLabelDisplay="auto"
                onChange={(c, newValue) => {
                  dispatch({ type: 'line-width-distance', value: newValue });
                  setLineWidthDistance(newValue);
                }}
                step={1}
                marks
                min={1}
                max={10}
              />
            </>
          ) : null}
          <Typography variant="h6" gutterBottom>
            Other
          </Typography>
          <Typography variant="body2" gutterBottom>
            Distance Between People (Pixels)
          </Typography>
          <Slider
            defaultValue={2}
            name="distance-threshold"
            aria-labelledby="distance-threshold"
            valueLabelDisplay="auto"
            onChange={(c, newValue) => {
              dispatch({ type: 'distance-threshold', value: newValue });
              //setLineWidthPeople(newValue);
            }}
            step={10}
            marks
            min={1}
            max={1000}
          />
          <Typography variant="body2" gutterBottom>
            ML Score Threshold (%)
          </Typography>
          <Slider
            defaultValue={16}
            name="score-threshold"
            aria-labelledby="score-threshold"
            valueLabelDisplay="auto"
            onChange={(c, newValue) => {
              dispatch({ type: 'score-threshold', value: newValue / 100 });
              //setLineWidthPeople(newValue);
            }}
            step={1}
            marks
            min={1}
            max={100}
          />
        </div>
      </div>
    </Drawer>
  );
}

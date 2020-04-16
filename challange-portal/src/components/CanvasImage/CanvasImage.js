import React, { useState, useEffect, useContext } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import {
  Drawer,
  Toolbar,
  List,
  Divider,
  ListItem,
  ListItemIcon,
  ListItemText,
} from '@material-ui/core';
import { MoveToInbox, Mail } from '@material-ui/icons';

import Konva from 'konva';
import { Stage, Layer, Rect, Text, Circle, Line, Image } from 'react-konva';
import useImage from 'use-image';
import { store } from '../../store.js';
import data from './data_test.js';

const dist_threshold = 60;

const useStyles = makeStyles((theme) => ({
  drawerContainer: {
    overflow: 'auto',
  },
  canvas: {
    height: '90%',
    width: '100%',
    //backgroundColor: 'green',
  },
}));

export default function DrawerLeft() {
  const classes = useStyles();
  const [width, setWidth] = useState(0);
  const [height, setHeight] = useState(0);
  const [imageWidth, setImageWidth] = useState(0);
  const [imagHeight, setImagHeight] = useState(0);
  const [boxes, setBoxes] = useState([]);
  const [distances, setDistances] = useState([]);

  const globalState = useContext(store);

  useEffect(() => {
    const ele = document.getElementById('canvas-image');
    const resizeObserver = new ResizeObserver((e) => {
      const entrie = e[0].contentRect;
      setHeight(entrie.height);
      setWidth(entrie.width);
    });
    resizeObserver.observe(ele);
    return () => {
      resizeObserver.unobserve(ele);
    };
  }, []);
  useEffect(() => {
    //cleanData(e,score_threshold, dist_threshold)

    const d = cleanData(
      data,
      globalState?.state?.scoreThreshold,
      globalState?.state?.distThreshold
    );
    console.log(d);
    setBoxes(d.clean);
    setDistances(d.temp);
    return () => {};
  }, [globalState]);
  const GetImg = () => {
    const [image] = useImage('https://cloudlove.s3.amazonaws.com/people.jpg');
    if (image) {
      //setImageWidth(image?.width);
      //setImagHeight(image?.height);
    }
    return <Image image={image} />;
  };
  //resizeObserver.observe(document.getElementById("myDivTag"));
  /*

x: 0
y: 0
width: 1536
height: 754
top: 0
right: 1536
bottom: 754
left: 0
  */
  /*
right: 650
bottom: 237
top: 134
score: 0.8818903565406799
id: "person"
left: 601
center: {x: 625.5, y: 185.5}
x: 601
y: 134
w: 49
h: 103

  */

  return (
    <div id="canvas-image" className={classes.canvas}>
      <Stage width={width} height={height}>
        <Layer>
          <GetImg />
        </Layer>
        <Layer>
          <Text
            text={`${distances.length} Infractions`}
            x={10}
            y={10}
            fontSize={30}
          />

          {globalState?.state?.people
            ? boxes.map((e, i) => {
                return e.distances.map((d, i) => {
                  return (
                    <Rect
                      key={`box_${i}`}
                      x={d.x}
                      y={d.y}
                      width={d.w}
                      height={d.h}
                      fill={globalState?.state?.fillColorPeople}
                      stroke={globalState?.state?.lineColorPeople}
                      strokeWidth={globalState?.state?.lineWidthPeople}
                      //shadowBlur={10}
                    />
                  );
                });
              })
            : null}
          {globalState?.state?.line
            ? distances.map((e, i) => {
                return (
                  <>
                    <Line
                      key={`line_${i}`}
                      x={0}
                      y={0}
                      points={[e.a.x, e.a.y, e.b.x, e.b.y]}
                      stroke={globalState?.state?.lineColorDistance}
                      strokeWidth={globalState?.state?.lineWidthDistance}
                    />
                    <Text
                      key={`line_text_${i}`}
                      x={(e.a.x + e.b.x) / 2}
                      y={(e.a.y + e.b.y) / 2}
                      text={`${Math.round(e.distance)}`}
                      fill={globalState?.state?.lineTextColorDistance}
                      strokeWidth={globalState?.state?.lineWidthDistance}
                      fontSize={20}
                    />
                  </>
                );
              })
            : null}
        </Layer>
      </Stage>
    </div>
  );
}
function cleanData(e, score_threshold, dist_threshold) {
  let clean = [];
  let dist = [];
  let temp = [];
  for (let i of e) {
    if (i.id === 'person' && i.score > score_threshold) {
      clean.push(i);
    }
  }
  //Get center point
  for (let i in clean) {
    clean[i].center = {
      x: (clean[i].right + clean[i].left) / 2,
      y: (clean[i].bottom + clean[i].top) / 2,
    }; //center cordinates
    clean[i].x = clean[i].left; //x
    clean[i].y = clean[i].top; //y
    clean[i].w = clean[i].right - clean[i].left; //width
    clean[i].h = clean[i].bottom - clean[i].top; //height
    clean[i].distances = []; //Distance between other objects
  }
  //Get distances
  for (let i in clean) {
    for (let f in clean) {
      if (f !== i) {
        const _d = Math.sqrt(
          Math.pow(clean[f].center.x - clean[i].center.x, 2) +
            Math.pow(clean[f].center.y - clean[i].center.y, 2)
        ); //Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2))
        if (_d < dist_threshold) {
          clean[i].distances.push({
            id: f,
            distnce: _d,
            x: clean[f].x,
            y: clean[f].y,
            w: clean[f].w,
            h: clean[f].h,
            center: clean[f].center,
          });
        }
      }
    }
  }
  for (let i of clean) {
    for (let f of i.distances) {
      dist.push({
        distance: f.distnce,
        a: i.center,
        b: f.center,
      });
    }
  }

  for (let i of dist) {
    let t = true;
    for (let f of temp) {
      if (f.b.x === i.a.x && f.b.y === i.a.y) {
        t = false;
      }
    }
    if (t) {
      temp.push(i);
    }
  }
  return { temp, clean, dist };
}

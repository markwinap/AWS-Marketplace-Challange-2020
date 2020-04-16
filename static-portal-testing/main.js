const score_threshold = 0.16;
const dist_threshold = 60;
let clean = [];
let dist = [];
let temp = [];

const load = () => {
  //Clean ARR
  for (let i of people) {
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
  console.log(temp);
  var c = document.getElementById('myCanvas');
  var ctx = c.getContext('2d');
  var img = document.getElementById('scream');
  ctx.drawImage(img, 0, 0, 866, 1300);
  var canvas = document.getElementById('myCanvas');
  var context = canvas.getContext('2d');

  for (let i in clean) {
    for (let f of clean[i].distances) {
      drawBox(context, clean[i]);
      //draText(context, clean[i].center, `${Math.round(f.distnce)}`);
      //draLine(context, clean[i].center, f.center);
      drawCenter(context, clean[i].center);
      //draText(context, clean[i], `${i}  - ${clean[i].score}`);
    }
    //context.fillText(`${i}  - ${clean[i].score}`, clean[i].left, clean[i].top);
  }
  for (let i of temp) {
    draText(
      context,
      { x: (i.a.x + i.b.x) / 2, y: (i.a.y + i.b.y) / 2 },
      `${Math.round(i.distance)}`
    );
    draLine(context, { x: i.a.x, y: i.a.y }, { x: i.b.x, y: i.b.y });
  }
};
window.onload = load;

function drawCenter(canvas, cordinates, color = 'lime') {
  canvas.beginPath();
  canvas.fillStyle = color;
  canvas.fillRect(cordinates.x, cordinates.y, 5, 5);
  canvas.stroke();
}
function drawBox(canvas, cordinates, color = 'yellow') {
  canvas.beginPath();
  canvas.strokeStyle = color;
  canvas.rect(cordinates.x, cordinates.y, cordinates.w, cordinates.h);
  canvas.stroke();
}
function draText(canvas, cordinates, text, size = 15, color = 'white') {
  canvas.beginPath();
  canvas.fillStyle = color;
  canvas.font = `${size}px serif`;
  canvas.fillText(text, cordinates.x, cordinates.y);
  canvas.stroke();
}
function draLine(canvas, corA, corB, color = 'red') {
  canvas.beginPath();
  canvas.strokeStyle = color;
  canvas.moveTo(corA.x, corA.y);
  canvas.lineTo(corB.x, corB.y);
  canvas.stroke();
}

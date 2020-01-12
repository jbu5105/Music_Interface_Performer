let video;
let poseNet;
let poses = [];
let skeletons = [];

let keypoints = [];
let prevkeypoints = [];

var socket;
var messagex;


function setup() {
  createCanvas(720, 480);
  video = createCapture(VIDEO);
  video.size(width, height);
  poseNet = ml5.poseNet(video, modelReady);
  poseNet.on('pose', gotPoses);
  video.hide();

  setupOsc(12000, 3334);
}

function modelReady() {
}

function draw() {
  image(video, 0, 0, width, height);
  drawKeypoints();
  drawSkeleton();

  fill(255,0,0,50);  
  noStroke();  
  rect(0, 0, width/3, height);  

  fill(0,255,0,50);  
  noStroke();  
  rect(width/3, 0, width/3, height);  

  fill(0,0,255,50);  
  noStroke();  
  rect(width/3*2, 0, width/3, height);  
 

}

function drawKeypoints()  {
  if (poses.length == 0) {
    return;
  }

  prevkeypoints = keypoints;
  keypoints = poses[0].pose.keypoints;

  if (prevkeypoints.length == 0) {
    return;
  }
  

  for (let k=0; k<keypoints.length; k++) {
    let k1 = prevkeypoints[k];
    let k2 = keypoints[k];

    fill(0, 255, 0);
    ellipse(k2.position.x, k2.position.y, 5, 5);

    if (k1.part == "rightWrist"){
      XrightWrist = k1.position.x;
      YrightWrist = k1.position.y;
      sendOsc('/XrightWrist', XrightWrist);
      sendOsc('/YrightWrist', YrightWrist);
    }else if (k1.part == "leftWrist"){
      XleftWrist = k1.position.x;
      YleftWrist = k1.position.y;
      sendOsc('/XleftWrist', XleftWrist);
      sendOsc('/YleftWrist', YleftWrist);
    }
    
    let d = dist(k1.position.x, k1.position.y, k2.position.x, k2.position.y);
    if (d < 25) {
      continue;
    }

    strokeWeight(3);
    stroke(255, 0, 0);
    line(k1.position.x, k1.position.y, k2.position.x, k2.position.y);
  }
}

function drawSkeleton() {
  for (let i = 0; i < poses.length; i++) {
    for (let j = 0; j < poses[i].skeleton.length; j++) {
      let partA = poses[i].skeleton[j][0];
      let partB = poses[i].skeleton[j][1];
      stroke(255, 0, 0);
      line(partA.position.x, partA.position.y, partB.position.x, partB.position.y);
    }
  }
}

function gotPoses(results) {
  poses = results;
}

function sendOsc(address, value) {
  socket.emit('message', [address].concat(value));
}

function receiveOsc(address, value) {
  console.log("received OSC: " + address + ", " + value);
}

function setupOsc(oscPortIn, oscPortOut) {
  socket = io.connect('http://127.0.0.1:8081', { port: 8081, rememberTransport: false });
  socket.on('connect', function() {
    socket.emit('config', { 
      server: { port: oscPortIn,  host: '127.0.0.1'},
      client: { port: oscPortOut, host: '127.0.0.1'}
    });
  });
  socket.on('message', function(msg) {
    if (msg[0] == '#bundle') {
      for (var i=2; i<msg.length; i++) {
        receiveOsc(msg[i][0], msg[i].splice(1));
      }
    } else {
      receiveOsc(msg[0], msg.splice(1));
    }
  });
}

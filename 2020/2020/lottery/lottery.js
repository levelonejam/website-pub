let x=0,y=0;
let color1;
let color2;

let size = 50;

let wheelSlot = [];
let overlay = [];

let gameJamColor;

let pSum = 0;

let lotHeight = 800;

let deacceleration = 0.1;
let slowDeacceleration = 0.05;

let names;
let nameLength;

splitSheet()
  .then(data => names = data)
  .then(d => nameLength = d.length)
  .then(() => asyncSetup())

let nameI = 0;

const nameHeight = 75;
let nameInc;
let overlayInc;

let winnerText;

let pop;
let party;
let drumroll;
function preload() {
  pop = loadSound('pop.mp3');
  party = loadSound('party.mp3');
  drumroll = loadSound('drumroll.mp3');
}
 

async function getSheetAllAsync(){
  let response = await fetch(`https:${"//"}sheets.googleapis.com/v4/spreadsheets/1n__UcSGBeYaHkBiJexry8fxdEWnc0Y_HhEgHCiCjVFw/values/A%3AC?majorDimension=DIMENSION_UNSPECIFIED&valueRenderOption=UNFORMATTED_VALUE&key=AIzaSyCqY0hb2ShiHFhGabBUc1arzKDLmYW0ktk`);
  let data = await response.json();
  return data;
}

async function splitSheet(){
  let data = await getSheetAllAsync();
  let raw = data.values;
  let namez = [];
  for (let index = 1; index < raw.length; index++) {
    if(raw[index][0] != '') continue;
    namez.push({"name":raw[index][1],"p":raw[index][2],"points":raw[index][2]});
  }
  return namez;
}

function getChances(uname){
  if(uname === undefined) {
    names.forEach(p => console.log(p.name, p.chance, p.points));
  } else {
    names.filter(p => p.name.toLowerCase().includes(uname.toLowerCase())).forEach(p => console.log(p.name, p.chance, p.points))
  }
}

async function asyncSetup(){
  for (let i = 0; i < names.length; i++) {
    pSum += names[i].p; 
  }

  console.log("Total points: " + pSum);

  for (let i = 0; i < names.length; i++) {
    names[i]["chance"] = nf((names[i].p/pSum)*100,0,2)+"%";
  }

  console.log(names);

  for (let i = 0; i < nameLength; i++) {
    while (names[i].p > 0){
      wheelSlot.push(names[i].name);
      names[i].p--;
    }
  }
  shuffleWheel(wheelSlot);
  shuffleWheel(wheelSlot);
  shuffleWheel(wheelSlot);
  shuffleWheel(wheelSlot);

  //console.log(wheelSlot);

  for (let i = 0; i < floor(pSum/2); i++) {
    overlay.push(wheelSlot.shift());
  }

  //console.log(wheelSlot);

  nameInc = nameHeight*wheelSlot.length;
  //console.log(nameInc);

  overlayInc = nameHeight*overlay.length;
  //console.log(overlayInc);
}

const confettiCannonSetting = (x,y) => {
  return {
    particleCount: 180,
    spread: 150,
    ticks:400,
    angle:100,
    startVelocity: 80,
    origin: { x: x , y : y}
  }
}

function confettiCannon(){
  party.play();
  sleep(()=> {
    pop.play();
    confetti(confettiCannonSetting(1,1))
  }
  ,() => {},random(500));

  sleep(()=>{
    pop.play();
    confetti(confettiCannonSetting(0,1))
  }
  ,() => {},random(500));
}

function setup() {
  let cnv = createCanvas(400,lotHeight);
  cnv.parent('canvasContainer');
  background(20,50,50);
  fill(255);
  textAlign(CENTER,CENTER);
  textSize(25);

  x = width/2; 
  
  let stateNames = ["Stopped","Stopping","Running","Waiting"];
  let elt = document.getElementById("status_text");
  wheel.stateListener = val => {
    elt.innerText = stateNames[val];
    if(val == 0) {
      sleep(() => confett2.start(),() =>{},1000);
      winnerText.innerHTML = "Winner is: "+winner+"!";
      confettiCannon();
      drumrollready = true;
    } else if(confett2.isRunning()){
      winnerText.innerHTML = "";
      confett2.stop();
    }
  }

  winnerText = document.getElementById("winner_text");
  
  color1 = color(50,50,50,0);
  color2 = color(255);
  gameJamColor = color("#21DC93");
}

function shuffleWheel(array) {
  array.sort(() => Math.random() - 0.5);
}

let moveVal = 0;
let wheel = {
  stateInternal: 0,
  stateListener: (val) => {},
  set state(val) {
    this.stateInternal = val;
    this.stateListener(val);
  },
  get state() {
    return this.stateInternal;
  },
  registerListener: (listener) => {
    this.stateListener = listener;
  }
}

function startWheel(speed){
  moveVal = speed;
  wheel.state = 2;
}
function stopWheel(){
  if(wheel.state != 3){
    wheel.state = 3;
    sleep(()=>{wheel.state = 1;},()=>{},random(10000));
  }
}

function sleep (fn, par, milis) {
  return new Promise((resolve) => {
    // wait 3s before calling fn(par)
    setTimeout(() => resolve(fn(par)), milis)
  })
}

startWheel(40);

let drumrollready = true;

function draw() {
  if(wheel.state === 1 && drumrollready && moveVal<7.5){
    drumrollready = false;
    drumroll.play();
  }
  // put drawing code here
  background(20,20,20);
 
  for (let i = 0; i < wheelSlot.length; i++) {
    fill(255);

    displayWheel(i,0);
    
    fill(255,0,0);
    displayOverlay(i,-nameInc);
    displayOverlay(i,nameInc);
    
  }
  translate(10,height/2);
  stroke(lerpColor(color(255),color(0,0),moveVal));
  line(0,0,width,0);
  noStroke();
  rotate(radians(45+90));
  fill(gameJamColor);
  triangle(0,20,20,0,0,0);
  

  if(wheel.state == 1){
    if (moveVal < 10) moveVal -= (slowDeacceleration/2);
    else if(moveVal < 20) moveVal -= slowDeacceleration;
    else moveVal -= deacceleration;
  }

  if(moveVal < 0){
    wheel.state = 0;
    moveVal = 0;
  }

  y+=moveVal;

  if(y > height) y -= (150*pSum-overlayInc*2);
  //nameHeight-1470;psum 23 //nameHeight-1770;psum 25 //nameHeight-1320; pSum = 22
}

let lerpVal;

function getL(i,off){
  return (height-nameHeight/2)-y-(i*nameHeight)+off
}

function displayWheel(i,offset){
  const l = getL(i,offset);
  colorStuff(l);
  getWinner(l,wheelSlot[i]);
  text(wheelSlot[i],width/2,l);
}

function displayOverlay(i,offset){
  const l = getL(i,offset);
  colorStuff(l);
  line(0,lotHeight/2+200,width,lotHeight/2+200);
  getWinner(l,overlay[i%overlay.length]);
  text(overlay[i%overlay.length],width/2,l);
}

function getWinner(l,item){
  if(winner != item && l-(nameHeight/2) < lotHeight/2 && l+(nameHeight/2) > lotHeight/2 && moveVal < 0.1) {
    console.log(item);
    winner = item;
  }
}

let winner;
let nv;
let mv;
function colorStuff(lval){
  if(lval < height/2) lerpVal = map(lval,height/2,0,1,0);
  else lerpVal = map(lval,height/2,height,1,0); 
  fill(lerpColor(color1,color2,constrain(lerpVal,0,1)));
  nv = constrain(lerpVal-moveVal,0,1);  
  stroke(lerpColor(color1,gameJamColor,nv));
  line(0,lval-(nameHeight/2),width,lval-(nameHeight/2))
  noStroke();
}
let player;
let playerIsDone;
let playerEvent;
let playerIsStarted;
let playerIsNotInFrame;
function onYouTubePlayerAPIReady() {
    player = new YT.Player('player', {
      height: '1000',
      width: '1920',
      videoId: options[0]["videoId"],
      playerVars: {rel: 0, showinfo: 0, ecver: 2},

      events: {
        onReady: onPlayerReady,
        onStateChange: onPlayerStateChange
      }
    });
}

const lowerOffset = 120;//Above Frame
const upperOffset = 240;//Below Frame

function getVideoId(){
  
}

function onNotInFrame(){
    playerEvent.target.pauseVideo();
    //console.log("Not in frame");
    //setVolumeSmooth(player.getVolume(),0,-5,500);
    //player.mute();
}

function onInFrame(){
    playerEvent.target.playVideo(); 
    //setVolumeSmooth(0,25,5,1000);
    player.unMute();
}

// autoplay video
function onPlayerReady(event) {
    //event.target.playVideo();
    playerEvent = event;
    //event.target.pauseVideo();   
    event.target.setVolume(0); 
}

// when video ends
function onPlayerStateChange(event) {        
    if(event.data === 0) {          
        //alert('done');
        playerIsDone = true;
        player.stopVideo();
    } 
    if(event.data === 1) playerIsNotInFrame = false;  
}

function setVolumeSmooth(start,value,rate,interval){
  let vol = start;
  let iv = setInterval(() => {
    playerEvent.target.setVolume(vol += rate);
    if(vol >= value && rate > 0) clearInterval(iv);
    if(vol <= value && rate < 0) clearInterval(iv);
  }, interval);
}

window.onscroll = function() {
  if(isOutOfFrame()){
    if(playerIsDone) return;
    if(playerIsNotInFrame) {
        onInFrame();
        playerIsNotInFrame = false;
    }
  } else if(!playerIsDone && playerEvent && !playerIsNotInFrame){
    playerIsNotInFrame = true;
    onNotInFrame();
  }
}

function isOutOfFrame(){
  let hero = document.getElementById('hero');
  return window.scrollY > (hero.offsetTop-lowerOffset) && window.scrollY < (hero.offsetTop+upperOffset);
}
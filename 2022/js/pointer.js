//Pointer-Query for the map
let p;
function pointer(){
  p = document.getElementById("marker");
}

window.onhashchange = () => { 
  findQuery();  
}

function findQuery(){
  let meh = document.location.hash;
  if(meh.startsWith("#find?floor=")){
    document.location.hash = "#find";
    let str = meh.replace("#find?floor=","");
    let strs = str.split("&");
    if(strs[0].length !== 2) return;
    let floor = strs[0];
    if(strs.length<2) {
      showPOI(floor,0,0);
      removePointer();
    }else {
      let x = parseFloat(strs[1].replace("x=",""));
      let y = parseFloat(strs[2].replace("y=",""));
      showPOI(floor,x,y);
    }
    jump("find");
  }
}

function jump(h){
  var url = location.href;               //Save down the URL without hash.
  location.href = "#"+h;                 //Go to the target element.
  history.replaceState(null,null,url);   //Don't like hashes. Changing it back.
}

function setPointer(x,y){
  p.style.top = y+ "%";
  p.style.left = x + "%";
  p.classList.add("is-active");
  p.classList.remove("is-hidden");
}

function removePointer(){
  p.classList.add("is-hidden");
  p.classList.remove("is-active");
}

function showPOI(level,x,y){
  switchTab("mapTabs",level.toLowerCase());
  setPointer(x,y);
}
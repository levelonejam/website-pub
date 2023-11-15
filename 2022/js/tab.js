//Generation and Logic for tabs
const tabs = [];
function generateTab(id,tabName){
  if(tabName === '') return;
  //Generates html of the individual tab-headers
  let tabNamelc = tabName.toLowerCase();
  let a = document.createElement("a");
  a.setAttribute("type","button");
  a.setAttribute("onclick",`switchTab('${id}','${tabNamelc}');`);
  a.innerText = replaceAll(tabName,"_"," ");
  let li = document.createElement("li");
  li.setAttribute("id", `${tabNamelc}-tab`);
  li.appendChild(a);
  let tc = document.getElementById(id);
  tc.appendChild(li);

  //Checks to see if given tabId already exists
  let tset = tabs.filter(t => t.id === id);
  if(tset.length == 0) { 
    //Does not exist, create new tab list with id
    let m = {
      "id"   : id,
      "tabs" : Array.of(tabNamelc)
    };
    //Set first as default is-active
    document.getElementById(`${tabNamelc}-tab`).classList.add("is-active");
    //Add to tab-list
    tabs.push(m);
  } else {
    //Does tab name already exist?
    tset[0].tabs.push(tabNamelc);
  }
}

function replaceAll(str, find, replace) {
  return str.replace(new RegExp(find, 'g'), replace);
}

const active = "is-active";
const hidden = "is-hidden";

//Show tab content, id of the tabcontainer and the tabName you want to show
function switchTab(id,tabName){

  if(id === "mapTabs") removePointer();
  //Get the first tab that matches the id
  let ts = tabs.filter(e => e.id === id)[0];

  //Get all tabs that is not equal to selected tabname and hide them (CSS)
  ts.tabs.filter(tname => tname !== tabName).forEach(tN => {
    let tab = document.getElementById(`${tN}-tab`).classList;
    //console.log("looking to hide: " + tN);
    if(!document.getElementById(tN)) {console.error("Content not found/not assigned"); return;}
    let content = document.getElementById(tN).classList;
    if(tab.contains(active)) tab.remove(active);
    if(!content.contains(hidden)) content.add(hidden);
  });

  //Get the one tab that is equal and show it (CSS)
  ts.tabs.filter(tname => tname === tabName).forEach(tN => {
    let tab = document.getElementById(`${tN}-tab`).classList;
    //console.log("looking to show: " + tN);
    if(!document.getElementById(tN)) {console.error("Content not found/not assigned"); return;}
    let content = document.getElementById(tN).classList;
    if(!tab.contains(active)) tab.add(active);
    if(content.contains(hidden)) content.remove(hidden);
  })
}

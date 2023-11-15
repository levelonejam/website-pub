//Generation and logic for announcements
const announcements = [];
function addAnnouncement(include,name,date,msg,rel,relDate){
  if(!include) return;
  //console.log({include,name,date,msg,rel,relDate});
  if(searchFirstAnnouncement(name)) {
    console.error("An announcement with a same name has already been declared, halting function");
    return;
  }
  const ann = {
    "name" : name
  }
  
  if(msg)  ann.msg = msg;
  //Check if an absolute or a relative date
  if(date === undefined || date !== "") {
    ann.date = new Date(date);
  } else if(rel && relDate) {
    let relativeMilis;
    //Checks if the relative date should subtract or add to the date it is referencing
    if(rel.startsWith("-")){
      let s = rel.substr(1);
      let d = new Date(s);
      //console.log((searchFirstAnnouncement(relDate).date.getTime()) + " - " +(d.getTime()))
      relativeMilis = searchFirstAnnouncement(relDate).date.getTime()-d.getTime()-3600000;//1 Hour
      //console.log(new Date(relativeMilis));
    } else {
      let d = new Date(rel);  
      relativeMilis = searchFirstAnnouncement(relDate).date.getTime()+d.getTime();
    }
    ann.date = new Date(relativeMilis);
    //console.log(ann);
  } else {
    console.error("Wrong format in settings.yaml, every announcement needs a date or a relative date");
  }
  announcements.push(ann);

  //Sort announcements
  sortAnnouncementsSmall2Big(announcements);
}

function sortAnnouncementsSmall2Big(ann){
  ann.sort((b,a) => {
    return new Date(b.date) - new Date(a.date);
  });
}

function sortAnnouncementsBig2Small(ann){
  ann.sort((a,b) => {
    return new Date(b.date) - new Date(a.date);
  });
}

let at;
function initAnnouncement(){
  at = document.getElementById("announcementText");
}

function getRelevantAnnouncement(){
  // Finding all in the array that is less than 
  // or equal to the current time (prior or at the current time)
  let validAnn = announcements.filter(ann => ann.date <= new Date());
  sortAnnouncementsBig2Small(validAnn);
  let index = announcements.findIndex(a => a === validAnn[0]);
  if(index === -1) return "";
  return announcements[index].msg;
}

function updateAnnouncement(){ 
  at.innerHTML = md.render(getRelevantAnnouncement());
}

function searchFirstAnnouncement(str){
    return announcements.filter(e => e.name === str)[0];
}
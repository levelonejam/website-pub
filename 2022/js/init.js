/*
  Functionality overview:
    Initial calls
    Settings handling
    Pointer handling - CSS/Scaling is still inconsistent
    Tab handling - Not scaling as intended on mobile
    Event Countdown handling (Add/Call)
    Announcement Countdown handling (Add/Call)
    Utility functions
*/

//Automated announcements can be found in announcements.js
let startOfJam;
let endOfJam;

function initProgram(){
  //Get the dates of the Jam
  startOfJam = searchFirstAnnouncement("start").date;
  endOfJam = searchFirstAnnouncement("end").date;

  //Starts and displays the countdown
  countdown();
  //Set the program to show the relevant tab based on the day of the jam
  switchTab("programTabs",getDayWordBasedOnProgress().toLowerCase());

  //Get theme for this year
  fetch(options[0]["themeURL"]).then((resp) => resp.text().then(receivedTheme));  
}

//TODO Need errorhandling in case of 404 and when empty(should then not show anything theme text)
function receivedTheme(themeTxt){
  if(themeTxt.trim() === "") return;
  let info = getJamInfo();
  if(info.isStarted){
    document.getElementById("themeAnnouncementSubtext").innerText = "This event's theme is: ";
    document.getElementById("themeAnnouncement").innerText = themeTxt;
  } else if (info.hasEnded) {
    document.getElementById("themeAnnouncementSubtext").innerText = "Last event's theme was: ";
    document.getElementById("themeAnnouncement").innerText = themeTxt;
  }
}

function getJamInfo(){
    return {
        isStarted: startOfJam < Date.now(),
        hasEnded: endOfJam < Date.now()
    }
}

//Returns a text string with of a day of the week 
//that is most appropriate to show the user during the jam
function getDayWordBasedOnProgress(){
  let deltaDay = endOfJam.getDate() - startOfJam.getDate() + 1;
  let ji = getJamInfo();
  if(ji.isStarted){
    if(ji.hasEnded) {
      return getDayWord(endOfJam);
    } else {
      return getDayWord(addDays(startOfJam,deltaDay));
    }
  } else {
    //Has not started yet
    return getDayWord(startOfJam);
  }
}



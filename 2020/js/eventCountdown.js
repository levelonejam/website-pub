//Countdown to the event and countdown to the end of the event
function countdown() {
    let overrideAnnouncement = false;
    //Set the date we're counting down to
    //Either it is the countdown to:
    let countdownTo = getJamInfo().isStarted?"end":"start";

    //Start of the jam or when the Jam ends
    let countdownT = getJamInfo().isStarted?endOfJam:startOfJam;

    //Get the time difference between now and the date we're counting to
    let distance = getDeltaTime(countdownT);

    //Get the time HTML tag
    let timeTag = document.getElementById("countdown");

    let countdownText = document.getElementById("countdowntext");

    countdownText.textContent = getCountDownText(countdownTo==="start"?"pre-jam":"mid-jam");

    initAnnouncement();

    //Setup the timer, with params: start on init, what to count to, countRate (in ms)
    let timer = new Timer(true,distance+1000,1000);

    //What to do each update of the timer (is determined by countRate)
    timer.setOnUpdate(() => {
        //Get the time left of the timer
        let timeLeft = getCurrentCountdown(timer.counterMS);

        //Update the text of the time HTML tag
        timeTag.textContent = (`${timeLeft.days} d ${timeLeft.hours} h ${timeLeft.minutes} m ${timeLeft.seconds} s`); 
        
        updateAnnouncement();        
    })

    //What to do if the countdown is finished
    timer.setOnEnd(() =>{
        console.log("Timer is complete");
        
        if(countdownTo === "start"){
        //Update the text of the time HTML tag with an finish message
        countdownText.textContent = getCountDownText("mid-jam");
        } else if (countdownTo === "end") {
        countdownText.textContent = "The event is over!";
        timeTag.textContent = "Come back next year";
        return;
        }
        //Automatically starts the next countdown
        //and stops if it is past the defined dates in settings.yaml
        countdown();
    })

    let at = document.getElementById("announcementText");
    at.innerHTML = md.render(getRelevantAnnouncement());
}

let countdownText;

function setCountdownText(){
    countdownText = [
        {
            name: "pre-jam",
            msg:`Time until ${options[0]["name"]}`
        },
        {
            name: "mid-jam",
            msg:`Time until ${options[0]["name"]} ends`
        }
    ];
}

function getCountDownText(str){
    return countdownText.filter(e => e.name === str)[0].msg;
}
//Utility functions
const weekdays = new Array(
    "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"
);

function getDayWord(date){
    return weekdays[date.getDay()];
}

function addDays(date, days) {
    const copy = new Date(Number(date))
    copy.setDate(date.getDate() + days)
    return copy;
}

function getDeltaTime(date){
    // Get today's date and time
    let now = new Date().getTime();
    // Set the date we're counting down to
    let when = date.getTime();
    // Find the distance between now and the count down date
    let delta = when - now;
    return delta;
}
  
// Time calculations for days, hours, minutes and seconds
function getCurrentCountdown(distance){
    return {
        days : Math.floor(distance / (1000 * 60 * 60 * 24)),
        hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes : Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
        seconds : Math.floor((distance % (1000 * 60)) / 1000)
    }
}
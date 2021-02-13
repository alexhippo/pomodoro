/*global Audio: false */
/*jslint devel: true */

//Pre-load audio
var breakTime = document.getElementById("breakSound"),
    workTime = document.getElementById("pomoSound"),
    minutesDisplay = document.getElementById("minutes"),
    secondsDisplay = document.getElementById("seconds"),
    sessionType = 'p',
    statusMsg = document.getElementById("status"),
    pomoInterval;

function hideArrows() {
    "use strict";
    document.getElementById("plus").style.visibility = "hidden";
    document.getElementById("minus").style.visibility = "hidden";
}

function showArrows() {
    "use strict";
    document.getElementById("plus").style.visibility = "visible";
    document.getElementById("minus").style.visibility = "visible";
}

function enablePomoBreak() {
    "use strict";
    document.getElementById("startPomo").disabled = false;
    document.getElementById("setBreak").disabled = false;
    document.getElementById("setPomo").disabled = false;
}

function disablePomoBreak() {
    "use strict";
    document.getElementById("startPomo").disabled = true;
    document.getElementById("setBreak").disabled = true;
    document.getElementById("setPomo").disabled = true;
}

function resetTimer() {
    "use strict";
    minutesDisplay.innerHTML = "25";
    secondsDisplay.innerHTML = "00";
    statusMsg.innerHTML = "Let's get to work!";
    showArrows();
    enablePomoBreak();
    clearInterval(pomoInterval);
}

function pauseTimer() {
    "use strict";
    if (typeof pomoInterval === 'undefined') {
        return false;
    } else {
        clearInterval(pomoInterval);
        statusMsg.innerHTML = "Paused";
        document.getElementById("startPomo").disabled = false;
    }
}

function increment() {
    "use strict";
    var newMinutes = (Number(minutesDisplay.innerHTML)) + 1;
    if (newMinutes < 10) {
        minutesDisplay.innerHTML = "0" + newMinutes;
    } else {
        if (newMinutes > 59) {
            return false;
        } else {
            minutesDisplay.innerHTML = newMinutes;
        }
    }
}

function decrement() {
    "use strict";
    var newMinutes = (Number(minutesDisplay.innerHTML)) - 1;
    if (newMinutes < 10) {
        if (newMinutes <= 0) {
            return false;
        } else {
            minutesDisplay.innerHTML = "0" + newMinutes;
        }
    } else {
        minutesDisplay.innerHTML = newMinutes;
    }
}

function setBreak() {
    "use strict";
    minutesDisplay.innerHTML = "05";
    secondsDisplay.innerHTML = "00";
    statusMsg.innerHTML = "Break time!";
    sessionType = 'b';
}

function setPomodoro() {
    "use strict";
    minutesDisplay.innerHTML = "25";
    secondsDisplay.innerHTML = "00";
    statusMsg.innerHTML = "Let's get to work!";
    sessionType = 'p';
}

function timeForABreak() {
    "use strict";
    breakTime.play();
    alert("Pomodoro Timer: Great work! Time for a break.");
    setBreak();
    enablePomoBreak();
    showArrows();
}

function timeForWork() {
    "use strict";
    workTime.play();
    alert("Pomodoro Timer: Time to work!");
    setPomodoro();
    enablePomoBreak();
    showArrows();
}


function pomodoro() {
    "use strict";
    //Generate times - startTime and endTime
    var startTime = new Date(),
        endTime = new Date(),
    //Create endTime - take in the current time
        intervalMin = Number(minutesDisplay.innerHTML),
        intervalSec = Number(secondsDisplay.innerHTML),
        diffInMs,
        diffInSecs,
        amountOfHours,
        amountOfSeconds,
        amountOfMinutes;
        
    endTime.setMinutes(endTime.getMinutes() + intervalMin);
    endTime.setSeconds(endTime.getSeconds() + intervalSec);
    
    //Do not allow users to change the time while pomodoro/break is in progress
    hideArrows();
    disablePomoBreak();

    //Find the difference between the times - pomoTimeSeconds & pomoTimeMinutes
    diffInMs = endTime - startTime;
    diffInSecs = Math.round(diffInMs / 1000);
    amountOfHours = Math.floor(diffInSecs / 3600);
    amountOfSeconds = diffInSecs - (amountOfHours * 3600);
    amountOfMinutes = Math.floor(amountOfSeconds / 60);
    
    amountOfSeconds = amountOfSeconds - (amountOfMinutes * 60);

    //Update minutes on page
    if (amountOfMinutes > 0) {
        if (amountOfMinutes < 10) {
            minutesDisplay.innerHTML = "0" + amountOfMinutes;
        } else {
            minutesDisplay.innerHTML = amountOfMinutes;
        }
    } else {
        minutesDisplay.innerHTML = "00";
    }

    //Update seconds on page
    if (amountOfSeconds > 0) {
        if (amountOfSeconds < 10) {
            secondsDisplay.innerHTML = "0" + amountOfSeconds;
        } else {
            secondsDisplay.innerHTML = amountOfSeconds;
        }
    } else {
        secondsDisplay.innerHTML = "00";
    }

    //Countdown the time and display
    function pomoCountDown() {
        var dateNow = new Date(),
            minutes,
            seconds;

        if (endTime > dateNow) {
            //use current values
            minutes = parseInt(minutesDisplay.innerHTML, 10);
            seconds = parseInt(secondsDisplay.innerHTML, 10);

            //update minutes
            if (seconds === 0) {
                if (minutes > 0) {
                    minutes -= 1;
                    if (minutes < 10) {
                        minutesDisplay.innerHTML = "0" + minutes;
                        secondsDisplay.innerHTML = "59";
                    } else {
                        minutesDisplay.innerHTML = minutes;
                        secondsDisplay.innerHTML = "59";
                    }
                } else {
                    secondsDisplay.innerHTML = "59";
                    return secondsDisplay.innerHTML;
                }
            } else {
                seconds -= 1;
                if (seconds < 10) {
                    secondsDisplay.innerHTML = "0" + seconds;
                } else {
                    secondsDisplay.innerHTML = seconds;
                }
            }
        } else {
            secondsDisplay.innerHTML = "00";
            minutesDisplay.innerHTML = "00";
            clearInterval(pomoInterval);
            if (sessionType === 'p') {
                timeForABreak();
            } else {
                timeForWork();
            }
        }
    }
    pomoInterval = setInterval(pomoCountDown, 1000);
}
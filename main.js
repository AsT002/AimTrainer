var canvas = document.getElementById("canvas");
var context = canvas.getContext("2d");
var popAudio = new Audio("./pop.mp3");
var score = 0;
var score_label = document.getElementById("score");
var time_label = document.getElementById("timer");

function getTime(then) {
    return ((Date.now() - then) / 1000).toFixed(2)
}
 

// keeps track of time since the start

canvas.height = window.innerHeight;
canvas.width = window.innerWidth;

class Target {
    constructor(x, y, radius) {
        this.x = x;
        this.y = y;
        this.radius = radius;

        this.upd();
    }

    upd() {
        context.beginPath();
        context.fillStyle = "#0096FF";
        context.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
        context.fill();
        context.closePath();
    }
}

function updateAll(targetsArr) {
    for (var i = 0; i < targetsArr.length; i ++) {
        targetsArr[i].upd();
    }
}

function resize(arr = array) {
    var iHeight = window.innerHeight;
    var iWidth  = window.innerWidth;
    canvas.height = Math.max(iHeight, 200);
    canvas.width = Math.max(iWidth, 200);

    if (arr) {
        updateAll(arr);
    }
}

window.addEventListener("resize", function() {
    resize(arr=targetsArr);
});

function randomPos(rad = 5) {
    var boundary = [canvas.width - rad, canvas.height - rad];

    return [Math.floor(Math.random() * boundary[0]), Math.floor(Math.random() * boundary[1])];
}

function newTarget(targets, radius = 10) {
    targets.push(new Target(...randomPos(radius), radius = radius));
}

function delTarget(targets, indx) {
    context.clearRect(0, 0, canvas.width, canvas.height);
    targets.splice(indx, 1)

    // redraw all the targets

    for (var i = 0; i < targets.length; i ++) {
        targets[i].upd();
    }
}

var targetsArr = [];
var targetAmount = 5; // How many target there will be at a given moment.

function startGame() {
    var targetSize = NaN;

    while (isNaN(targetSize) || targetSize < 10 || targetSize > 50) {
        targetSize = window.prompt("Choose the size of the targets (10 - 50)px");
    }

    for (var i = 0; i < parseInt(targetAmount); i ++) {
        newTarget(targetsArr, targetSize);
    }

    return targetSize;
}

window.addEventListener("load", function() {
    // start game
    var targetSize = startGame();

    var startTime = Date.now();

    setInterval(function() {
        var time = getTime(startTime)
        time_label.innerHTML = "Time: " + (time).toString() + "s"
    }, 150); // update timer every 150 ms.
    
    // mouse click event
    window.addEventListener("click", function(event) {
        var clickPos = [event.clientX, event.clientY]

        // check if the mouse clicked 
        var missed = true;

        for (var i = 0; i < targetsArr.length; i ++) {
            var target = targetsArr[i];

            console.log("clicked " + clickPos.concat());

            // check for click on target
            var distance = Math.sqrt((target.x - clickPos[0]) ** 2 + (target.y - clickPos[1]) ** 2);

            if (distance <= target.radius) {
                // clicked on target
                score += Math.min(((1/target.radius)) * 50, 3);

                // play an audio
                popAudio.play();

                delTarget(targetsArr, i);
                newTarget(targetsArr, targetSize);

                missed = false;
            }
        }

        if (missed) {
            score -= 1;
        }
        score_label.innerHTML = "Score: " + (score).toString();
    })

    this.window.addEventListener("keydown", function(event) {
        // when q is pressed
        if (event.key == 'q') {
            // remove all targets 
            targetsArr = [];
            context.clearRect(0, 0, canvas.width, canvas.height);
            score_label.innerHTML = "Score: " + (0).toString();

            targetSize = startGame();

            // reset timer and score
            startTime = Date.now();
            score = 0;
        }
    })
})
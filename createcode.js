var flower = document.createElement("audio");
flower.setAttribute("src", "flower.mp3");
flower.volume = 0.02
var fwip = document.createElement("audio");
fwip.setAttribute("src", "fwip.mp3");
fwip.volume = 0.1
var light = document.createElement("audio");
light.setAttribute("src", "lighter.mp3");
light.volume = 0.1


function downloadCSV(csv, filename)
{var csvFile; var downloadLink;
csvFile = new Blob([csv], {type:"text/csv"});
dpownloadLink = document.createElement("a");
downloadLink.download = filename;
downloadLink.href = window.URL.createObjectURL(csvFile);
downloadLink.style.display = "none";

document.body.appendchild(downloadLink);

downloadLink.click();
}

function exportDataToCSV(filename)
{
    var csv = [];
    var rows = document.querySelectorAll(table, tr); //edit query to select arrays from js and/or transfer data to document body table
    
    for(var i = 0; i<rows.length; i++){
        var row =[], cols=rows[i].querySelectorAll("td,th");
        for(var j=0; j<cols.length;j++)
        row.push(cols[j].innerText);
        csv.push(row.join(","));
    }
    //download csv file
    downloadCSV(csv.join("\n"), filename);
}

//DEFINE CANVAS AND CONTEXT
//-------------------------------------------------------------------------
var cvs = document.getElementById('gamecvs');
//sets a variable which calls the game canvas/container
var ctx = cvs.getContext('2d');
//allows the 2d image variant to be drawn on the canvas
//--------------------------------------------------------------------------

//FRAMERATE EDITING VARIABLES
//--------------------------------------------------------------------------
lastFrameTimeMs = 0,
    maxFPS = 100,
    delta = 0,
    timestep = 1000 / maxFPS,
    framesThisSecond = 0,
    lastFpsUpdate = 0;
//--------------------------------------------------------------------------
//DEFINE GLOBAL VARIABLES
//--------------------------------------------------------------------------
var clickValue = {
    x: null,
    y: null,
    newx: null,
    newy: null,
    deltax: null,
    deltay: null,
}
var selectionMade = false;
var topleft = { x: 100, y: null }
var bottomright = { x: null, y: null }
var bottomleft = { x: null, y: null }
var topright = { x: null, y: null }
var clickValue = {
    x: null,
    y: null,
}
var levelnumber = 0;
const sprite = new Image();
sprite.src = "black.png";
const grav = 0.04 / 100 * cvs.height;      //sets gravitational acceleration
var background = true;       // TRUE is BLACK, FALSE is WHITE
var platforms = [];
var walls = [];
var frames = 0
var map =
{
    width: cvs.width * 2,
    height: cvs.height,
}






var bg =
{
    draw: function () {
        ctx.fillStyle = ((background) ? "black" : "white");
        ctx.fillRect(0, 0, cvs.width, cvs.height);
    },
}

//CHARACTER CLASS
//-----------------
class Character {
    constructor(x, y, w, h) {
        this.x = x
        this.y = y
        this.width = w
        this.height = h
        this.selected = false;
    }
    drag() {
        if (this.selected) {
            this.x -= clickValue.deltax
            this.y -= clickValue.deltay
        }
    }
    expand() {
        if (this.selected) {

            this.x -= (mySelection.stayx) ? 0 : clickValue.deltax
            
            this.width += (mySelection.stayratio) ? mySelection.ratiowh * clickValue.deltax: clickValue.deltax
            if(mySelection.stayw) {(this.width=.005*cvs.width)/cvs.width*100; mySelection.x=this.x*cvs.width/100}

            this.y -= (mySelection.stayy) ? 0 : clickValue.deltay

            this.height += (mySelection.stayratio) ? mySelection.ratiohw * clickValue.deltax: clickValue.deltay
            if(mySelection.stayh) {(this.height=.005*cvs.width)/cvs.height*100; mySelection.y=this.y*cvs.height/100}
        }

    }
    draw() {
        sprite.src = (background ? "white.png" : "black.png")
        ctx.drawImage(sprite, 0, 0, 160, 160,
            this.x / 100 * cvs.width - myCam.x,
            this.y / 100 * cvs.height,
            this.width / 100 * cvs.width,
            this.height / 100 * cvs.height);
            
    }
    update() {
        this.selected = false;
        if (
            clickValue.y >= this.y
            && clickValue.y <= this.y + this.height
            && this.color != ((background) ? 2 : 0)
            && clickValue.x >= this.x
            && clickValue.x <= this.x + this.width
            && !selectionMade
        ) {
            console.log("hi")
            topleft.x = this.x; topleft.y = this.y;
            topright.x = this.x + this.width; topright.y = this.y
            bottomleft.x = this.x; bottomleft.y = this.y + this.height
            bottomright.x = this.x + this.width; bottomright.y = this.y + this.height
            this.selected = true
            selectionMade = true
        }
    }
}

//--------------------------------------------------------------------------
class Wall {
    constructor(color, x, y, w, h) {
        this.color = color;
        this.w = w
        this.h = h
        this.x = x
        this.y = y
        this.selected = false
    }
    drag() {
        if (this.selected) {
            this.x -= clickValue.deltax
            this.y -= clickValue.deltay
        }
    }
    expand() {
        if (this.selected) {

            this.x -= (mySelection.stayx) ? 0 : clickValue.deltax
            this.w += (mySelection.stayw) ? ((mySelection.w-4)/cvs.width*100) : (mySelection.stayratio) ? mySelection.ratiowh * clickValue.deltax: clickValue.deltax


            this.y -= (mySelection.stayy) ? 0 : clickValue.deltay

            this.h += (mySelection.stayh) ? ((mySelection.h-4)/cvs.height*100) : (mySelection.stayratio) ? mySelection.ratiohw * clickValue.deltax: clickValue.deltay

        }

    }
    draw() {
        if (this.color != ((background) ? 2 : 0)) {
            ctx.fillStyle = ((this.color == 1) ? "grey" : ((this.color == 2) ? 'black' : 'white'));
            ctx.fillRect(
                this.x / 100 * cvs.width - myCam.x,
                this.y / 100 * cvs.height,
                this.w / 100 * cvs.width,
                this.h / 100 * cvs.height);
                (10+this.w*this.h/10000*cvs.width<25)? ctx.font=10+this.w*this.h/10000*cvs.width+'px Gadget': ctx.font=ctx.font
               ctx.font='bold';
                ctx.fillStyle = "lime";
                ctx.textAlign = "center";
                ctx.fillText("WALL", this.x / 100 * cvs.width - myCam.x+ this.w/100*cvs.width/2,  this.y / 100 * cvs.height + this.h / 100 * cvs.height/2);
        }

    }
    update() {
        this.selected = false;
        if (
            clickValue.y >= this.y
            && clickValue.y <= this.y + this.h
            && this.color != ((background) ? 2 : 0)
            && clickValue.x >= this.x
            && clickValue.x <= this.x + this.w
            && !selectionMade
        ) {
            topleft.x = this.x; topleft.y = this.y
            topright.x = this.x + this.w; topright.y = this.y
            bottomleft.x = this.x; bottomleft.y = this.y + this.h
            bottomright.x = this.x + this.w; bottomright.y = this.y + this.h
            this.selected = true;
            selectionMade = true;
            return;
        }
    }

}



class Platform {
    constructor(color, x, y, w, h) {
        this.color = color;
        this.w = w
        this.h = h
        this.x = x
        this.y = y
        this.selected = false
    }
    drag() {
        console.log("plat drag")
        if (this.selected) {
            this.x -= clickValue.deltax
            this.y -= clickValue.deltay
        }
    }
    expand() {
        console.log("plat expand")
        if (this.selected) {

            this.x -= (mySelection.stayx) ? 0 : clickValue.deltax
            this.w += (mySelection.stayw) ? ((mySelection.w-4)/cvs.width*100) : (mySelection.stayratio) ? mySelection.ratiowh * clickValue.deltax: clickValue.deltax


            this.y -= (mySelection.stayy) ? 0 : clickValue.deltay

            this.h += (mySelection.stayh) ? ((mySelection.h-4)/cvs.height*100) : (mySelection.stayratio) ? mySelection.ratiohw * clickValue.deltax:clickValue.deltay

        }
    }
    draw() {
        if (this.color != ((background) ? 2 : 0)) {
            ctx.fillStyle = ((this.color == 1) ? "grey" : ((this.color == 2) ? 'black' : 'white'));
            ctx.fillRect(
                this.x / 100 * cvs.width - myCam.x,
                this.y / 100 * cvs.height,
                this.w / 100 * cvs.width,
                this.h / 100 * cvs.height
            );
            (10+this.w*this.h/10000*cvs.width<25)? ctx.font=  10+this.w*this.h/10000*cvs.width+'px Gadget': ctx.font=ctx.font
            ctx.font='bold';  
            ctx.fillStyle = "red";
                ctx.textAlign = "center";
                ctx.fillText("PLAT", this.x / 100 * cvs.width - myCam.x + this.w/100*cvs.width/2,  this.y / 100 * cvs.height + this.h / 100 * cvs.height/2);
        }
    }
    update() {
        this.selected = false;
        if (
            clickValue.y >= this.y
            && clickValue.y <= this.y + this.h
            && this.color != ((background) ? 2 : 0)
            && clickValue.x >= this.x
            && clickValue.x <= this.x + this.w
            && !selectionMade
        ) {

            console.log("RESET TOPLEFT ETC")
            topleft.x = this.x; topleft.y = this.y
            topright.x = this.x + this.w; topright.y = this.y
            bottomleft.x = this.x; bottomleft.y = this.y + this.h
            bottomright.x = this.x + this.w; bottomright.y = this.y + this.h
            this.selected = true;
            selectionMade = true
        }
    }




}



class Win {
    constructor(x, y, w, h) {
        this.x = x
        this.y = y
        this.w = w
        this.h = h
        this.selected = false
    }

    drag() {
        if (this.selected) {
            this.x -= clickValue.deltax
            this.y -= clickValue.deltay
        }
    }
    expand() {
        if (this.selected) {

            this.x -= (mySelection.stayx) ? 0 : clickValue.deltax
            this.w += (mySelection.stayw) ? ((mySelection.w-4)/cvs.width*100) : (mySelection.stayratio) ? mySelection.ratiowh * clickValue.deltax: clickValue.deltax


            this.y -= (mySelection.stayy) ? 0 : (mySelection.stayratio) ? mySelection.ratiohw * clickValue.deltax:clickValue.deltay

            this.h += (mySelection.stayh) ? ((mySelection.h-4)/cvs.height*100) : (mySelection.stayratio) ? mySelection.ratiohw * clickValue.deltax: clickValue.deltay

        }

    }



    draw() {
        ctx.fillStyle = "red";
        ctx.fillRect(
            this.x / 100 * cvs.width - myCam.x,
            this.y / 100 * cvs.height,
            this.w / 100 * cvs.width,
            this.h / 100 * cvs.height
        );
    }
    update() {
        console.log("anyone?")
        this.selected = false;
        if (
            clickValue.y >= this.y
            && clickValue.y <= this.y + this.h
            && this.color != ((background) ? 2 : 0)
            && clickValue.x >= this.x
            && clickValue.x <= this.x + this.w
            && !selectionMade
        ) {
            topleft.x = this.x; topleft.y = this.y;
            topright.x = this.x + this.w; topright.y = this.y;
            bottomleft.x = this.x; bottomleft.y = this.y + this.h;
            bottomright.x = this.x + this.w; bottomright.y = this.y + this.h;
            this.selected = true
            selectionMade = true
        }
    }

}


//CAMERA CLASS
//----------------------------------------------------------------------
class Camera {
    constructor() {
        this.x = 0;
        this.y = 0;
        this.shiftx = 0;
    }
}

//----------------------------------------------------------------------

//SELECTION BOX CLASS
//---------------------------------------------------
class Selection {
    constructor() {
        this.x = (!bottomright.x) ? null : topleft.x / 100 * cvs.width - 5
        this.y = (!bottomright.x) ? null : topleft.y / 100 * cvs.height - 5
        this.w = (!bottomright.x) ? null : topright.x / 100 * cvs.width - topleft.x / 100 * cvs.width + 10
        this.h = (!bottomright.x) ? null : bottomright.y / 100 * cvs.height - topright.y / 100 * cvs.height + 10
        this.cl = (!bottomright.x) ? null : this.x
        this.ct = (!bottomright.x) ? null : this.y
        this.cr = (!bottomright.x) ? null : this.x + this.w
        this.cb = (!bottomright.x) ? null : this.y + this.h
        this.stayx = false
        this.stayy = false
        this.stayw = false
        this.stayh = false
        this.stayratio = document.querySelector('#stayratio').checked
        this.ratiowh= (this.w<this.h)?this.w/this.h:1-this.ratiohw
        this.ratiohw= (this.h<this.w)?this.h/this.w:1-this.ratiowh
        this.ratiowh= (this.w<this.h)?this.w/this.h:1-this.ratiohw
    }
    drag() {
        this.stayratio = document.querySelector('#stayratio').checked
        this.x -= clickValue.deltax / 100 * cvs.width
        this.y -= clickValue.deltay / 100 * cvs.height
        this.cl = this.x
        this.ct = this.y
        this.cr = this.x + this.w
        this.cb = this.y + this.h

    }
    expand() {
        this.stayratio = document.querySelector('#stayratio').checked
        console.log("expanding selection")
        this.x -= (mySelection.stayx) ? 0 : clickValue.deltax / 100 * cvs.width
        this.w += (mySelection.stayw) ? (this.w-4) : (this.stayratio) ? this.ratiowh * clickValue.deltax / 100 * cvs.width:clickValue.deltax / 100 * cvs.width
        this.cl = this.x
        this.cr = this.x + this.w
        this.y -= (mySelection.stayy) ? 0 : clickValue.deltay / 100 * cvs.height
        this.h += (mySelection.stayh) ? (this.h-4) : (this.stayratio) ? this.ratiohw * clickValue.deltax / 100 * cvs.width:clickValue.deltay / 100 * cvs.height
        this.ct = this.y
        this.cb = this.y + this.h

    }
    draw() {
        this.ratiowh= ((topright.x-topleft.x)<(bottomright.y-topright.y))?(topright.x-topleft.x)/(bottomright.y-topright.y):null
        this.ratiohw= ((bottomright.y-topright.y)<(topright.x-topleft.x))?(bottomright.y-topright.y)/(topright.x-topleft.x):1-mySelection.ratiowh
        this.ratiowh= ((topright.x-topleft.x)<(bottomright.y-topright.y))?(topright.x-topleft.x)/(bottomright.y-topright.y):1-mySelection.ratiohw
        this.stayratio = document.querySelector('#stayratio').checked
        if (!bottomright.x) { return; }
        ctx.strokeStyle = "magenta"
        ctx.lineWidth = 0.002 * cvs.width;
        ctx.strokeRect(this.x - myCam.x, this.y, this.w, this.h)
        ctx.strokeStyle = "PURPLE"
        ctx.fillStyle = "red"
        ctx.beginPath();
        ctx.arc(this.cl - myCam.x, this.ct, 6, 0, 2 * Math.PI, false);
        ctx.fill();
        ctx.stroke();

        ctx.beginPath();
        ctx.arc(this.cr - myCam.x, this.ct, 6, 0, 2 * Math.PI, false);
        ctx.fill();
        ctx.stroke();

        ctx.beginPath();
        ctx.arc(this.cl - myCam.x, this.cb, 6, 0, 2 * Math.PI, false);
        ctx.fill();
        ctx.stroke();

        ctx.beginPath();
        ctx.arc(this.cr - myCam.x, this.cb, 6, 0, 2 * Math.PI, false);
        ctx.fill();
        ctx.stroke();
    }

}




//--------------------------------------------
var winPlat = new Win(null, null, null, null)
var myChar = new Character(null, null, null, null);
var myCam = new Camera();
var mySelection = new Selection();

function dragAll() {
    for (i = 0; i < platforms.length; i++) { platforms[i].drag() }
    for (i = 0; i < walls.length; i++) { walls[i].drag() }
    winPlat.drag()
    myChar.drag()
    mySelection.drag()
}

function expandAll() {
    for (i = 0; i < platforms.length; i++) { platforms[i].expand() }
    for (i = 0; i < walls.length; i++) { walls[i].expand() }
    winPlat.expand()
    myChar.expand()
    mySelection.expand()
}

function drawAll() {
    ctx.clearRect(0, 0, cvs.width, cvs.height)
    bg.draw()
    for (i = 0; i < platforms.length; i++) { platforms[i].draw() }
    for (i = 0; i < walls.length; i++) { walls[i].draw() }
    winPlat.draw()
    myChar.draw()
    mySelection.draw()

}

function updateAll() {

    for (i = 0; i < platforms.length; i++) { platforms[i].update() }
    for (i = 0; i < walls.length; i++) { walls[i].update() }
    winPlat.update()
    myChar.update()
  
}


drawAll()
updateAll()

cvs.onmousedown = function (event) {

    let rect = cvs.getBoundingClientRect();
    clickValue = {
        x: ((event.clientX - rect.left + myCam.x) / cvs.width * 100),
        y: (event.clientY - rect.top) / cvs.height * 100,
        newx: ((event.clientX - rect.left + myCam.x) / cvs.width * 100),
        newy: (event.clientY - rect.top) / cvs.height * 100,
        deltax: 0,
        deltay: 0,
    }

    cvs.onmousemove = function (event) {
        console.log("mouse moved")
        clickValue.deltax = clickValue.newx - ((event.clientX - rect.left + myCam.x) / cvs.width * 100);
        clickValue.deltay = clickValue.newy - (event.clientY - rect.top) / cvs.height * 100;
        clickValue.newx = ((event.clientX - rect.left + myCam.x) / cvs.width * 100);
        clickValue.newy = (event.clientY - rect.top) / cvs.height * 100;
        mySelection.stayh = (mySelection.h / cvs.height * 100 + clickValue.deltay >= 0.005*cvs.width) ? false : true;
        mySelection.stayw = (mySelection.w / cvs.width * 100 + clickValue.deltay >= 0.005*cvs.width) ? false : true;
        if (clickValue.x >= topleft.x - 15
            && clickValue.x <= topleft.x
            && clickValue.y >= topleft.y - 15
            && clickValue.y <= topleft.y) { console.log("point tl"); expandAll(); }
        if (clickValue.x >= bottomleft.x - 15
            && clickValue.x <= bottomleft.x
            && clickValue.y >= bottomleft.y
            && clickValue.y <= bottomleft.y + 15) { console.log("point bl"); mySelection.stayy = true; clickValue.deltay = -clickValue.deltay; expandAll(); }
        if (clickValue.x >= topright.x
            && clickValue.x <= topright.x + 15
            && clickValue.y >= topright.y - 15
            && clickValue.y <= topright.y) { console.log("point tr"); mySelection.stayx = true; clickValue.deltax = -clickValue.deltax; expandAll(); }
        if (clickValue.x >= bottomright.x
            && clickValue.x <= bottomright.x + 15
            && clickValue.y >= bottomright.y
            && clickValue.y <= bottomright.y + 15) { console.log("point br"); mySelection.stayx = true; mySelection.stayy = true; clickValue.deltay = -clickValue.deltay; clickValue.deltax = -clickValue.deltax; expandAll(); }
        if (clickValue.x >= topleft.x
            && clickValue.x <= topright.x
            && clickValue.y >= topleft.y
            && clickValue.y <= bottomleft.y) { console.log("inbox"); dragAll(); }

        console.log(clickValue, topleft, bottomright)
    }
    cvs.onmouseup = function () {
        console.log("mouse up from move")
        selectionMade = false
        updateAll()
        if (!selectionMade) { resetSelection() }
        mySelection = new Selection();
        console.log(clickValue)
        console.log(topleft)
        console.log(topright)
        console.log(bottomleft)
        console.log(bottomright)
        cvs.onmouseup = null;
        cvs.onmousemove = null;
        return;
    }
    if (!selectionMade) { resetSelection() }


}
function resetSelection() {
    topleft = { x: null, y: null }; topright = { x: null, y: null }; bottomleft = { x: null, y: null }; bottomright = { x: null, y: null }
    mySelection = new Selection();
}

var down = false;
var down2 = false;
window.addEventListener("keydown", function (e) {
    switch (e.keyCode) {
        case 37: // left arrow
            myCam.x -= (myCam.x >= 0) ? 0.02 * cvs.width : 0;
            break;
        case 39: // right arrow

            myCam.x += (myCam.x + cvs.width >= 0) ? 0.02 * cvs.width : 0;
            break;
    }
}, false);

window.addEventListener("keyup", function (e) {
    switch (e.keyCode) {
        case 32: // space
            if (selectionMade) {
                platforms.forEach(function colorPlatform(item) { if (item.selected) { item.color=(item.color+1)%3 } })
                walls.forEach(function colorWall(item) { if (item.selected) { item.color=(item.color+1)%3 } })
            }
            else {
                background = !background;
                light.currentTime = 0;
                light.play()
            }

            break;
        case 8:
            platforms.forEach(function deletePlatform(item, index, arr) { if (item.selected) { arr.splice(index, 1) } resetSelection() })
            walls.forEach(function deleteWall(item, index, arr) { if (item.selected) { arr.splice(index, 1) } resetSelection() })
            if (myChar.selected) { myChar = new Character(null, null, null, null); resetSelection() }
            if (winPlat.selected) { winPlat = new Win(null, null, null, null); resetSelection() }

    }
}, false);

var running = false,
    started = false;

function stop() {
    running = false;
    started = false;
    cancelAnimationFrame(frameID);
}

function start() {
    if (!started) {
        started = true;
        frameID = requestAnimationFrame(function (timestamp) {
            drawAll();
            running = true;
            lastFrameTimeMs = timestamp;
            lastFpsUpdate = timestamp;
            framesThisSecond = 0;
            frameID = requestAnimationFrame(mainLoop);
        });
    }
}

function mainLoop(timestamp) {
    flower.play()
    if (timestamp < lastFrameTimeMs + (1000 / maxFPS)) {
        frameID = requestAnimationFrame(mainLoop);
        return;
    }
    delta += timestamp - lastFrameTimeMs;
    lastFrameTimeMs = timestamp;
    while (delta >= timestep) {
        drawAll();
    }
    delta -= timestep;
    frames++;
    drawAll();
    frameID = requestAnimationFrame(mainLoop);
}



var level0 = {
    platforms: [
        { color: 0, x: 40, y: 60, width: 20, height: 5 },
        { color: 2, x: 13, y: 80, width: 13, height: 5 },
        { color: 2, x: 73, y: 40, width: 16, height: 5 },
        { color: 1, x: 100, y: 60, width: 20, height: 5 },
    ],
    walls: [
        { color: 2, x: 33, y: 0, width: 2, height: 100 },
    ],
    winPlat:
        { x: 110, y: 20, width: 33, height: 4 }
}

var levels = [level0]

function lvlCreate(level) {
    platforms = []
    walls = []
    myCam = new Camera()
    for (i = 0; i < level.platforms.length; i++) {
        platforms.push(new Platform(level.platforms[i].color, level.platforms[i].x, level.platforms[i].y, level.platforms[i].width, level.platforms[i].height));
    }
    for (i = 0; i < level.walls.length; i++) {
        walls.push(new Wall(level.walls[i].color, level.walls[i].x, level.walls[i].y, level.walls[i].width, level.walls[i].height));
    }
    winPlat = new Win(level.winPlat.x, level.winPlat.y, level.winPlat.width, level.winPlat.height);
    myChar = new Character(.8, 1, 8, 12);

    return "ran";
}


function createChar() {
    myChar = new Character(0, 0, 10, 15);
}


function createWin() {
    winPlat = new Win(0, 0, 20, 5);
}

function createHor(holder, thing) {
    holder.push(new thing((background ? 0 : 2), 0, 0, 25, 5));
    console.log(holder)
}

function createVert(holder, thing) {
    holder.push(new thing((background ? 0 : 2), 0, 0, 5, 25));
    console.log(holder)
}


mainLoop()

resolution=[
    {x:300, y:200},
    {x:600, y:400},
    {x:750, y:500},
    {x:900, y:600},
    {x:1200, y:800},
]


function changeRes(res)
{
    ctx.canvas.width  = resolution[res-1].x; 
    ctx.canvas.height = resolution[res-1].y;
}
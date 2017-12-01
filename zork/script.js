var canvas, msg, command, keywords;
var helpText = "Valid commands are look, take, and help.";
var errorText = "I'm sorry, I don't understand you.";

//Declare rooms
var livingroom, classroom, kitchen, bathroom, hallway;

//Declare images
var livingRoomImg;

//Initialize rooms
livingroom = {
    name: "classroom",
    description: "You are standing in a huge living room.",
    localrooms:  ["bathroom", "kitchen", "hallway"],
    things: ["bat", "knife", "sign"]
};


//Initialize current room
var currentroom = livingroom;

function setup() {
    canvas = createCanvas(400, 400);
    canvas.parent("#canvas");
    background(200, 100, 50);
    msg = select("#msg");
    command = select("#command");
    keywords = ["look", "take", "help"];
    livingRoomImg = loadImage("img/livingroom.png");
}

function draw() {
    image(livingRoomImg, 0, 0);
}

function keyPressed() {
  if (keyCode === ENTER) {
    checkCommand();
  } 
}

function changeMsg() {
    msg.html(command.value());
    command.html("");
    background(200, 100, 50);
    drawTriangle();
}

function checkCommand() {
    var c = command.value().trim().split(" ");
    command.value("");
    if(c.length == 1){
        if(c[0] === "help") {
            displayHelp();
        }
        else if(c[0] === "look") {
            displayLook();
        }
        else {
            msg.html(errorText);
        }
    }
    else if(c.length == 2 && c[0] === "look"){
        displayLookObject(c[1]);
    }
    else{
        msg.html(errorText);
    }
}

function displayHelp() {
    msg.html(helpText);
}

function displayLook() {
    msg.html(currentroom.description);
    msg.html("<br>Objects in the room: ", true);
    for (var thing in currentroom.things) {
        msg.html(currentroom.things[thing] + " ", true);
    }
    msg.html("<br>Local rooms: ", true);
    for (var local in currentroom.localrooms) {
        msg.html(currentroom.localrooms[local] + " ", true);
    }
}

function displayLookObject(obj) {
    function test(thingy) {
        return obj === thingy;
    }
    if(typeof currentroom.things.find(test) === 'undefined') {
        msg.html("I can't find that object.");
    }
    else {
        msg.html("It's a bat. Pretty nice.");
    }
}

function drawHouse() {
    rect(56, 46, 55, 55);
}

function drawTriangle() {
    triangle(30, 75, 58, 20, 86, 75);
}
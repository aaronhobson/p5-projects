// Declare GUI/gameplay stuff
var canvas, msg, msgArea, command, keywords;

// Declare items 
var ball, triforce, soap;

// Declare rooms
var bathRoom, livingRoom;

// Setup other global variables
var currentLocation;

function setup() {
    canvas = createCanvas(300, 300);
    canvas.parent("#canvas");
    msg = select("#msg");
    msgArea = select("#message-area");
    command = select("#command");
    keywords = ["look", "take", "help"];
    
    ball = new Item("ball", "A small ball. Round! Bouncy.", true, drawBall);
    triforce = new Item("triforce", "A classic symbol of video games.", false, drawTriforce);
    soap = new Item("soap", "A bar of dirty soap. Ugh!", true, drawSoap);
    
    livingRoom = new Room("livingroom", "A huge living room.", [ball, triforce], [], drawLivingRoom);
    bathRoom = new Room("bathroom", "A dirty bathroom. Yuck!", [soap], [], drawBathRoom);
    
    livingRoom.places.push(bathRoom);
    bathRoom.places.push(livingRoom);
    
    currentLocation = livingRoom;
    
}

function draw() {
    currentLocation.drawRoom();
}

function keyPressed() {
  if (keyCode === ENTER) {
    parseCommand();
  } 
}

function updateTextArea(str) {
    msg.html(msg.html() + "<br>" + str);
    // This just makes it auto-scroll when new text is entered.
    document.getElementById("message-area").scrollTop = document.getElementById("message-area").scrollHeight;
}

function parseCommand() {
    var rawText = command.value().trim();
    updateTextArea("<i>\>" + rawText + "</i>");
    var c = command.value().toLowerCase().trim().split(" ");
    command.value("");
    if(c.length == 1){
        if(c[0] === "help") {
            updateTextArea("Valid commands are <span class=\"keywords\">look</span>, <span class=\"keywords\">take</span>, <span class=\"keywords\">go</span>, and <span class=\"keywords\">help</span>.");
        }
        else if(c[0] === "look") {
            displayLook();
        }
        else if(c[0] === "go") {
            updateTextArea("Go where?");
        }
        else if(c[0] === "take") {
            updateTextArea("Take what?");
        }
        else {
            updateTextArea("I'm sorry, I don't understand you.");
        }
    }
    else if(c.length == 2 && c[0] === "look"){
        displayLookItem(c[1]);
    }
    else{
        updateTextArea("I'm sorry, I don't understand you.");
    }
}


function displayLook() {
    updateTextArea(currentLocation.desc);
    updateTextArea(currentLocation.listItems());
    updateTextArea(currentLocation.listPlaces());
}

function displayLookItem(item) {
    var found = false;
    var i = 0;
    while(!found && i < currentLocation.items.length){
        if(currentLocation.items[i].name === item){
            found = true;
        }
        else {
            i++;
        }
    }
    if(found) { 
        updateTextArea(currentLocation.items[i].desc);
    }
    else {
        updateTextArea("I can't find that item.");
    }
}

function Room(name, desc, items, places, imageDrawer) {
    this.name = name;
    this.desc = desc;
    this.items = items;
    this.places = places;
    this.imageDrawer = imageDrawer;
    this.listItems = function() {
        var text = "Items: ";
        for(var i = 0; i < this.items.length; i++) {
            text += this.items[i].name + " ";
        }
        return text;
    };
    this.listPlaces = function() {
        var text = "Places: ";
        for(var i = 0; i < this.places.length; i++) {
            text += this.places[i].name + " ";
        }
        return text;
    };
    this.removeItem = function(item) {
        if(this.items.indexOf(item) != -1){
            this.items.splice(item, 1);
        }
    };
    this.drawRoom = function() {
        this.imageDrawer(); //draw the room itself
        for(var i = 0; i < this.items.length; i++) {
            this.items[i].drawItem(); //draw each item in the room
        }
    }
}

function Item(name, desc, holdable, imageDrawer) {
    this.name = name;
    this.desc = desc;
    this.holdable = holdable;
    this.imageDrawer = imageDrawer;
    this.drawItem = function() {
        this.imageDrawer();
    }
}

// Draw Items
function drawBall() {
    ellipse(100, 100, 20, 80);
}

function drawTriforce() {
    triangle(30, 75, 58, 20, 86, 75);
}

function drawSoap() {
    rect(30, 20, 55, 55);
}

// Draw Rooms
function drawLivingRoom() {
    background(100, 200, 200);
    line(30, 20, 85, 75);
}

function drawBathRoom() {
    background(200, 50, 100);
    line(100, 100, 30, 95);
}
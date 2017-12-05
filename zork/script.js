// Declare GUI/gameplay stuff
var canvas, msg, msgArea, command, helpText, errorText;

// Declare items 
var ball, triforce, soap;

// Declare rooms
var bathRoom, livingRoom;

// Setup other game-specific global variables
var currentLocation, inventory;

function setup() {
    canvas = createCanvas(300, 300);
    canvas.parent("#canvas");
    msg = select("#msg");
    msgArea = select("#message-area");
    command = select("#command");
    helpText = "Valid commands are <span class=\"keywords\">look</span>, <span class=\"keywords\">take</span>, <span class=\"keywords\">drop</span>, <span class=\"keywords\">pack</span>, <span class=\"keywords\">go</span>, and <span class=\"keywords\">help</span>.";
    errorText = "I'm sorry, I don't understand you.";
    
    ball = new Item("ball", "A small ball. Round! Bouncy.", true, drawBall);
    triforce = new Item("triforce", "A classic symbol of video games.", false, drawTriforce);
    soap = new Item("soap", "A bar of dirty soap. Ugh!", true, drawSoap);
    
    livingRoom = new Room("livingroom", "A huge living room.", [ball, triforce], [], drawLivingRoom);
    bathRoom = new Room("bathroom", "A dirty bathroom. Yuck!", [soap], [], drawBathRoom);
    
    livingRoom.places.push(bathRoom);
    bathRoom.places.push(livingRoom);
    
    currentLocation = livingRoom;
    inventory = [];
    
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
    // This just makes it auto-scroll when new text is entered, naamean?
    document.getElementById("message-area").scrollTop = document.getElementById("message-area").scrollHeight;
}

function parseCommand() {
    var rawText = command.value().trim();
    updateTextArea("\><span class=\"keywords\">" + rawText + "</span>");
    var c = command.value().toLowerCase().trim().split(" ");
    c = c.filter(function(foo) {
        return foo.trim() !== "";
    });
    command.value("");
    if(c.length == 1){
        switch(c[0]) {
            case "help":
                updateTextArea(helpText);
                break;
            case "look":
                look();
                break;
            case "go":
                updateTextArea("Go where?");
                break;
            case "take":
                updateTextArea("Take what?");
                break;
            case "drop":
                updateTextArea("Drop what?");
                break;
            case "pack":
                pack();
                break;
            default: 
                updateTextArea(errorText);
        }
    }
    else if(c.length == 2){
        switch(c[0]) {
            case "look":
                lookItem(c[1]);
                break;
            case "take":
                takeItem(c[1]);
                break;
            case "drop":
                dropItem(c[1]);
                break;
            case "go":
                goPlace(c[1]);
                break;
            default:
                updateTextArea(errorText);
        }
    }
    else{
        updateTextArea(errorText);
    }
}


function look() {
    updateTextArea(currentLocation.desc);
    updateTextArea(currentLocation.listItems());
    updateTextArea(currentLocation.listPlaces());
}

// Return the index of an item if it exists in the room.
// If the item doesn't exist, return -1 instead.
function itemExists(item) {
    for(var i = 0; i < currentLocation.items.length; i++) {
        if(currentLocation.items[i].name === item){
            return i;
        }
    }
    return -1;
}

function holdingItem(item) {
    for(var i = 0 ; i < inventory.length; i++) {
        if(inventory[i].name === item) {
            return i;
        }
    }
    return -1;
}

function placeExists(place) {
    for(var i = 0; i < currentLocation.places.length; i++) {
        if(currentLocation.places[i].name === place){
            return i;
        }
    }
    return -1;
}

function lookItem(item) {
    var itemID = itemExists(item);
    if(itemID >= 0) { 
        updateTextArea(currentLocation.items[itemID].desc);
    }
    else {
        updateTextArea("I can't find that.");
    }
}

function takeItem(item) {
    var itemID = itemExists(item);
    if(itemID >= 0) {
        if(currentLocation.items[itemID].holdable) {
            updateTextArea("You take the " + currentLocation.items[itemID].name + ".");
            inventory.push(currentLocation.items[itemID]);
            currentLocation.removeItem(currentLocation.items[itemID]);      
        }
        else {
            updateTextArea("You can't take that!");
        }
    }
    else {
        updateTextArea("I can't find that.");
    }
}

function dropItem(item) {
    var itemID = holdingItem(item);
    if(itemID >= 0) {
        updateTextArea("You drop the " + inventory[itemID].name + ".");
        currentLocation.addItem(inventory[itemID]);
        inventory.splice(inventory[itemID], 1);
    }
    else {
        updateTextArea("You don't have that.");
    }
}

function pack() {
    var text = "";
    for(var i = 0; i < inventory.length; i++) {
        text += inventory[i].name + " ";
    }
    if(text.length == 0) {
        updateTextArea("You aren't holding anything.");
    }
    else {
        updateTextArea("Items in your pack: ");
        for(var i = 0; i < inventory.length; i++) {
            updateTextArea(inventory[i].name + ": " + inventory[i].desc);
        }    
    }
}

/*
Classes
*/

function goPlace(place) {
    if(place === currentLocation.name) {
        updateTextArea("You're already here.");
    }
    else {
        var placeID = placeExists(place);
        if(placeID >= 0) {
            currentLocation = currentLocation.places[placeID];
            updateTextArea("You enter the " + currentLocation.name + ".");
        }
        else {
            updateTextArea("I can't find that place.")
        }
    }
}

function Room(name, desc, items, places, imageDrawer) {
    this.name = name;
    this.desc = desc;
    this.items = items;
    this.places = places;
    this.imageDrawer = imageDrawer;
    this.listItems = function() {
        var text = "";
        for(var i = 0; i < this.items.length; i++) {
            text += this.items[i].name + " ";
        }
        if(text.length == 0) {
            text = "There are no items here.";
        }
        else {
            text = "Items: " + text;
        }
        return text;
    };
    this.listPlaces = function() {
        var text = "";
        for(var i = 0; i < this.places.length; i++) {
            text += this.places[i].name + " ";
        }
        if(text.length == 0) {
            text = "There are no nearby places.";
        }
        else {
            text = "Places: " + text;
        }
        return text;
    };
    this.addItem = function(item) {
        this.items.push(item);
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
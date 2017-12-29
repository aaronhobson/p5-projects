/**
 * Step 1: Declare variables to represent the items and places in your game!
 */

// Declare item variables
var ball, triforce, soap;

// Declare variables specific to each item, if needed.
var ballRadius, ballX, ballY, ballXSpeed, ballYSpeed;

// Declare place variables
var ballRoom, livingRoom;

/**
 * Step 2: Initialize the variables above, along with other game-specific variables!
 */

function setupGame() {
    // Choose the width and height of your graphics screen! 
    // Be sure to reflect these values in your CSS, within the #canvas style rule!
    // canvas = createCanvas(width, height);
    canvas = createCanvas(300, 300);

    // Customize interface text!
    helpText = "Valid commands are <span class=\"keywords\">look</span>, <span class=\"keywords\">take</span>, <span class=\"keywords\">drop</span>, <span class=\"keywords\">pack</span>, <span class=\"keywords\">go</span>, and <span class=\"keywords\">help</span>.";
    errorText = "I'm sorry, I don't understand you.";

    // Initialize items!
    // item = new Item(name, description, holdable?, nameOfDrawItemFunction);
    ball = new Item("ball", "A large, blue ball. Round! Bouncy.", true, drawBall);
    triforce = new Item("triforce", "A classic symbol of video games.", false, drawTriforce);
    soap = new Item("soap", "An inexplicably dirty bar of soap!", true, drawSoap);

    // Initialize item variables, if any!
    ballRadius = 100;
    ballX = 150;
    ballY = 150;
    ballXSpeed = 8;
    ballYSpeed = 11;

    // Initialize places!
    // place = new Place(name, description, items[], locations[], locked?, nameOfDrawPlaceFunction);
    livingRoom = new Place("livingroom", "A huge, vacant livingroom.", [], [], false, drawLivingRoom);
    ballRoom = new Place("ballroom", "A \"ballroom\". It's crazy in here!", [], [], true, drawBallRoom);

    // Add items to places!
    // place.items.push(item1, item2, item3, ...);
    livingRoom.items.push(ball, triforce);
    ballRoom.items.push(soap);

    // Connect places to each other! 
    // place.places.push(place1, place2, place3, ...);
    livingRoom.places.push(ballRoom);
    ballRoom.places.push(livingRoom);

    // Initialize your game's starting location!
    currentLocation = livingRoom;
}

/**
 * Step 3: Create functions to draw your items and places!
 */

// Draw (and animate) Items
function drawBall() {
  fill(0, 0, 255);
  if(ballX > canvas.width || ballX < 0) {
    ballXSpeed *= -1;
  }
  if(ballY > canvas.height || ballY < 0) {
    ballYSpeed *= -1;  
  }
  ballX += ballXSpeed;
  ballY += ballYSpeed;
  ellipse(ballX, ballY, ballRadius, ballRadius);
}

function drawTriforce() {
  triangle(30, 75, 58, 20, 86, 75);
}

function drawSoap() {
    fill(100, 100, 20);
    rect(200, 200, 55, 55);
}

// Draw Places (and animate if you want?!?!)
function drawLivingRoom() {
    background(100, 200, 200);
}

function drawBallRoom() {
  background(200, 50, 100);
  for(var i = 0; i < 20; i++) {
    fill(random(255), random(255), random(255));
    ellipse(random(canvas.width), random(canvas.height), random(25, 100), random(25, 100));
  }
}

/**
 * Step 4: Create your game events here!
 */

//example of a "key item" event!
function checkBallRoomLock() {
  if(inventory.indexOf(ball) != -1) {
    ballRoom.locked = false;  
  } 
  else {
    ballRoom.locked = true;  
  }
}

/**
 * Call all of your events in the function below! 
 */
function events() {
  checkBallRoomLock();
}


/*********************************************************
 * DON'T TOUCH ANYTHING BELOW THIS LINE!!!!!!!!!
 ******************************************************/
// Declare GUI/gameplay variables
var canvas, msg, msgArea, command, helpText, errorText;

// Declare other game-specific global variables
var currentLocation, inventory;

function setup() {
    setupGame();
    canvas.parent("#canvas");
    msg = select("#msg");
    msgArea = select("#message-area");
    command = select("#command");
    inventory = [];
}

function draw() {
    currentLocation.drawPlace();
    events();
}

function Place(name, desc, items, places, locked, imageDrawer) {
    this.name = name;
    this.desc = desc;
    this.items = items;
    this.places = places;
    this.locked = locked;
    this.imageDrawer = imageDrawer;
    this.listItems = function() {
        var text = "";
        for(var i = 0; i < this.items.length; i++) {
            text += this.items[i].name + " ";
        }
        if(text.length === 0) {
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
        if(text.length === 0) {
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
            this.items.splice(this.items.indexOf(item), 1);
        }
    };
    this.drawPlace = function() {
        this.imageDrawer(); //draw the place itself
        for(var i = 0; i < this.items.length; i++) {
            this.items[i].drawItem(); //draw each item in the place
            fill(255); // Reset the color after each drawing, just in case.
        }
    };
}

function Item(name, desc, holdable, imageDrawer) {
    this.name = name;
    this.desc = desc;
    this.holdable = holdable;
    this.imageDrawer = imageDrawer;
    this.drawItem = function() {
        this.imageDrawer();
    };
}

function keyPressed() {
  var rawText = command.value().trim();
  if(keyCode === ENTER && rawText.length > 0) {
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
    updateTextArea(">" + "<span class=\"keywords\">" + rawText + "</span>");
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

// Return the index of an item if it exists in the place.
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
            updateTextArea("You put the " + currentLocation.items[itemID].name + " in your pack.");
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
        inventory.splice(itemID, 1);
    }
    else {
        updateTextArea("You don't have that.");
    }
}

function pack() {
    if(inventory.length === 0) {
        updateTextArea("You aren't holding anything.");
    }
    else {
        updateTextArea("Items in your pack:");
        for(i = 0; i < inventory.length; i++) {
            updateTextArea(inventory[i].name + ": " + inventory[i].desc);
        }    
    }
}

function goPlace(place) {
    if(place === currentLocation.name) {
        updateTextArea("You're already here.");
    }
    else {
        var placeID = placeExists(place);
        if(placeID >= 0) {
            if(!currentLocation.places[placeID].locked) {
                currentLocation = currentLocation.places[placeID];
                updateTextArea("You enter the " + currentLocation.name + ".");
            }
            else {
                updateTextArea("You cannot access that area. Perhaps find a way?");
            } 
        }
        else {
            updateTextArea("I can't find that place.");
        }
    }
}
//Create variables here
var dog, foodS, foodStock, dogImg, happyDogImg, database;
var feed, addFood, fedTime, lastFed, foodObj;
var bedroom, washroom, garden;
var readGameState, changeGameState;
var currentTime;

function preload()
{
  //load images here
  dogImg = loadImage("images/dogImg.png");
  happyDogImg = loadImage("images/dogImg1.png");
bedroom = loadImage("images/bedroom.png");
washroom = loadImage("images/washroom.png");
garden = loadImage("images/garden.png");
}

function setup() {

  database = firebase.database();
  createCanvas(400,500);
  foodObj = new Food();
  foodStock = database.ref('food');
    foodStock.on("value",readStock);
    fedTime=database.ref('feedTime');
    fedTime.on("value",function(data){
      lastFed = data.val();
    });
    readGameState=database.ref('gameState');
  readGameState.on("value",function(data){
    gameState=data.val();
  });
  dog = createSprite(200,400,150,150);
  dog.addImage(dogImg);
  dog.scale = 0.15;
    feed = createButton(" Feed the Dog ");
    feed.position(700, 95);
    feed.mousePressed(feedDog);
    addFood = createButton(" Add Food ");
    addFood.position(800,95);
    addFood.mousePressed(addFoods);  
}


function draw() {  
  currentTime=hour();
  if(currentTime==(lastFed+1)){
update("playing");
foodObj.garden();
 }else if(currentTime==lastFed+2){
   update("sleeping");
   foodObj.bedroom();
 }else if(currentTime>(lastFed+2)&&currentTime<=(lastFed+4)){
   update("bathing");
   foodObj.washroom();
 }else{
   update("hungry");
   foodObj.display();
 }
 if(gameState!="hungry"){
   feed.hide();
   addFood.hide();
   dog.remove();
 }else{
   feed.show();
   addFood.show();
   dog.addImage(dogImg);
 }
  drawSprites();
}

function readStock(data){
  foodS = data.val();
  foodObj.updateFoodStock(foodS);
}
function feedDog(){
  dog.addImage(happyDogImg);
  foodObj.updateFoodStock(foodObj.getFoodStock()-1);
  database.ref('/').update({
    food:foodObj.getFoodStock(),
    feedTime:hour(),
    gameState:"hungry"
  })
}
function addFoods(){
  foodS++;
  database.ref('/').update({
    food:foodS
  })
}
function update(state){
  database.ref('/').update({
    gameState:state
  })
}
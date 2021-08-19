var PLAY=1;
var END=0;
var gamestate = PLAY;
var trex, trex_running, edges;
var groundImage;
var ground;
var invisible_ground;
var cloud;
var cloudImage;
var cactus_1;
var cactus_2;
var cactus_3;
var obstecle;
var random_1;
var cloud_group;
var obstecle_group;
var score=0;
var trexcol;
var die_snd;
var jump_snd;
var cp_snd;
var gameover;
var gameoverImg;
var restart;
var restartImg;
function preload(){
  trex_running = loadAnimation("trex1.png","trex3.png","trex4.png");
  groundImage = loadImage("ground2.png");
  cloudImage = loadImage("cloud_2.png");
  cactus_1 = loadImage("cactus1.png");
  cactus_2 = loadImage("cactus2.png");
  cactus_3 = loadImage("obstacle3.png");
  trexcol = loadAnimation("trex_collided.png");
  die_snd = loadSound("die.mp3");
  jump_snd = loadSound("jump.mp3");
  cp_snd = loadSound("checkpoint.mp3");
  gameoverImg = loadImage("gameover.png");
  restartImg = loadImage("restart.png");
}

function setup(){
  createCanvas(windowWidth,windowHeight);
  
  // creating trex
  trex = createSprite(50,height-10,20,50);
  trex.addAnimation("running", trex_running);
  trex.addAnimation("collide", trexcol);
  invisible_ground = createSprite(width/2,height,width,20);
  invisible_ground.visible = false
  ground = createSprite(width/2,height-10,width,120);
  ground.addImage(groundImage);
  ground.x = width/2;

  //adding scale and position to trex
  trex.scale = 0.5;
  obstecle_group = createGroup();
  cloud_group = createGroup();
  trex.setCollider("circle",0,0,35);
  gameover = createSprite(width/2,height/2-50)
  gameover.addImage(gameoverImg);
  restart = createSprite(width/2,height/2)
  restart.addImage(restartImg);
  restart.scale = 0.5;
  restart.visible = false;
  gameover.visible = false;
  gameover.scale = 0.5;
}


function draw(){
  //set background color 
  background("white");
  text("score"+score,360,100)
  if(gamestate===PLAY){
    score = score+Math.round(frameCount/60);
    ground.velocityX = -10;
    if(score%100===0){
      cp_snd.play();
    }
   //logging the y position of the trex
  console.log(trex.y);
  
  //jump when space key is pressed
  if(touches.length>0 ||keyDown("space") && trex.y >=height-30){
    trex.velocityY = -12;
    touches = [];
    jump_snd.play();
  }
  trex.velocityY = trex.velocityY +0.8;
  
  
  if(ground.x<0){
    ground.x = ground.width/2;
  }
  //stop trex from falling down
  clouds();
  cactus();
   if(obstecle_group.isTouching(trex)){
     gamestate = END;
     die_snd.play();
   }
  }
  else if(gamestate===END){
    ground.velocityX = 0;
    trex.velocityY =0
    gameover.visible = true
    restart.visible = true
    obstecle_group.setVelocityXEach(0);
    trex.changeAnimation("collide",trexcol);
    obstecle_group.setLifetimeEach(-1);
    cloud_group.setLifetimeEach(-1);
    cloud_group.setVelocityXEach(0)
    if(touches.length>0||mousePressedOver(restart)){
      reset();
      touches = [];
    }
  }
  trex.collide(invisible_ground)
  drawSprites();
}
function cactus(){
  if(frameCount%30===0){
    obstecle = createSprite(width+20,height-20,10,40);
    obstecle.velocityX = -5;
    obstecle.scale = 0.4
    random_1 = Math.round(random(1,3));
    switch(random_1){
      case 1: obstecle.addImage(cactus_1);
      obstecle.scale = 0.05
      break;
      case 2: obstecle.addImage(cactus_2);
      break;
      case 3: obstecle.addImage(cactus_3);
      break;
      default: break;
    }
    obstecle.lifetime = 300;
    obstecle_group.add(obstecle);
  }
}
function clouds(){
  if(frameCount%30===0){
    cloud = createSprite(width+20,height-300,20,20);
  cloud.addImage(cloudImage);
  cloud.scale = 0.04
  cloud.y = Math.round(random(10,50));
  cloud.velocityX = -3;
  cloud.lifetime = 600;
  cloud_group.add(cloud);
  }
}
function reset(){
  gamestate = PLAY
  gameover.visible = false
  restart.visible = false
  obstecle_group.destroyEach();
  cloud_group.destroyEach();
  score = 0
}
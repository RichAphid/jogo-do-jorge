var jorge, jorgeImg, JorgelowImg, Jorgemrt;
var bordas;
var chao, chaoImg;
var floor;
var nuv, nuvImg;
var cact, cactImg;

var pnts = 0;

var GAMEOVER = 2;

var PLAY = 1;
var gamestate = PLAY;

var cacts;

var nuvs;

var GO, GOImg;
//botão de replay
var RST, RSTImg;

var jmpSound;
var mrtSound;
var cpSound;

function preload() {
  //pré carrega imagens, animações, sons, etc

  jorgeImg = loadAnimation("trex3.png", "trex4.png");

  Jorgemrt = loadAnimation("trex_collided.png");

  chaoImg = loadImage("ground2.png");

  nuvImg = loadImage("cloud.png");

  GOImg = loadImage("gameOver.png");
  RSTImg = loadImage("restart.png");

  cactImg1 = loadImage("obstacle1.png");
  cactImg2 = loadImage("obstacle2.png");
  cactImg3 = loadImage("obstacle3.png");
  cactImg4 = loadImage("obstacle4.png");
  cactImg5 = loadImage("obstacle5.png");
  cactImg6 = loadImage("obstacle6.png");

  JorgelowImg = loadAnimation("trex_low1.png", "trex_low2.png");

  jmpSound = loadSound("jump.mp3");
  mrtSound = loadSound("die.mp3");
  cpSound = loadSound("checkPoint.mp3");
}

function setup() {
  //função de configuração

  cacts = new Group();
  nuvs = new Group();

  var teste = Math.round(random(1, 10));
  console.log(teste);

  createCanvas(windowWidth, windowHeight);

  GO = createSprite(width / 2, height / 2, 20, 20);
  GO.addImage(GOImg);

  RST = createSprite(width / 2, height / 2 + 50, 20, 20);
  RST.addImage(RSTImg);
  RST.scale = 0.7;

  jorge = createSprite(50, height - 90, 20, 20);
  jorge.debug = false;
  jorge.setCollider("circle", 0, 0, 30);
  jorge.addAnimation("running", jorgeImg);
  jorge.scale = 0.5;
  jorge.addAnimation("F", Jorgemrt);

  jorge.addAnimation("low", JorgelowImg);

  bordas = createEdgeSprites();

  floor = createSprite(width / 2, height - 2, width, 20);
  //floor.shapeColor = "rgba(0, 0, 0, 0)"
  floor.visible = false;

  chao = createSprite(width / 2, height - 10, 20, 20);
  chao.addImage(chaoImg);
}

function draw() {
  background("white");

  //&& jorge.isTouching (chao)

  text("Score= " + pnts, 35, 50);

  if (gamestate === PLAY) {
    if ((keyDown("space") || touches.length > 0) && jorge.isTouching(chao)) {
      jorge.velocityY = -12;
      jmpSound.play();
      touches = [];
    }

    if (keyDown("ctrl")) {
      jorge.changeAnimation("low");
    } else {
      jorge.changeAnimation("running");
    }

    if (pnts % 100 === 0 && pnts > 0) {
      cpSound.play();
    }

    //gravidade
    jorge.velocityY = jorge.velocityY + 1;

    chao.velocityX = -7;

    if (chao.x < 0) {
      chao.x = chao.width / 2;
    }

    nuvens();

    cactos();

    if (jorge.isTouching(cacts)) {
      mrtSound.play();

      gamestate = GAMEOVER;

      //jorge.velocityY = -12;
      //jmpSound.play();
    }

    pnts = Math.round(pnts + frameRate() / 60);

    GO.visible = false;
    RST.visible = false;
  } else if (gamestate === GAMEOVER) {
    chao.velocityX = 0;
    jorge.changeAnimation("F");
    cacts.setVelocityXEach(0);
    nuvs.setVelocityXEach(0);

    cacts.setLifetimeEach(-1);
    nuvs.setLifetimeEach(-1);

    jorge.velocityY = 0;

    GO.visible = true;
    RST.visible = true;

    if (mousePressedOver(RST) || touches.length > 0) {
      reset();
      toches = 0;
    }
  }

  //console.log (jorge.y)

  jorge.collide(bordas);
  jorge.collide(floor);

  //if (keyDown ("f") && jorge.isTouching (floor)){
  //jorge.addImage (JorgelowImg)

  //}else {
  //jorge.addAnimation("running", jorgeImg);

  //}

  drawSprites();
}

function nuvens() {
  if (frameCount % 60 === 0) {
    nuv = createSprite(width + 10, random(50, height - 50), 20, 20);
    nuv.velocityX = -3;
    nuv.addImage(nuvImg);
    nuv.scale = 0.6;
    nuv.depth = jorge.depth - 1;
    nuv.lifetime = width;

    nuvs.add(nuv);
  }
}

function cactos() {
  if (frameCount % 70 === 0) {
    cact = createSprite(width + 10, height - 25, 20, 20);
    cact.velocityX = -(7 + pnts / 1000);
    cact.scale = 0.5;

    cact.lifetime = width;

    var cactran = Math.round(random(1, 6));
    switch (cactran) {
      case 1:
        cact.addImage(cactImg1);
        break;

      case 2:
        cact.addImage(cactImg2);
        break;

      case 3:
        cact.addImage(cactImg3);
        break;

      case 4:
        cact.addImage(cactImg4);
        break;

      case 5:
        cact.addImage(cactImg5);
        break;

      case 6:
        cact.addImage(cactImg6);
        break;
    }

    //randomização dos cactos

    cacts.add(cact);
  }
}

function reset() {
  gamestate = PLAY;

  cacts.destroyEach();
  nuvs.destroyEach();

  jorge.changeAnimation("running");

  pnts = 0;
}

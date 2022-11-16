const video5 = document.getElementsByClassName('input_video')[0];
const out5 = document.getElementsByClassName('output5')[0];
const controlsElement5 = document.getElementsByClassName('control5')[0];
const canvasCtx5 = out5.getContext('2d');
const fpsControl = new FPS();
const CARD_WIDTH = 230
const CARD_HEIGHT = 320
const DEFAULT_IMAGE = "default.png"
const JOKER_IMAGE = "joker.png"

function shuffleArray(array) {
  return array.sort( ()=>Math.random()-0.5 );
}

var selectedCards = []
var images = []
var themes = [
  'africa'
  ,'anifrio'
  ,'aves'
  ,'brasil'
  ,'carros'
  ,'catdog'
 ///,'default'
  ,'frutas'
  ,'jardim'
  ,'mar'
  ,'monumento'
  ,'praia'
]

var cursor = new Image();
cursor.src = "https://fernandodsds.github.io/tecphysio/assets/images/cursor.png"; 
var theme = shuffleArray(themes)[0]


var base_image = new Image();
base_image.src = "https://fernandodsds.github.io/tecphysio/assets/game_images/" +DEFAULT_IMAGE; 

var joker_image = new Image();
joker_image.src = "https://fernandodsds.github.io/tecphysio/assets/images/" +JOKER_IMAGE; 


var dog_image1 = new Image();
dog_image1.src = "https://fernandodsds.github.io/tecphysio/assets/game_images/"+theme+"/img1.png"; 

var dog_image2 = new Image();
dog_image2.src = "https://fernandodsds.github.io/tecphysio/assets/game_images/"+theme+"/img2.png"; 

var dog_image3 = new Image();
dog_image3.src = "https://fernandodsds.github.io/tecphysio/assets/game_images/"+theme+"/img3.png"; 

var dog_image4 = new Image();
dog_image4.src = "https://fernandodsds.github.io/tecphysio/assets/game_images/"+theme+"/img4.png"; 

console.log(images)
var curPerc = 0
var defaultCard = {"x": 10, "y":10, "image":base_image, "pressed":false, "revealed":false }
var cards = []
var sizeWidth  = canvasCtx5.canvas.clientWidth;
var sizeHeight = canvasCtx5.canvas.clientHeight;
var startTime  = new Date();
var cursorPos = {x:0, y:0};
var gameInitialized = false;
var revealTime = 0;
var gameScore = 0 
var qtdeJogos = 0
var lmuse = 19;

images = [dog_image1,dog_image2,dog_image3, dog_image4]
images = images.concat(images)



function initGame()
{
  theme = shuffleArray(themes)[0]

  dog_image1 = new Image();
  dog_image1.src = "https://fernandodsds.github.io/tecphysio/assets/game_images/"+theme+"/img1.png"; 

  dog_image2 = new Image();
  dog_image2.src = "https://fernandodsds.github.io/tecphysio/assets/game_images/"+theme+"/img2.png"; 

  dog_image3 = new Image();
  dog_image3.src = "https://fernandodsds.github.io/tecphysio/assets/game_images/"+theme+"/img3.png"; 

  dog_image4 = new Image();
  dog_image4.src = "https://fernandodsds.github.io/tecphysio/assets/game_images/"+theme+"/img4.png";

  images = [dog_image1,dog_image2,dog_image3, dog_image4]
  images = images.concat(images)

  cards = [];
  gameInitialized = false;
  images = shuffleArray(images);
  console.log(images);
  startTime = new Date();
  
  for (var i = 0; i<3;i++){
    console.log(15 + (CARD_WIDTH*(i)))
    cards.push({"x": 37*(i+1) + (CARD_WIDTH*(i)), "y":10, "image":images[i], 'revealed_image_id':images[i],"pressed":false, "revealed":false, "startTime":new Date(), "elapsed":0 });
  }
  
  for (var i = 3; i<6;i++){
    cards.push({"x": 37 *(i - 2) + (CARD_WIDTH*(i-3)), "y":CARD_HEIGHT+40, "image":images[i], 'revealed_image_id':images[i],"pressed":false, "revealed":false, "startTime":new Date(), "elapsed":0 });
  }

  //for (var i = 6; i<8;i++){
  //  cards.push({"x": 37 *(i - 5) + (CARD_WIDTH*(i-6)), "y":(CARD_HEIGHT*2)+80, "image":images[i], 'revealed_image_id':images[i],"pressed":false, "revealed":false, "startTime":new Date(), "elapsed":0 });
  //}

  cards.push({"x": 37, "y":(CARD_HEIGHT*2)+80, "image":images[6], 'revealed_image_id':images[6],"pressed":false, "revealed":false, "startTime":new Date(), "elapsed":0 });
  cards.push({"x": 37 * 3 + (CARD_WIDTH* 2), "y":(CARD_HEIGHT*2)+80, "image":images[7], 'revealed_image_id':images[7],"pressed":false, "revealed":false, "startTime":new Date(), "elapsed":0 });


  return cards
}



function zColor(data) {
  const z = clamp(data.from.z + 0.5, 0, 1);
  return `rgba(0, ${255 * z}, ${255 * (1 - z)}, 1)`;
}

function changeHand(){
  if (lmuse == 19){
    lmuse = 20;
  }else{
    lmuse = 19;
  }
}

function onCardCursor(cardPos, cursorPos){
  //console.log(cardPos)
  //console.log(cursorPos)
  if (cursorPos.x >= cardPos.x && cursorPos.x <= (cardPos.x + CARD_WIDTH) && cursorPos.y >= cardPos.y && cursorPos.y <= (cardPos.y + CARD_HEIGHT)) {
    return true
  } else if(cursorPos.x >= (cardPos.x + CARD_WIDTH) && cursorPos.x <= cardPos.x && cursorPos.y  >= (cardPos.y + CARD_HEIGHT) && cursorPos.y  <= cardPos.y){
    return true
  }
  
  return false

}

function verifyIsEqualsCard(selectedCards){
  return cards[selectedCards[0]].revealed_image_id == cards[selectedCards[1]].revealed_image_id
}

function drawImageCard(image,context, x,y)
{
  context.drawImage(image, x, y, CARD_WIDTH, CARD_HEIGHT);
  console.log(image.src);
}

function validateEndedGame(toValidationCards){
  return toValidationCards.every( (val, i, arr) => val.revealed === true )

}

cards = initGame()

function onResultsPose(results) {
  TotalElapsedTime=parseInt((new Date() - startTime)/1000);

  document.body.classList.add('loaded');
  fpsControl.tick();

  canvasCtx5.save();
  canvasCtx5.globalAlpha = 0.25;
  canvasCtx5.clearRect(0, 0, out5.width, out5.height);
  canvasCtx5.drawImage(
    results.image, 0, 0, out5.width, out5.height); 
  
  canvasCtx5.restore();    
  canvasCtx5.stroke();

  for (var i = 0; i <8 ;i++){
    drawImageCard( cards[i].image,canvasCtx5,cards[i].x,cards[i].y);  
  }  

  drawImageCard(joker_image,canvasCtx5, 37 * 2 + (CARD_WIDTH* 1),(CARD_HEIGHT*2)+80)

  //console.log(cards)

  drawLandmarks(
      canvasCtx5,
      Object.values([[lmuse]])
          .map(index => results.poseLandmarks[index]),
      {color: zColor, fillColor: '#FF0000'});
  canvasCtx5.font = "40px Arial";
  cursorPos.x = results.poseLandmarks[lmuse].x*out5.width;
  cursorPos.y = results.poseLandmarks[lmuse].y*out5.height;

  canvasCtx5.drawImage(cursor, cursorPos.x-50, cursorPos.y-50, 100, 100);

  if (TotalElapsedTime <=5){
    //verifyIsEqualsCard(selectedCards)
    console.log(TotalElapsedTime)
    return
  }

  if (gameInitialized == false){
    //cards = initGame()
    cards.forEach(element => {
      element.image = base_image
    });
    gameInitialized = true;
  }


  for (var i = 0; i<8;i++){
    if (onCardCursor(cards[i], cursorPos) 
        && cards[i].elapsed <= 3 
        && !cards[i].revealed 
        && selectedCards.length < 2){
      cards[i].elapsed=parseInt((new Date() - cards[i].startTime)/1000);
      if (cards[i].pressed != true){
        cards[i].pressed = true
      }

      if (cards[i].elapsed > 3 ){
        cards[i].revealed = true
        cards[i].image = cards[i].revealed_image_id;
        selectedCards.push(i);  
        console.log(selectedCards)  
        if (selectedCards.length == 2){
          revealTime = TotalElapsedTime
        }  

      }
      canvasCtx5.fillText(cards[i].elapsed, cursorPos.x-50, cursorPos.y-50)    
      //console.log(cards[i].elapsed)

    } else {
      cards[i].pressed =  false
      cards[i].startTime=new Date();
    }

    if (selectedCards.length == 2 && (TotalElapsedTime - revealTime) > 2 ){ 
      if (!verifyIsEqualsCard(selectedCards) ) 
      {
        cards[selectedCards[0]].image = base_image;
        cards[selectedCards[1]].image = base_image;
        cards[selectedCards[0]].revealed = false;
        cards[selectedCards[1]].revealed = false;
        cards[selectedCards[0]].elapsed = 0;
        cards[selectedCards[1]].elapsed = 0;
      }
      else 
      {
        gameScore += 1
        document.getElementById("score").innerHTML = ""+gameScore;
      }
      if(validateEndedGame(cards) ){
        qtdeJogos += 1
        document.getElementById("qtdeJogos").innerHTML = ""+qtdeJogos;
      }
      selectedCards = []
    }
  }

  document.getElementById("tempoJogo").innerHTML = ""+parseInt((new Date() - startTime)/1000);
}

const pose = new Pose({locateFile: (file) => {
  return `https://cdn.jsdelivr.net/npm/@mediapipe/pose@0.2/${file}`;
}});
pose.onResults(onResultsPose);

const camera = new Camera(video5, {
  onFrame: async () => {
    await pose.send({image: video5});
  },
  width: 480,
  height: 480
});
camera.start();

new ControlPanel(controlsElement5, {
      selfieMode: true,
      upperBodyOnly: false,
      smoothLandmarks: true,
      minDetectionConfidence: 0.60,
      minTrackingConfidence: 0.60
    })
    .add([
      new StaticText({title: 'MediaPipe Pose'}),
      fpsControl,
      new Toggle({title: 'Selfie Mode', field: 'selfieMode'}),
      new Toggle({title: 'Upper-body Only', field: 'upperBodyOnly'}),
      new Toggle({title: 'Smooth Landmarks', field: 'smoothLandmarks'}),
      new Slider({
        title: 'Min Detection Confidence',
        field: 'minDetectionConfidence',
        range: [0, 1],
        step: 0.01
      }),
      new Slider({
        title: 'Min Tracking Confidence',
        field: 'minTrackingConfidence',
        range: [0, 1],
        step: 0.01
      }),
    ])
    .on(options => {
      video5.classList.toggle('selfie', options.selfieMode);
      pose.setOptions(options);
    });

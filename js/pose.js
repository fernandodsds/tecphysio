const video5 = document.getElementsByClassName('input_video')[0];
const out5 = document.getElementsByClassName('output5')[0];
const controlsElement5 = document.getElementsByClassName('control5')[0];
const canvasCtx5 = out5.getContext('2d');
const fpsControl = new FPS();
const CARD_WIDTH = 150
const CARD_HEIGHT = 150
const DEFAULT_IMAGE = "default.png"

var selectedCards = []

var base_image = new Image();
base_image.src = "https://fernandodsds.github.io/tecphysio/assets/game_images/" +DEFAULT_IMAGE; 

var dog_image1 = new Image();
dog_image1.src = "https://fernandodsds.github.io/tecphysio/assets/game_images/dog1.png"; 

var dog_image2 = new Image();
dog_image2.src = "https://fernandodsds.github.io/tecphysio/assets/game_images/dog2.png"; 

var dog_image3 = new Image();
dog_image3.src = "https://fernandodsds.github.io/tecphysio/assets/game_images/dog3.png"; 

images = [dog_image1,dog_image2,dog_image3]
images = images.concat(images)
console.log(images)
var curPerc = 0
var defaultCard = {"x": 10, "y":10, "image":base_image, "pressed":false, "revealed":false }
var cards = []
var sizeWidth = canvasCtx5.canvas.clientWidth;
var sizeHeight = canvasCtx5.canvas.clientHeight;
var startTime=new Date();
var cursorPos = {x:0, y:0};
var gameInitialized = false;
var revealTime = 0;
var gameScore = 0 
var qtdeJogos = 0

function shuffleArray(array) {
 
  return array.sort( ()=>Math.random()-0.5 );

}

function initGame()
{
  cards = []
  images = shuffleArray(images)
  console.log(images)
  
  for (var i = 0; i<3;i++){
    console.log(15 + (CARD_WIDTH*(i)))
    cards.push({"x": 15*(i) + (CARD_WIDTH*(i)), "y":10, "image":images[i], 'revealed_image_id':images[i],"pressed":false, "revealed":false, "startTime":new Date(), "elapsed":0 });
  }
  
  for (var i = 3; i<6;i++){
    cards.push({"x": 15*(i-3) + (CARD_WIDTH*(i-3)), "y":CARD_HEIGHT+40, "image":images[i], 'revealed_image_id':images[i],"pressed":false, "revealed":false, "startTime":new Date(), "elapsed":0 });
  }
  return cards
}



function zColor(data) {
  const z = clamp(data.from.z + 0.5, 0, 1);
  return `rgba(0, ${255 * z}, ${255 * (1 - z)}, 1)`;
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

  for (var i = 0; i <6 ;i++){
    drawImageCard( cards[i].image,canvasCtx5,cards[i].x,cards[i].y);  
  }  
  //console.log(cards)
  drawLandmarks(
      canvasCtx5,
      Object.values([[19]])
          .map(index => results.poseLandmarks[index]),
      {color: zColor, fillColor: '#FF0000'});
  canvasCtx5.font = "30px Arial";
  cursorPos.x = results.poseLandmarks[19].x*out5.width;
  cursorPos.y = results.poseLandmarks[19].y*out5.height;
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


  for (var i = 0; i<6;i++){
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
      canvasCtx5.fillText(cards[i].elapsed, cursorPos.x, cursorPos.y)    
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
      minDetectionConfidence: 0.90,
      minTrackingConfidence: 0.90
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

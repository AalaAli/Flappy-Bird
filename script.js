
//board
let board;
let boardWidth = 360;
let boardHeight = 640;
let context;
//bird
let birdWidth = 34; //width/height ratio = 408/228 = 17/12
let birdHeight = 24;
let birdX = boardWidth / 8;
let birdY = boardHeight / 2;
let birdImg;

let bird = {
    x: birdX,
    y: birdY,
    width: birdWidth,
    height: birdHeight
}
//pipes
let pipeArray = [];
let pipeWidth = 64;
let pipeHeight = 512;
let pipeX = boardWidth;
let pipeY = 0;
let pipeImg;

let pipe = {
    x: pipeX,
    y: pipeY,
    width: pipeWidth,
    height: pipeHeight
}
let topPipeImg;
let bottomPipeImg;

//physics
let velocityX = -2;
let velocityY = 0;
let gravity = 0.4;



let gameOver = false;
let score=0;

window.onload = function () {
    board = document.getElementById('board');
    board.height = boardHeight;
    board.width = boardWidth;
    context = board.getContext('2d');//used for drawing on the board
    //load images
    birdImg = new Image();
    birdImg.src = "./flappybird.png";
    birdImg.onload = function () {
        context.drawImage(birdImg, bird.x, bird.y, bird.width, bird.height);
    }
    topPipeImg = new Image();
    topPipeImg.src = "./toppipe.png";
    bottomPipeImg = new Image();
    bottomPipeImg.src = "./bottompipe.png";

    setInterval(placePipes, 1500);
    document.addEventListener("keydown", moveBird);

    requestAnimationFrame(update);
};

function update() {

    requestAnimationFrame(update);
    if (gameOver) {
        return;
    }
    context.clearRect(0, 0, boardWidth, boardHeight);

    //bird
    velocityY += gravity;
    //bird.y+=velocityY;
    bird.y = Math.max(bird.y + velocityY, 0);//limit bird.y to top of the canvas
    context.drawImage(birdImg, bird.x, bird.y, bird.width, bird.height);
    if (bird.y > boardHeight) {
        gameOver = true;
    }
    //pipe
    for (let i = 0; i < pipeArray.length; i++) {
        let pipe = pipeArray[i];
        pipe.x += velocityX;
        context.drawImage(pipe.img, pipe.x, pipe.y, pipe.width, pipe.height);

        if(!pipe.passed && bird.x>pipe.x+pipe.width)
        {
            score+=0.5;
            pipe.passed=true;
        }
        if (detectCollision(bird, pipe)) {
            gameOver = true;
        }
    }
     //clear pipes
     if(pipeArray.length>0 && pipeArray[0]<-pipeWidth)
        pipeArray.shift();

    //score
    context.fillStyle='white';
    context.font='45px sans-serif';
    context.fillText(score,5,45);
    if(gameOver)
    context.fillText('GAME OVER',5,90);


}
function placePipes() {   //(0-1) *pipeHeight
    //-128
    //-128-256 
    if (gameOver) {
        return;
    }
    let oppeningSpace = boardHeight / 4;
    let randomPipeY = pipeY - pipeHeight / 4 - Math.random() * (pipeHeight / 2);
    let topPipe = {
        img: topPipeImg,
        x: pipeX,
        y: randomPipeY,
        width: pipeWidth,
        height: pipeHeight,
        passed: false
    }
    pipeArray.push(topPipe);
    let bottomPipe = {
        img: bottomPipeImg,
        x: pipeX,
        y: randomPipeY + pipeHeight + oppeningSpace,
        width: pipeWidth,
        height: pipeHeight,
        passed: false
    }
    pipeArray.push(bottomPipe);
}

function moveBird(e) {
    if (e.code == "Space" || e.code == "ArrowUp") {  //jump
        velocityY = -6;
        if(gameOver)
            {
                gameOver=false;
                pipeArray=[];
                bird.y=birdY;
                score=0;
            }
    }
    
}
function detectCollision(a, b) {
    return a.x < b.x + b.width &&   //a's top left corner doesn't reach b's top right corner
        a.x + a.width > b.x &&   //a's top right corner passes b's top left corner
        a.y < b.y + b.height &&  //a's top left corner doesn't reach b's bottom left corner
        a.y + a.height > b.y;    //a's bottom left corner passes b's top left corner

}

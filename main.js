//캔버스 세팅
let canvas;
let ctx;
canvas = document.createElement("canvas");
ctx = canvas.getContext("2d");
canvas.width = 400;
canvas.height = 700;
document.body.appendChild(canvas);

let backgroundImage,pokemonImage,flameImage,enemyImage,gameoverImage;
let gameover=false;
let score=0;

//포켓몬 좌표
let pokemonX = canvas.width/2-32;
let pokemonY = canvas.height-64;

let flamelist = []
function Flame() {
    this.x = 0;
    this.y = 0;
    this.alive = true;

    this.init = function () {
        this.x = pokemonX + 18;
        this.y = pokemonY + 10;
        this.alive = true;
        flamelist.push(this);
    };

    this.update = function () {
        this.y -= 7;
        // Check if the flame is above the canvas
        if (this.y < 0) {
            this.alive = false;
        }
    };

    this.checkHit = function () {
        for (let i = 0; i < enemylist.length; i++) {
            if (this.y <= enemylist[i].y && this.x >= enemylist[i].x && this.x <= enemylist[i].x + 40) {
                score++;
                this.alive = false;
                enemylist.splice(i, 1);
            }
        }
    };
}

function generateRandomValue(min, max) {
    let randomNum = Math.floor(Math.random() * (max - min + 1)) + min;
    return randomNum;
}

let enemylist = [];

function enemy() {
    this.x = 0;
    this.y = 0;  // Initialize y to 0
    this.init = function () {
        this.x = generateRandomValue(0, canvas.width - 48);
        enemylist.push(this);
    };
    this.update = function () {
        this.y += 3;
        if (this.y >= canvas.height - 48) {
            gameover = true;
        }
    };
}
function createEnemy() {
    const interval = setInterval(function () {
        const numberOfEnemies = 3; 
        for (let i = 0; i < numberOfEnemies; i++) {
            let e = new enemy();
            e.init();
        }
    }, 1000);
}

function loadImage(){
    backgroundImage = new Image();
    backgroundImage.src = "image/large.D27P11A.gif.914d50627e0a2827f0f30463584a972f.gif";
    
    pokemonImage = new Image();
    pokemonImage.src = "image/icons8-charmander-60.png";
    
    flameImage= new Image();
    flameImage.src = "image/icons8-flame-35.png";
    
    enemyImage = new Image();
    enemyImage.src = "image/icons8-psyduck-48.png";
    
    gameoverImage = new Image();
    gameoverImage.src = "image/images.png";
}

let keysDown={};
function setupkeyboardListener() {
    document.addEventListener("keydown", function(event){
    keysDown[event.keyCode] = true;
    });
    document.addEventListener("keyup",function(){
        delete keysDown[event.keyCode]

        if(event.keyCode == 32 ){
            createFlame()
        }
    });
}

function createFlame(){
    let f=new Flame();
    f.init()
}

function update(){
    if(39 in keysDown){
        pokemonX += 7;}
    if(37 in keysDown){
        pokemonX -= 7;
    }
    if(pokemonX <=0){
        pokemonX=0;
    }
    if(pokemonX >=canvas.width -64){
        pokemonX=canvas.width -64;
    }
    for(let i=0;i<flamelist.length;i++){
        if(flamelist[i].alive){
        flamelist[i].update();
        flamelist[i].checkHit();
        }
    }
    for(let i=0;i<enemylist.length;i++){
        enemylist[i].update();
    }
}

function render() {
    ctx.drawImage(backgroundImage, 0, 0, canvas.width, canvas.height);
    ctx.drawImage(pokemonImage, pokemonX, pokemonY)
    ctx.font = "24px 'Press Start 2P', cursive";
    ctx.fillStyle = "red";
    const scoreText = `Score: ${score}`;
    const scoreTextWidth = ctx.measureText(scoreText).width;
    const scoreX = (canvas.width - scoreTextWidth) / 2;
    const scoreY = 30; 

    ctx.fillText(scoreText, scoreX, scoreY);

    
    for(let i=0;i<flamelist.length;i++){
        if(flamelist[i].alive){
        ctx.drawImage(flameImage, flamelist[i].x, flamelist[i].y);
        }
    }
    for(let i=0;i<enemylist.length;i++){
        ctx.drawImage(enemyImage, enemylist[i].x, enemylist[i].y);
    }
}

function main() {
    if(!gameover){
    update();
    render();
    requestAnimationFrame(main);
    }
    else{
        ctx.drawImage(gameoverImage, 10, 100, 380, 350);
    }
}

loadImage();
setupkeyboardListener();
createEnemy();
main();
// declare global variables

const PI_30 = Math.PI / 30;
const CUBE_LENGTH = 80;
const TILE_HEIGHT = 8;
const SPEED = 10;
const CUBE_LENGTH_6 = CUBE_LENGTH / 6;

let renderer;
let scene;
let camera;
let ambientLight;
let pointLight;
let cube;
let endTile;
let numberOfTiles;
let tilePositionX = [];
let tilePositionY = [];
let tilePositionZ = [];
let coinPositionX = [];
let coinPositionZ = [];
let coin = [];
let startPointX = 200;
let startPointY = 200;
let startPointZ = -300;
let cubePosX;
let cubePosZ;
let score = 0;
let level = 1;
let tiles = [];
let gameStarted = false;
let turnAngle = (1.5707963267948966 * SPEED) / CUBE_LENGTH // == (Math.PI / 2.00) / (CUBE_LENGTH / SPEED);
let movementStopped = false;
let preglej = true;
let xAxis = new THREE.Vector3(1, 0, 0);
let zAxis = new THREE.Vector3(0, 0, 1);
let worldMatrix;
let bestscore = checkCookie("bestscore") ? getCookie("bestscore") : 0;


function sleep(delay) {
    var start = new Date().getTime();
    while (new Date().getTime() < start + delay);
}

// calculates the positions of level tiles
function calcTilePosition(n) {
    let randInt;
    tilePositionX[0] = startPointX;
    tilePositionY[0] = startPointY;
    tilePositionZ[0] = startPointZ;
    for (let i = 1; i < n; i++) {
        tilePositionX[i] = tilePositionX[i - 1];
        tilePositionY[i] = tilePositionY[i - 1];
        tilePositionZ[i] = tilePositionZ[i - 1];
        randInt = Math.floor((Math.random() * 4) + 1);
        if (i == 1) {
            switch (randInt) {
                case 1:
                    goForward("x", i);
                    break;
                case 2:
                    goForward("-x", i);
                    break;
                case 3:
                    goForward("z", i);
                    break;
                case 4:
                    goForward("-z", i);
                    break;
            }
        } else {
            let direction = getTileDirection(i - 1);
            if (i - 2 >= 0) {
                let dir = getTileDirection(i - 2);
                if (dir != direction) {
                    direction = dir;
                    continue;
                }
            }
            randInt = Math.floor((Math.random() * 3) + 1);
            switch (randInt) {
                case 1:
                    goForward(direction, i);
                    break;
                case 2:
                    turnLeft(direction, i);
                    break;
                case 3:
                    turnRight(direction, i);
                    break;
            }
        }
    }
}

function turnRight(direction, i) {
    let temp;
    let j;
    switch (direction) {
        case "x":
            temp = tilePositionZ[i] + CUBE_LENGTH;
            for (j = 0; j < numberOfTiles; j++) {
                if (tilePositionX[i] == tilePositionX[j] &&  temp == tilePositionZ[j]) {
                    return;
                }
            }
            tilePositionZ[i] = temp;
            break;
        case "-x":
            temp = tilePositionZ[i] - CUBE_LENGTH;
            for (j = 0; j < numberOfTiles; j++) {
                if (tilePositionX[i] == tilePositionX[j] && temp == tilePositionZ[j]) {
                    return;
                }
            }
            tilePositionZ[i] = temp;
            break;
        case "z":
            temp = tilePositionX[i] - CUBE_LENGTH;
            for (j = 0; j < numberOfTiles; j++) {
                if (temp == tilePositionX[j] && tilePositionZ[i] == tilePositionZ[j]) {
                    return;
                }
            }
            tilePositionX[i] = temp;
            break;
        case "-z":
            temp = tilePositionX[i] + CUBE_LENGTH;
            for (j = 0; j < numberOfTiles; j++) {
                if (temp == tilePositionX[j] && tilePositionZ[i] == tilePositionZ[j]) {
                    return;
                }
            }
            tilePositionX[i] = temp;
            break;
    }
}

function turnLeft(direction, i) {
    let temp;
    let j;
    switch (direction) {
        case "x":
            temp = tilePositionZ[i] - CUBE_LENGTH;
            for (j = 0; j < numberOfTiles; j++) {
                if (tilePositionX[i] == tilePositionX[j] && temp == tilePositionZ[j]) {
                    return;
                }
            }
            tilePositionZ[i] = temp;
            break;
        case "-x":
            temp = tilePositionZ[i] + CUBE_LENGTH;
            for (j = 0; j < numberOfTiles; j++) {
                if (tilePositionX[i] == tilePositionX[j] && temp == tilePositionZ[j]) {
                    return;
                }
            }
            tilePositionZ[i] = temp;
            break;
        case "z":
            temp = tilePositionX[i] + CUBE_LENGTH;
            for (j = 0; j < numberOfTiles; j++) {
                if (temp == tilePositionX[j] && tilePositionZ[i] == tilePositionZ[j]) {
                    return;
                }
            }
            tilePositionX[i] = temp;
            break;
        case "-z":
            temp = tilePositionX[i] - CUBE_LENGTH;
            for (j = 0; j < numberOfTiles; j++) {
                if (temp == tilePositionX[j] && tilePositionZ[i] == tilePositionZ[j]) {
                    return;
                }
            }
            tilePositionX[i] = temp;
            break;
    }
}

function goForward(direction, i) {
    let temp;
    let j;
    switch (direction) {
        case "x":
            temp = tilePositionX[i] + CUBE_LENGTH;
            for (j = 0; j < numberOfTiles; j++) {
                if (temp == tilePositionX[j] && tilePositionZ[i] == tilePositionZ[j]) {
                    return;
                }
            }
            tilePositionX[i] = temp;
            break;
        case "-x":
            temp = tilePositionX[i] - CUBE_LENGTH;
            for (j = 0; j < numberOfTiles; j++) {
                if (temp == tilePositionX[j] && tilePositionZ[i] == tilePositionZ[j]) {
                    return;
                }
            }
            tilePositionX[i] = temp;
            break;
        case "z":
            temp = tilePositionZ[i] + CUBE_LENGTH;
            for (j = 0; j < numberOfTiles; j++) {
                if (tilePositionX[i] == tilePositionX[j] && temp == tilePositionZ[j]) {
                    return;
                }
            }
            tilePositionZ[i] = temp;
            break;
        case "-z":
            temp = tilePositionZ[i] - CUBE_LENGTH;
            for (j = 0; j < numberOfTiles; j++) {
                if (tilePositionX[i] == tilePositionX[j] && temp == tilePositionZ[j]) {
                    return;
                }
            }
            tilePositionZ[i] = temp;
            break;
    }
}

// get the direction in which the tiles are generated
function getTileDirection(n) {
    if (tilePositionZ[n] == tilePositionZ[n - 1]) {
        if (tilePositionX[n] > tilePositionX[n - 1]) {
            return "x";
        } else {
            return "-x";
        }
    } else if (tilePositionX[n] == tilePositionX[n - 1]) {
        if (tilePositionZ[n] > tilePositionZ[n - 1]) {
            return "z";
        } else {
            return "-z";
        }
    }
}

// rotate the camera
function rotateCamera(x, y, z) {
    camera.rotation.x += x;
    camera.rotation.y += y;
    camera.rotation.z += z;
}

// create a cube
function createCube(width, height, depth, x, y, z) {
    // instantiate a loader
    let loader = new THREE.TextureLoader();

    //allow cross origin loading
    loader.crossOrigin = 'anonymous';

    let texture = loader.load( 'texture/cube.jpg' );  
    let geometry = new THREE.BoxGeometry(width, height, depth);
    let material = new THREE.MeshPhongMaterial({ map: texture });
    cube = new THREE.Mesh(geometry, material);
    cube.position.x = x;
    cube.position.y = y;
    cube.position.z = z;
    cubePosX = x;
    cubePosZ = z;
    scene.add(cube);
}

//create a coin
function createCoin(width, depth, x, y, z) {
    // instantiate a loader
    let loader = new THREE.TextureLoader();

    //allow cross origin loading
    loader.crossOrigin = 'anonymous';
    let texture = loader.load('texture/gold.jpg');
    let geometry = new THREE.CylinderGeometry(width, width, depth, 15, 1)
    let material = new THREE.MeshPhongMaterial({map: texture});
    coin[coinPositionX.length] = new THREE.Mesh(geometry, material);
    coin[coinPositionX.length].position.x = x;
    coin[coinPositionX.length].position.y = y;
    coin[coinPositionX.length].position.z = z;
    coin[coinPositionX.length].rotation.x += Math.PI/2;
    scene.add(coin[coinPositionX.length]);
}

// creates a powerUP pill
function createPowerUp(radius, tube, radialSegments, tubularSegments, x, y, z) {
    // instantiate a loader
    let loader = new THREE.TextureLoader();

    //allow cross origin loading
    loader.crossOrigin = 'anonymous';
    let texture = loader.load('texture/powerUP.jpg');
    let geometry = new THREE.TorusGeometry(radius, tube, radialSegments, tubularSegments);
    let material = new THREE.MeshPhongMaterial({ map: texture });
    powerUps[powerUpPositionX.length] = new THREE.Mesh(geometry, material);
    powerUps[powerUpPositionX.length].position.x = x;
    powerUps[powerUpPositionX.length].position.y = y;
    powerUps[powerUpPositionX.length].position.z = z;
    scene.add(powerUps[powerUpPositionX.length]);
}

// creates a tile
function createTile(width, height, depth, x, y, z, img) {
    // instantiate a loader
    let loader = new THREE.TextureLoader();
    //allow cross origin loading
    loader.crossOrigin = 'anonymous';

    let texture = loader.load( img ); 
    let geometry = new THREE.BoxGeometry(width, height, depth);
    let material = new THREE.MeshPhongMaterial({ map: texture });
    let tile = new THREE.Mesh(geometry, material);
    tile.position.x = x;
    tile.position.y = y;
    tile.position.z = z;
    tiles.push(tile);
    scene.add(tile);
}

// creates the tile at the end of the level
function createEndTile(width, height, depth, x, y, z) {
    let texture = new THREE.TextureLoader().load('texture/end.jpg');
    let geometry = new THREE.BoxGeometry(width, height, depth);
    let material = new THREE.MeshPhongMaterial({ map: texture });
    endTile = new THREE.Mesh(geometry, material);
    endTile.position.x = x;
    endTile.position.y = y;
    endTile.position.z = z;
    scene.add(endTile);
}

// create the ambient light and add it to the scene
function addAmbientLight() {
    ambientLight = new THREE.AmbientLight(0xffffff);
    scene.add(ambientLight);
}

// create point light and add it to the scene
function addPointLight(x, y, z) {
    pointLight = new THREE.PointLight(0xffffff, 1, 10000);
    pointLight.position.x = x;
    pointLight.position.y = y;
    pointLight.position.z = z;
    scene.add(pointLight);
}

// create a camera and add it to the scene
function addCamera(x, y, z) {
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 10000);
    camera.position.set(x, y, z);
    scene.add(camera);
}

// create renderer
function addRenderer() {
    renderer = new THREE.WebGLRenderer();
    renderer.autoClear = false;
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.antialias = true;
    document.body.appendChild(renderer.domElement);
}

function addBackground(name) {

    // instantiate a loader
    let loader = new THREE.TextureLoader();

    //allow cross origin loading
    loader.crossOrigin = 'anonymous';
    let texture = loader.load(name);
    scene.background = texture;
}

// create the whole scene
function createScene() {
    scene = new THREE.Scene();
    addCamera(600, 600, -50);
    rotateCamera(-1, 0.75, 0.8);
    addRenderer();
    addAmbientLight();
    addPointLight(-1000, 1000, 0);
    addBackground('texture/background.jpg');

    calcTilePosition(numberOfTiles);
    
    let img = 'texture/floor.jpg';

    for (let i = 0; i < numberOfTiles; i++) {
        createTile(CUBE_LENGTH, TILE_HEIGHT, CUBE_LENGTH, tilePositionX[i], tilePositionY[i], tilePositionZ[i], img);

        let test = Math.floor((Math.random() * 10) + 1);

        if (test > 7 && tilePositionX[i] != startPointX && tilePositionZ[i] != startPointZ && tilePositionX[numberOfTiles - 1] != tilePositionX[i] && tilePositionZ[numberOfTiles - 1] != tilePositionZ[i]) {
            coinPositionX.push(tilePositionX[i]);
            coinPositionZ.push(tilePositionZ[i]);
            
            createCoin(CUBE_LENGTH_6, 10, tilePositionX[i], tilePositionY[i] + 40, tilePositionZ[i]);
        }
    }
    createEndTile(60, 4, 60, tilePositionX[numberOfTiles - 1], tilePositionY[numberOfTiles - 1] + 8, tilePositionZ[numberOfTiles - 1]);

    createCube(CUBE_LENGTH, CUBE_LENGTH, CUBE_LENGTH, tilePositionX[0], tilePositionY[0] + CUBE_LENGTH/2, tilePositionZ[0]);
}
function changeScene() {
    reset();
    scene = new THREE.Scene();
    addCamera(600, 600, -50);
    rotateCamera(-1, 0.75, 0.8);
    addAmbientLight();
    addPointLight(-1000, 1000, 0);

    calcTilePosition(numberOfTiles);
    
    let test = Math.floor((Math.random() * 21) + 1);
    let img = 'texture/floor' + test + '.jpg';
    
    if (test <= 8) {
        addBackground('texture/background2.jpg');
    } else if (test > 8 && test <= 13) {
        addBackground('texture/background.jpg');
    } else if (test > 13 && test <= 15) {
        addBackground('texture/background3.jpg');
    } else {
        addBackground('texture/background1.jpg');
    }

    /*
    if (test == 1 || test == 8 || test == 5 || test == 11 || test == 18 || test == 16 || test == 20 || test == 21) {
        addBackground('texture/background2.jpg');
    } else if (test == 2 || test == 3 || test == 4 || test == 6 || test == 7) {
        addBackground('texture/background.jpg');
    } else if (test == 17 || test == 19 || test == 10) {
        addBackground('texture/background3.jpg');
    } else {
        addBackground('texture/background1.jpg');
    }
    */

    for (let i = 0; i < numberOfTiles; i++) {
        createTile(CUBE_LENGTH, TILE_HEIGHT, CUBE_LENGTH, tilePositionX[i], tilePositionY[i], tilePositionZ[i], img);

        let test = Math.floor((Math.random() * 10) + 1);

        if(test > 7 && tilePositionX[i] != startPointX && tilePositionZ[i] != startPointZ && tilePositionX[numberOfTiles - 1] != tilePositionX[i] && tilePositionZ[numberOfTiles - 1] != tilePositionZ[i]){
            coinPositionX.push(tilePositionX[i]);
            coinPositionZ.push(tilePositionZ[i]);
            
            createCoin(CUBE_LENGTH_6, 10, tilePositionX[i], tilePositionY[i] + 40, tilePositionZ[i]);
        }
    }
    createEndTile(60, 4, 60, tilePositionX[numberOfTiles - 1], tilePositionY[numberOfTiles - 1] + 8, tilePositionZ[numberOfTiles - 1]);

    createCube(CUBE_LENGTH, CUBE_LENGTH, CUBE_LENGTH, tilePositionX[0], tilePositionY[0] + CUBE_LENGTH/2, tilePositionZ[0]);
}

/*
function addscore(){
    score += 1;
}
*/

/*
function isFullScreen(){
    return (window.innerWidth == screen.width && window.innerHeight == screen.height);
}
*/

function reset() {
    tilePositionX = [];
    tilePositionY = [];
    tilePositionZ = [];
    coinPositionX = [];
    coinPositionZ = [];
    coin = [];
    tile = [];
}

function nextFloor() {
    level++;
    document.getElementById('level').innerHTML = level;
    numberOfTiles = level * 50;
    changeScene();
}

function updateBestScore(score, finish) {
    bestscore = score
    setCookie('bestscore', score, 1);
    if (finish) {
        document.getElementById("bscore").innerHTML = score;
    }
}

function checkfloor() {
    if (cube.position.x == tilePositionX[numberOfTiles - 1] && cube.position.z == tilePositionZ[numberOfTiles - 1]) {
        if(score > bestscore){
            updateBestScore(score, true)
        }
        nextFloor();
    }

    let tla = false;
    for(i = 0; i<tilePositionX.length; i++){
        if(tilePositionX[i] == cube.position.x && tilePositionZ[i] == cube.position.z && tilePositionY[i] == cube.position.y-40){
            tla = true;
            break;
        }
    }
    if(!tla){
        if(score > bestscore){
            updateBestScore(score, false)
        }
        location.reload();
    }
}

function checkscore(){
    for (var i = coinPositionX.length - 1; i >= 0; i--) {
        if (coinPositionX[i] == cube.position.x && coinPositionZ[i] == cube.position.z ) {
            score = score + 10;
            scene.remove(coin[i+1]);
            coinPositionX[i] = null;
            coinPositionZ[i] = null;
            //return;
        }
    }
}

function hide_menu(){
    document.getElementById('menu').style.display = 'none';
    gameStarted = true;
}

function rotateCube(axis, angle) {
    worldMatrix = new THREE.Matrix4();

    worldMatrix.makeRotationAxis(axis.normalize(), angle);

    worldMatrix.multiply(cube.matrix);

    cube.matrix = worldMatrix;

    cube.rotation.setFromRotationMatrix(cube.matrix);
}

function checkmove(){
    for (let i = 1; i < coin.length; i++) {
        coin[i].rotation.z += PI_30;
    }
    if (cube.position.x > cubePosX){        // LEFT
        cube.position.x -= SPEED;
        rotateCube(zAxis, turnAngle);
        camera.position.x -= SPEED;
        preglej = true;
    } else if(cube.position.x < cubePosX){        // RIGHT
        cube.position.x += SPEED;
        rotateCube(zAxis, -turnAngle);
        camera.position.x += SPEED;
        preglej = true;
    } else if(cube.position.z > cubePosZ){        // FORWARD
        cube.position.z -= SPEED;
        rotateCube(xAxis, -turnAngle);
        camera.position.z -= SPEED;
        preglej = true;
    } else if (cube.position.z < cubePosZ) {      // BACK
        cube.position.z += SPEED;
        rotateCube(xAxis, turnAngle);
        camera.position.z += SPEED;
        preglej = true;
    } else if (preglej){
        preglej = false;
        checkscore();
        checkfloor();
        movementStopped = true;
    }
}
function moveCube(direction,times){
    switch (direction){
        case "left":
            cubePosX = cube.position.x - (CUBE_LENGTH*times); 
            break;
        case "right":
            cubePosX = cube.position.x + (CUBE_LENGTH*times); 
            break;
        case "forward":
            cubePosZ = cube.position.z - (CUBE_LENGTH*times); 
            break; 
        case "back":
            cubePosZ = cube.position.z + (CUBE_LENGTH*times); 
            break; 
    }
}
function keydowna(event){
    if (event.keyCode == 13) {  // pressed enter
        hide_menu();
    }

    if (!gameStarted) {
        return;
    }

    if (event.key == "ArrowLeft") {
        moveCube("back",1);
    }
    if (event.key == "ArrowRight") {
        moveCube("forward",1);
    }
    if (event.key == "ArrowUp") {
        moveCube("left",1);
    }
    if (event.key == "ArrowDown") {
        moveCube("right",1);
    }
}

// draw on the canvas
function draw() {
    let lastLoop = Date.now();
    let prevFps = 0

    renderer.clear();
    renderer.render(scene, camera);
    window.onkeyup = keydowna;
    checkmove();
    board();
    requestAnimationFrame(draw);

    let thisLoop = Date.now();
    let fps = 1000 / (thisLoop - lastLoop);
    lastLoop = thisLoop;

    if (prevFps !== fps) {
        document.getElementById("fps").innerHTML = parseInt(fps);
    }
    prevFps = fps;
}

function board(){
    document.getElementById("score").innerHTML = score;
    document.getElementById("bscore").innerHTML = bestscore;
}

function run() {
    numberOfTiles = level * 50;
    createScene();
    document.getElementById('loading').style.display = 'none';
    document.getElementById('menu').style.display = 'block';
    
    draw();
}

// start the game!!!!!
function start() {
    run();
}

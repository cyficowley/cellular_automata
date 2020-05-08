import {stepForward, state} from './game.js'

var camera, scene, renderer;
var cube;


var config = function() {
    this.color = "#ffae23"
    this.cubeSize = 4
};


var cfg = new config();
var gui = new dat.GUI({name: 'Cellular Automata'});

var f1 = gui.addFolder('Render Options');
f1.addColor(cfg, 'color')
f1.add(cfg, 'cubeSize', 1, 10)



var cubeSize = 4;
var geometry = new THREE.PlaneGeometry(cubeSize, cubeSize);
var material = new THREE.MeshBasicMaterial( { color: cfg.color } );

var spriteMaterial = new THREE.SpriteMaterial();


init();
animate();







function init() {

    camera = new THREE.PerspectiveCamera( 70, window.innerWidth / window.innerHeight, 1, 1000 );
    camera.position.z = 400;

    scene = new THREE.Scene();

    renderer = new THREE.WebGLRenderer({ antialias: false, precision:'lowp'});
    renderer.setPixelRatio( window.devicePixelRatio );
    renderer.setSize( window.innerWidth, window.innerHeight );
    document.body.appendChild( renderer.domElement );

/*let prettyprint = (arr) => {
    mat = ""
    for (let i = 0; i < arr.length; i++){
        outstring = ""
        for (let j = 0; j < arr[i].length; j++){
            if(arr[i][j] != 0){
                outstring += 'M'
            }
            else{
                outstring += '\xa0'
            }
        }
        outstring += '\n'
        mat += outstring
    }
    return mat   
}*/
    //

    window.addEventListener( 'resize', onWindowResize, false );

}

function onWindowResize() {

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize( window.innerWidth, window.innerHeight );

}

function addCubeRow(row, cols){
    let len = cols.length;
    cols.forEach((col, i) => {
        if(col){
            cube = new THREE.Mesh( geometry, material );
            // let cube = new THREE.Sprite( spriteMaterial );
            cube.position.x = i * cubeSize - len / 2 * cubeSize;
            cube.position.y = -row * cubeSize + 270;
            scene.add(cube);
        }
    })
}

function clearWindow(){
    while(scene.children.length > 0){ 
        scene.remove(scene.children[0]); 
    }
}

function drawWindow(board){
    board.forEach((row, i) => {
        addCubeRow(i, row)
    })
}

function updateParams(){
    material = new THREE.MeshBasicMaterial( { color: cfg.color } );
    cubeSize = cfg.cubeSize;
    geometry = new THREE.PlaneGeometry(cubeSize, cubeSize);
}

function animate() {
    //requestAnimationFrame( animate );


    setTimeout( function() {

        requestAnimationFrame( animate );

    }, 50);

    console.time('someFunction')
    let {board, state} = stepForward();

    updateParams();
    clearWindow();

    //renderer.setClearColor (0x000000, 1);
    drawWindow(board);
    console.timeEnd('someFunction')
    renderer.render( scene, camera );


}
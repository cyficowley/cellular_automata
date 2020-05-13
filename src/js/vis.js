import {stepForward, state} from './game.js'
import * as THREE from './three.module.js'
import {OrbitControls} from './OrbitControls.js'
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
var controls;
var geometry = new THREE.BoxGeometry(cubeSize, cubeSize, cubeSize);
var material = new THREE.MeshStandardMaterial( { color: cfg.color} );
let pointLight = new THREE.PointLight(0xffffff, 5, 1000);
pointLight.position.set( 0, 30, 200 );
let secondLight = new THREE.AmbientLight(0xffffff, .2);



init();
animate();







function init() {

    camera = new THREE.PerspectiveCamera( 70, window.innerWidth / window.innerHeight, 1, 1000 );
    camera.position.set(0,0,400);
    console.log(THREE)
    scene = new THREE.Scene();
    controls = new OrbitControls( camera, document.getElementById("board") );

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

function addCubeRow(row, cols, z){
    let len = cols.length;
    cols.forEach((col, i) => {
        if(col){
            cube = new THREE.Mesh( geometry, material );
            // let cube = new THREE.Sprite( spriteMaterial );
            cube.position.x = i * cubeSize - len / 2 * cubeSize;
            cube.position.y = -row * cubeSize ;
            cube.position.z = z * cubeSize;
            scene.add(cube);
        }
    })
}

function clearWindow(){
    while(scene.children.length > 0){ 
        scene.remove(scene.children[0]); 
    }
}

function drawWindow(board, state){
    if(state.dimensions === 3){
        board.forEach((plane, i) => {
            plane.forEach((row, j) => {
                addCubeRow(i, row, j);
            })
        })
    }
    else{
        board.forEach((row, i) => {
            addCubeRow(i, row, 0)
        })
    }
}

function updateParams(){
    material = new THREE.MeshStandardMaterial( { color: cfg.color} );
    cubeSize = cfg.cubeSize;
    geometry = new THREE.BoxGeometry(cubeSize, cubeSize, cubeSize);
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
    controls.update();
    //renderer.setClearColor (0x000000, 1);
    drawWindow(board, state);
    scene.add(pointLight)
    scene.add(secondLight)
    console.timeEnd('someFunction')
    renderer.render( scene, camera );


}
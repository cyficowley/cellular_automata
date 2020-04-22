/* Conway's Game of Life */

const dimensions = 2;
const length = 100;

const ALIVE = 1;
const DEAD  = 0;

// Initialize Dimensions for Board 
dimensionLengths = new Array(dimensions).fill(length)

/*

Any live cell with fewer than two live neighbours dies, as if by underpopulation.
Any live cell with two or three live neighbours lives on to the next generation.
Any live cell with more than three live neighbours dies, as if by overpopulation.
Any dead cell with exactly three live neighbours becomes a live cell, as if by reproduction.

*/

const generateRuleDic = () => {
    const dic = {}
    for(let i = -(3**dimensions); i < 3**dimensions; i ++){
        dic[i] = ruleFunctionNegative(i, dimensions);
    }
    return dic
}

const ruleFunctionNegative = (neighbours, dimensions) => {
    // Ratio of alive neighbors to total neighbors
    
    let living = false;
    if(neighbours < 0){
        living = true;
        neighbours += 3 ** dimensions
    }
    
    let nr = neighbours/(3**dimensions-1)
    if(living){
        if(nr < 0.25){ //1
            return DEAD;
        }
        else if(nr < 0.5){ //2 3 
            return ALIVE;
        }
        else{ // 4+
            return DEAD;
        }
    }
    else{
        if(nr == .375){
            return ALIVE;
        }
        else{
            return DEAD;
        }
    }
}

state = {
    rules:generateRuleDic(),
    board:[...Array(length)].map(x=>Array(length).fill(0))
}


let automataStep = () => {
    
    let kernel = tf.tensor([[1,1,1], [1, -(3 ** dimensions),1], [1, 1, 1]], dtype=tf.uint8)
    kernel = kernel.expandDims(2).expandDims(3)

    let in_board = tf.tensor(state.board)
    in_board = in_board.expandDims(2)

    let out = tf.conv2d(in_board, kernel, 1, 'same').arraySync()
    for (let i = 0; i < out.length; i++){
        for (let j = 0; j < out[i].length; j++){
            out[i][j] = state.rules[out[i][j]]
        }
    }
    return out
}

/*
1 0 0
1 1 0

1 1 0
1 1 0
*/

state.board[0][0] = 1;
state.board[1][0] = 1;
state.board[1][1] = 1;

automataStep()

// var scene = new THREE.Scene();
// var camera = new THREE.PerspectiveCamera( 75, window.innerWidth/window.innerHeight, 0.1, 1000 );

// var renderer = new THREE.WebGLRenderer();
// renderer.setSize( window.innerWidth, window.innerHeight );
// document.body.appendChild( renderer.domElement );

// var geometry = new THREE.BoxGeometry();
// var material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
// var cube = new THREE.Mesh( geometry, material );
// scene.add( cube );

// camera.position.z = 5;

// var animate = function () {
//     requestAnimationFrame( animate );

//     cube.rotation.x += 0.01;
//     cube.rotation.y += 0.01;

//     renderer.render( scene, camera );
// };
// animate();
ruleFunctionNegative()
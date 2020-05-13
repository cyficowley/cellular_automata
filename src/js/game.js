/* Conway's Game of Life */


const ALIVE = 1;
const DEAD  = 0;
const TOTAL_STEPS = 10;
let steps = 0;
const LENGTH = 10
const DIMENSIONS = 3;

// Initialize state.dimensions for Board 

/*

Any live cell with fewer than two live neighbours dies, as if by underpopulation.
Any live cell with two or three live neighbours lives on to the next generation.
Any live cell with more than three live neighbours dies, as if by overpopulation.
Any dead cell with exactly three live neighbours becomes a live cell, as if by reproduction.

*/
let kernel3 = [...Array(3)].map(x=>[...Array(3)].map(x=>Array(3).fill(1)))
kernel3[1][1][1] = -(3**3)

let state = {
    rules:undefined,
    // board:[...Array(LENGTH)].map(x=>Array(LENGTH).fill(0)),
    board:[...Array(LENGTH)].map(x=>[...Array(LENGTH)].map(x=>Array(LENGTH).fill(0))),
    // board:new Array(LENGTH).fill(0),
    dimensions: DIMENSIONS,
    // kernel: [[1,1,1], [1, -(3 ** DIMENSIONS),1], [1, 1, 1]],
    kernel: kernel3,
    // kernel:[4,2,1],
    length: LENGTH
}


const generateRuleDic = () => {
    const dic = {}
    for(let i = -(3**state.dimensions); i < 3**state.dimensions; i ++){
        dic[i] = ruleFunctionNegative(i);
    }
    return dic
}


const generate1DRuleDic = (rule) => {
    //00011110
    let dic = {}
    for(let i=7; i>=0; i--){

        dic[i] = rule[7-i] == "1" ? 1 : 0;

    }

    return dic
}

const ruleFunctionNegative = (neighbours) => {
    // Ratio of alive neighbors to total neighbors
    
    let living = false;
    if(neighbours < 0){
        living = true;
        neighbours += 3 ** state.dimensions
    }
    
    let nr = neighbours/(3**state.dimensions-1)
    if(living){
        if(nr < 0.1){ //1
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

// state.rules = generate1DRuleDic("01011010");
state.rules = generateRuleDic();
console.log(state.kernel);


let automataStep = () => {
    let out, in_board, kernel;
    kernel = tf.tensor(state.kernel)
    kernel = kernel.expandDims(state.dimensions).expandDims(state.dimensions + 1)

    in_board = tf.tensor(state.board)
    // console.log(in_board);
    

    //[100, 100, 1]
    //  [100]
    in_board = in_board.expandDims(state.dimensions)
    switch(state.dimensions){
        case 1:
            out = tf.conv1d(in_board, kernel, 1, 'same')
            break
        case 2:
            out = tf.conv2d(in_board, kernel, 1, 'same')
            break
        case 3:
            out = tf.conv3d(in_board, kernel, 1, 'same')
            break
        default:
            throw "Wrong Number of state.dimensions (Needs to be 1,2,3)"
            
    }

    state.board = tf.tensor(
                    out.flatten()
                    .arraySync()
                    .map(x => state.rules[x])
                ).reshape(in_board.squeeze().shape).arraySync();
    console.log(state.rules);
}



const startPattern = `




              * * *
              *   *
              *   *
              *   *
              * * *






                        *                    
                      * *                    
            **      **            **          
           *   *    **            **        
**        *     *   **                      
**        *   * **    * *                    
          *     *       *                    
           *   *                           
            **
`;
const threedstart = `

  * * *
   * *
  * * * 
`;
let startPatternRule30 = "                                                                                                                                              *          "

let generateStartState = (state, pattern) => {
    let lines = pattern.split('\n');
    if(state.dimensions == 1){
        let line = lines[0];
        [...line].forEach((char, j) => {
            state.board[j] = char == "*" ? 1 : 0
        })
    }
    else if(state.dimensions == 3){
        for (let z=0; z < state.length; z++){
            lines.forEach((line, i) => {
                [...line].forEach((char, j) => {
                    state.board[i][j][z] = char == "*" ? 1 : 0
                })
            });
        }
    }
    else{
        lines.forEach((line, i) => {
            [...line].forEach((char, j) => {
                state.board[i][j] = char == "*" ? 1 : 0
            })
        });
    }
}

generateStartState(state, threedstart);

console.log(state.board)

let prettyprint = (arr) => {
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
}


let res = []
let autoStepForward = () => {
    let out_board;
    switch(state.dimensions){
        case 1:
            automataStep()
            res.push(state.board)
            if (res.length > state.length){
                console.log("poppin");
                res.shift();
            }
            out_board = res
            break
        case 2:
            out_board = state.board
            automataStep()
            break
    }
    out_board = prettyprint(out_board)
    document.getElementById("board").innerText = out_board
    document.getElementById("board").style.color = `rgb(${Math.floor(Math.random()*255)},${Math.floor(Math.random()*255)},${Math.floor(Math.random()*255)})`
    setTimeout(() => autoStepForward(), 100);
}

let stepForward = () => {
    let out_board;
    switch(state.dimensions){
        case 1:
            automataStep()
            res.push(state.board)
            if (res.length > state.length){
                console.log("poppin");
                res.shift();
            }
            out_board = res
            break
        case 2:
            out_board = state.board
            automataStep()
            break
        case 3: 
            out_board = state.board
            automataStep()
            break
    }
    return {board:out_board, state:state};
}

export {stepForward, state}
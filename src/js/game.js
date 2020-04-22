/* Conway's Game of Life */

const dimensions = 2;
const length = 100;

const ALIVE = 1;
const DEAD  = 0;
const TOTAL_STEPS = 10;
let steps = 0;

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
    kernel = kernel.reshape([3, 3, 1, 1])

    let in_board = tf.tensor(state.board)
    in_board = in_board.expandDims(2)

    let out = tf.conv2d(in_board, kernel, 1, 'same').arraySync()
    for (let i = 0; i < out.length; i++){
        for (let j = 0; j < out[i].length; j++){
            out[i][j] = state.rules[out[i][j]]
        }
    }
    state.board = out
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


let generateStartState = (state, pattern) => {
    let lines = pattern.split('\n');
    lines.forEach((line, i) => {
        [...line].forEach((char, j) => {
            state.board[i][j] = char == "*" ? 1 : 0
        })
    });

}

generateStartState(state, startPattern);

let prettyprint = (arr) => {
    mat = ""
    for (let i = 0; i < arr.length; i++){
        outstring = ""
        for (let j = 0; j < arr.length; j++){
            if(arr[i][j] != 0){
                outstring += '■'
            }
            else{
                outstring += '\xa0\xa0'
            }
        }
        outstring += '\n'
        mat += outstring
    }
    return mat   
}

let stepForward = () => {
    setInterval(() => {
    let s = prettyprint(state.board)
    document.getElementById("board").innerText = s
    automataStep()
    steps++;}, 200)
}
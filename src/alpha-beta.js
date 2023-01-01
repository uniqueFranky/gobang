
const continuousFive = 10000000;
const doubleFour = 10000;
const doubleThree = 1000;
const doubleTwo = 100;
const doubleOne = 10;
const singleFour = 1000;
const singleThree = 100;
const singleTwo = 10;

const constantDoubleScores = [
    0, doubleOne, doubleTwo, doubleThree, doubleFour, continuousFive
];
const constantSingleScores = [
    0, 0, singleTwo, singleThree, singleFour, continuousFive
];

export function aiSolve(status, callback) {

    let start = performance.now();
    let ij = alpha_beta(status, 1, 4, -(10**9), 10**9);
    let end = performance.now();
    callback(ij[0], ij[1], end - start);
}

function alpha_beta(status, curDep, maxDep, alpha, beta) {
    if(curDep === maxDep) {

        return calcScore(status);
    }
    let maxposi, maxposj;

    let selectable = new Array(15);
    for(let i = 0; i < 15; i++) {
        selectable[i] = new Array(15).fill(false);
    }
    for(let i = 0; i < 15; i++) {
        for(let j = 0; j < 15; j++) {
            if(status[i][j] !== 'None') {
                for(let k = -3; k <= 3; k++) {
                    if(i + k >= 0 && i + k < 15 && status[i + k][j] === 'None') {
                        selectable[i + k][j] = true;
                    }
                    if(j + k >= 0 && j + k < 15 && status[i][j + k] === 'None') {
                        selectable[i][j + k] = true;
                    }
                    if(i + k >= 0 && i + k < 15 && j + k >= 0 && j + k < 15 && status[i + k][j + k] === 'None') {
                        selectable[i + k][j + k] = true;
                    }
                    if(i - k >= 0 && i - k < 15 && j + k >= 0 && j + k < 15 && status[i - k][j + k] === 'None') {
                        selectable[i - k][j + k] = true;
                    }
                }
            }
        }
    }
    let moveX = [];
    let moveY = [];
    for(let i = 0; i < 15; i++) {
        for(let j = 0; j < 15; j++) {
            if(selectable[i][j]) {
                moveX.push(i);
                moveY.push(j);
            }
        }
    }
    let moveLen = moveX.length;
    if(curDep % 2 === 0) { // Player's turn, min node
        for(let id = 0; id < moveLen; id++) {
            let i = moveX[id];
            let j = moveY[id];
            status[i][j] = 'Player';
            let val = alpha_beta(status, curDep + 1, maxDep, -(10**9), alpha);
            if(val < alpha) {
                alpha = val;
            }
            status[i][j] = 'None';
            if(alpha <= beta) {
                // console.log("cut min alpha=" + alpha + " beta=" + beta);
                return alpha;
            }
        }
        return alpha;
    } else { // Computer's turn, max node
        for(let id = 0; id < moveLen; id++) {
            let i = moveX[id];
            let j = moveY[id];
            status[i][j] = 'Computer';
            let val = alpha_beta(status, curDep + 1, maxDep, 10 ** 9, alpha);
            if (val > alpha) {
                alpha = val;
                maxposi = i;
                maxposj = j;
            }
            status[i][j] = 'None';
            if (alpha >= beta) {
                // console.log("cut max alpha=" + alpha + " beta=" + beta);
                return alpha;
            }
        }
    }
    // console.log(alpha);
    if(curDep === 1) {
        return [maxposi, maxposj];
    } else {
        return alpha;
    }

}

function haveContinuousPiecesVertically(status, turn, x, y, len) {
    for(let i = 0; i < len; i++) {
        if(i + x >= 15 || status[i + x][y] !== turn) {
            return false;
        }
    }
    return true;
}

function haveContinuousPiecesHorizontally(status, turn, x, y, len) {
    for(let j = 0; j < len; j++) {
        if(j + y >= 15 || status[x][j + y] !== turn) {
            return false;
        }
    }
    return true;
}

function haveContinuousPiecesOnMainDiagonal(status, turn, x, y, len) {
    for(let k = 0; k < len; k++) {
        let xx = x + k;
        let yy = y + k;
        if(xx >= 15 || yy >= 15 || status[xx][yy] !== turn) {
            return false;
        }
    }
    return true;
}
function haveContinuousPiecesOnSubDiagonal(status, turn, x, y, len) {
    for(let k = 0; k < len; k++) {
        let xx = x + k;
        let yy = y - k;
        if(xx >= 15 || yy < 0 || status[xx][yy] !== turn) {
            return false;
        }
    }
    return true;
}

function isDoubleVertically(status, turn, x, y, len) {
    if(!haveContinuousPiecesVertically(status, turn, x, y, len)) {
        return false;
    }
    let x1 = x - 1;
    let x2 = x + len;
    if(x1 < 0 || x2 >= 15) {
        return false;
    }
    return status[x1][y] === 'None' && status[x2][y] === 'None';
}

function isSingleVertically(status, turn, x, y, len) {
    if(!haveContinuousPiecesVertically(status, turn, x, y, len)) {
        return false;
    }
    let x1 = x - 1;
    let x2 = x + len;
    if(x1 >= 0 && status[x1][y] === 'None') {
        return true;
    }
    return x2 < 15 && status[x2][y] === 'None';

}

function isDoubleHorizontally(status, turn, x, y, len) {
    if(!haveContinuousPiecesHorizontally(status, turn, x, y, len)) {
        return false;
    }
    let y1 = y - 1;
    let y2 = y + len;
    if(y1 < 0 || y2 >= 15) {
        return false;
    }
    return status[x][y1] === 'None' && status[x][y2] === 'None';
}

function isSingleHorizontally(status, turn, x, y, len) {
    if(!haveContinuousPiecesHorizontally(status, turn, x, y, len)) {
        return false;
    }
    let y1 = y - 1;
    let y2 = y + len;
    if(y1 >= 0 && status[x][y1] === 'None') {
        return true;
    }
    return y2 < 15 && status[x][y2] === 'None';

}

function isDoubleOnMainDiagonal(status, turn, x, y, len) {
    if(!haveContinuousPiecesOnMainDiagonal(status, turn, x, y, len)) {
        return false;
    }
    let x1 = x - 1;
    let y1 = y + 1;
    let x2 = x + len;
    let y2 = y - len;
    if(x1 < 0 || y1 >= 15 || x2 >= 15 || y2 < 0) {
        return false;
    }
    return status[x1][y1] === 'None' && status[x2][y2] === 'None';
}

function isSingleOnMainDiagonal(status, turn, x, y, len) {
    if(!haveContinuousPiecesOnMainDiagonal(status, turn, x, y, len)) {
        return false;
    }
    let x1 = x - 1;
    let y1 = y - 1;
    let x2 = x + len;
    let y2 = y + len;
    if(x1 >= 0 && y1 >= 0 && status[x1][y1] === 'None') {
        return true;
    }
    return x2 < 15 && y2 < 15 && status[x2][y2] === 'None';

}

function isSingleOnSubDiagonal(status, turn, x, y, len) {
    if(!haveContinuousPiecesOnSubDiagonal(status, turn, x, y, len)) {
        return false;
    }
    let x1 = x - 1;
    let y1 = y + 1;
    let x2 = x + len;
    let y2 = y - len;
    if(x1 >= 0 && y1 < 15 && status[x1][y1] === 'None') {
        return true;
    }
    return x2 < 15 && y2 >= 0 && status[x2][y2] === 'None';

}

function isDoubleOnSubDiagonal(status, turn, x, y, len) {
    if(!haveContinuousPiecesOnSubDiagonal(status, turn, x, y, len)) {
        return false;
    }
    let x1 = x - 1;
    let y1 = y - 1;
    let x2 = x + len;
    let y2 = y + len;
    if(x1 < 0 || y1 < 0 || x2 >= 15 || y2 >= 15) {
        return false;
    }
    return status[x1][y1] === 'None' && status[x2][y2] === 'None';
}


function calc(status, turn) {
    let score = 0;
    for(let i = 0; i < 15; i++) {
        for(let j = 0; j < 15; j++) {
            for(let len = 5; len >= 1; len--) {

                if(status[i][j] === 'None') {
                    break;
                }

                let thisScore = 0;
                if(isDoubleVertically(status, turn, i, j, len)) {
                    thisScore += constantDoubleScores[len];
                } else if(isSingleVertically(status, turn, i, j, len)) {
                    thisScore += constantSingleScores[len];
                }

                if(isDoubleHorizontally(status, turn, i, j, len)) {
                    thisScore += constantDoubleScores[len];
                } else if(isSingleHorizontally(status, turn, i, j, len)) {
                    thisScore += constantSingleScores[len];
                }

                if(isDoubleOnMainDiagonal(status, turn, i, j, len)) {
                    thisScore += constantDoubleScores[len];
                } else if(isSingleOnMainDiagonal(status, turn, i, j, len)) {
                    thisScore += constantSingleScores[len];
                }

                if(isDoubleOnSubDiagonal(status, turn, i, j, len)) {
                    thisScore += constantDoubleScores[len];
                } else if(isSingleOnSubDiagonal(status, turn, i, j, len)) {
                    thisScore += constantSingleScores[len];
                }

                if(thisScore > 0) {
                    score += thisScore;
                    break;
                }
            }

        }
    }

    return score;
}


function calcScore(status) {
    return calc(status, 'Computer') - calc(status, 'Player');
}
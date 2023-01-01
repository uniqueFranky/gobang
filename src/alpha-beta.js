
const continuousFive = 1000000;
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

    let ij = alpha_beta(status, 1, 3, -(10**9), 10**9);
    callback(ij[0], ij[1]);
}

function alpha_beta(status, curDep, maxDep, alpha, beta) {
    if(curDep === maxDep) {

        return calcScore(status);
    }
    let maxposi, maxposj;
    if(curDep % 2 === 0) { // Player's turn, min node
        for(let i = 0; i < 15; i++) {
            for(let j = 0; j < 15; j++) {
                if(status[i][j] === 'None') {
                    status[i][j] = 'Player';
                    let val = alpha_beta(status, curDep + 1, maxDep, -(10**11), alpha);
                    if(val < alpha) {
                        alpha = val;
                    }
                    status[i][j] = 'None';
                    if(alpha <= beta) {
                        // console.log("cut min alpha=" + alpha + " beta=" + beta);
                        return alpha;
                    }
                }
            }
        }
        return alpha;
    } else { // Computer's turn, max node
        for(let i = 0; i < 15; i++) {
            for(let j = 0; j < 15; j++) {
                if(status[i][j] === 'None') {
                    status[i][j] = 'Computer';
                    let val = alpha_beta(status, curDep + 1, maxDep, 10**11, alpha);
                    if(val > alpha) {
                        alpha = val;
                        maxposi = i;
                        maxposj = j;
                    }
                    status[i][j] = 'None';
                    if(alpha >= beta) {
                        // console.log("cut max alpha=" + alpha + " beta=" + beta);
                        return alpha;
                    }
                }
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

function havePiecesVertically(status, turn, x, y, len) {
    for(let i = 0; i < len; i++) {
        if(i + x >= 15 || status[i + x][y] !== turn) {
            return false;
        }
    }
    return true;
}

function havePiecesHorizontally(status, turn, x, y, len) {
    for(let j = 0; j < len; j++) {
        if(j + y >= 15 || status[x][j + y] !== turn) {
            return false;
        }
    }
    return true;
}

function havePiecesOnMainDiagonal(status, turn, x, y, len) {
    for(let k = 0; k < len; k++) {
        let xx = x + k;
        let yy = y + k;
        if(xx >= 15 || yy >= 15 || status[xx][yy] !== turn) {
            return false;
        }
    }
    return true;
}
function havePiecesOnSubDiagonal(status, turn, x, y, len) {
    for(let k = 0; k < len; k++) {
        let xx = x + k;
        let yy = y - k;
        if(xx >= 15 || yy < 0 || status[xx][yy] !== turn) {
            return false;
        }
    }
    return true;
}

function isDoubleVertically(status, x, y, len) {
    let x1 = x - 1;
    let x2 = x + len;
    if(x1 < 0 || x2 >= 15) {
        return false;
    }
    return status[x1][y] === 'None' && status[x2][y] === 'None';
}

function isSingleVertically(status, x, y, len) {
    let x1 = x - 1;
    let x2 = x + len;
    if(x1 >= 0 && status[x1][y] === 'None') {
        return true;
    }
    return x2 < 15 && status[x2][y] === 'None';

}

function isDoubleHorizontally(status, x, y, len) {
    let y1 = y - 1;
    let y2 = y + len;
    if(y1 < 0 || y2 >= 15) {
        return false;
    }
    return status[x][y1] === 'None' && status[x][y2] === 'None';
}

function isSingleHorizontally(status, x, y, len) {
    let y1 = y - 1;
    let y2 = y + len;
    if(y1 >= 0 && status[x][y1] === 'None') {
        return true;
    }
    return y2 < 15 && status[x][y2] === 'None';

}

function isDoubleOnMainDiagonal(status, x, y, len) {
    let x1 = x - 1;
    let y1 = y + 1;
    let x2 = x + len;
    let y2 = y - len;
    if(x1 < 0 || y1 >= 15 || x2 >= 15 || y2 < 0) {
        return false;
    }
    return status[x1][y1] === 'None' && status[x2][y2] === 'None';
}

function isSingleOnSubDiagonal(status, x, y, len) {
    let x1 = x - 1;
    let y1 = y + 1;
    let x2 = x + len;
    let y2 = y - len;
    if(x1 >= 0 && y1 < 15 && status[x1][y1] === 'None') {
        return true;
    }
    return x2 < 15 && y2 >= 0 && status[x2][y2] === 'None';

}

function isDoubleOnSubDiagonal(status, x, y, len) {
    let x1 = x - 1;
    let y1 = y - 1;
    let x2 = x + len;
    let y2 = y + len;
    if(x1 < 0 || y1 < 0 || x2 >= 15 || y2 >= 15) {
        return false;
    }
    return status[x1][y1] === 'None' && status[x2][y2] === 'None';
}

function isSingleOnMainDiagonal(status, x, y, len) {
    let x1 = x - 1;
    let y1 = y - 1;
    let x2 = x + len;
    let y2 = y + len;
    if(x1 >= 0 && y1 >= 0 && status[x1][y1] === 'None') {
        return true;
    }
    return x2 < 15 && y2 < 15 && status[x2][y2] === 'None';

}

function calc(status, turn) {
    let score = 0;
    for(let i = 0; i < 15; i++) {
        for(let j = 0; j < 15; j++) {
            for(let len = 5; len >= 1; len--) {
                let thisScore = 0;

                if(havePiecesVertically(status, turn, i, j, len)) {
                    if(isDoubleVertically(status, i, j, len)) {
                        thisScore += constantDoubleScores[len];
                    } else if(isSingleVertically(status, i, j, len)) {
                        thisScore += constantSingleScores[len];
                    }
                }

                if(havePiecesHorizontally(status, turn, i, j, len)) {
                    if(isDoubleHorizontally(status, i, j, len)) {
                        thisScore += constantDoubleScores[len];
                    } else if(isSingleHorizontally(status, i, j, len)) {
                        thisScore += constantSingleScores[len];
                    }
                }

                if(havePiecesOnMainDiagonal(status, turn, i, j, len)) {
                    if(isDoubleOnMainDiagonal(status, i, j, len)) {
                        thisScore += constantDoubleScores[len];
                    } else if(isSingleOnMainDiagonal(status, i, j, len)) {
                        thisScore += constantSingleScores[len];
                    }
                }

                if(havePiecesOnSubDiagonal(status, turn, i, j, len)) {
                    if(isDoubleOnSubDiagonal(status, i, j, len)) {
                        thisScore += constantDoubleScores[len];
                    } else if(isSingleOnSubDiagonal(status, i, j, len)) {
                        thisScore += constantSingleScores[len];
                    }
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


export function aiSolve(status, callback) {

    for(let i = 0; i < 15; i++) {
        for(let j = 0; j < 15; j++) {
            if(status[i][j] === 'None') {
                status[i][j] = 'Computer';
                let score = calc(status, 'Computer');
                status[i][j] = 'None';
                if(score >= 10 ** 10) {
                    callback(i, j);
                    return;
                }
            }
        }
    }

    let ij = alpha_beta(status, 1, 3, -(10**11), 10**11);
    callback(ij[0], ij[1]);
}

function alpha_beta(status, curDep, maxDep, alpha, beta) {
    // console.log("dep=" + curDep + " alpha=" + alpha + " beta=" + beta);
    if(curDep === maxDep) {
        // console.log("score=" + calcScore(status));
        return calcScore(status);
    }
    let maxposi, maxposj;
    if(curDep % 2 === 0) { // Player's turn, min node
        for(let i = 0; i < 15; i++) {
            for(let j = 0; j < 15; j++) {
                if(status[i][j] === 'None') {
                    status[i][j] = 'Player';
                    let val = alpha_beta(status, curDep + 1, maxDep, -(10**11), alpha);
                    alpha = alpha < val ? alpha : val;
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

function calc(status, turn) {
    let totScore = 0;
    let opp;
    if(turn === 'Player') {
        opp = 'Computer';
    } else {
        opp = 'Player';
    }

    for(let i = 0; i < 15; i++) {
        for(let j = 0; j < 11; j++) {
            let selfNum = 0, oppNum = 0;
            for(let k = j; k < j + 5; k++) {
                if(status[i][k] === turn) {
                    selfNum++;
                } else if(status[i][k] === opp) {
                    oppNum++;
                }
            }
            if(oppNum === 0) {
                totScore += 10 ** (selfNum === 5 ? 8 : selfNum);
            }
        }
    }

    for(let j = 0; j < 15; j++) {
        for(let i = 0; i < 11; i++) {
            let selfNum = 0, oppNum = 0;
            for(let k = i; k < i + 5; k++) {
                if(status[k][j] === turn) {
                    selfNum++;
                } else if(status[k][j] === opp) {
                    oppNum++;
                }
            }
            if(oppNum === 0) {
                totScore += 10 ** (selfNum === 5 ? 8 : selfNum);
            }
        }
    }

    for(let dec = 10; dec > -1; dec--) {
        for(let i = dec; i < 11; i++) {
            let selfNum = 0, oppNum = 0;
            for(let k = 0; k < 5; k++) {
                if(status[i + k][i - dec + k] === turn) {
                    selfNum++;
                } else if(status[i + k][i - dec + k] === opp) {
                    oppNum++;
                }
            }
            if(oppNum === 0) {
                totScore += 10 ** (selfNum === 5 ? 8 : selfNum);
            }
        }
        if(dec > 0) {
            for(let j = dec; j < 11; j++) {
                let selfNum = 0, oppNum = 0;
                for(let k = 0; k < 5; k++) {
                    if(status[j - dec + k][j + k] === turn) {
                        selfNum++;
                    } else if(status[j - dec + k][j + k]=== opp) {
                        oppNum++;
                    }
                }
                if(oppNum === 0) {
                    totScore += 10 ** (selfNum === 5 ? 8 : selfNum);
                }
            }
        }
    }

    for(let sum = 4; sum < 15; sum++) {
        for(let i = 4; i <= sum; i++) {
            let selfNum = 0, oppNum = 0;
            for(let k = 0; k < 5; k++) {
                if(status[i - k][sum - i + k] === turn) {
                    selfNum++;
                } else if(status[i - k][sum - i + k] === opp) {
                    oppNum++;
                }
            }
            if(oppNum === 0) {
                totScore += 10 ** (selfNum === 5 ? 8 : selfNum);
            }
        }
    }
    for(let sum = 15; sum < 25; sum++) {
        for(let j = sum - 14; j < 11; j++) {
            let selfNum = 0, oppNum = 0;
            for(let k = 0; k < 5; k++) {
                if(status[sum - j - k][j + k] === turn) {
                    selfNum++;
                } else if(status[sum - j - k][j + k] === opp) {
                    oppNum++;
                }
            }
            if(oppNum === 0) {
                totScore += 10 ** (selfNum === 5 ? 8 : selfNum);
            }
        }
    }

    return totScore;
}


function calcScore(status) {
    return calc(status, 'Computer') - calc(status, 'Player');
}
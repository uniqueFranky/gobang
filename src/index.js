import React from 'react';
import ReactDOM from 'react-dom/client';
import boardImg from './images/board.jpg';
import blackImg from './images/black.png';
import whiteImg from './images/white.png';
import {aiSolve} from "./transport";
import {Dna} from  'react-loader-spinner'
import {ColorRing} from  'react-loader-spinner'
import {calculateHash} from "./hash";
import {Button} from "react-bootstrap";
import './index.css'

class Cell extends React.Component {

    render() {
        const i = this.props.rowId;
        const j = this.props.colId;
        let pieceStyle = {
            position: 'absolute',
            top: (37.5 + i * 48 - 15).toString() + 'px',
            left: (37 + j * 49 - 12.5).toString() + 'px',
            height: '50px',
            width: '50px'
        };
        if(j <= 1) {
            pieceStyle["left"] = (37 + j * 49 - 14).toString() + 'px';
        } else if(j <= 3) {
            pieceStyle["left"] = (37 + j * 49 - 17).toString() + 'px';
        } else if(j >= 11) {
            pieceStyle["left"] = (37 + j * 49 - 9).toString() + 'px';
        } else {
            pieceStyle["left"] = (37 + j * 49 - 12).toString() + 'px';
        }

        if(i <= 7) {
            pieceStyle["top"] = (37.5 + i * 48 - 17).toString() + 'px';
        } else {
            pieceStyle["top"] = (37.5 + i * 48 - 19).toString() + 'px';
        }

        let bgStyle = {
            position: 'absolute',
            width: '52.5px',
            height: '52.5px',
            top: (parseFloat(pieceStyle.top) - 1.25).toString() + 'px',
            left: (parseFloat(pieceStyle.left) - 1.25).toString() + 'px',
            display: 'none',
            backgroundColor: '#FF0000',
            borderRadius: '50%'
        }
        if(this.props.isLast) {
            console.log(i, ' ', j, ' is last')
            bgStyle.display = 'inline'
        } else {
            bgStyle.display = 'none'
        }
        if(this.props.selector === 0) {
            return <area onClick={() => this.onclick()} shape={'circle'} coords={(37.5 + j * 49) + ',' + (37.5 + i * 48) + ',12'} alt={'map'}/>;
        } else if(this.props.selector === this.props.firstPlayer) {
            return (
              <span className={'piece'}>
                  <div className={'pieceBg'} style={bgStyle} />
                  <img className={'pieceImg'} src={blackImg} alt={'black'} style={pieceStyle} />
              </span>
            );
        } else {
            return (
                <span className={'piece'}>
                    <div className={'pieceBg'} style={bgStyle} />
                    <img className={'pieceImg'} src={whiteImg} alt={'white'} style={pieceStyle} />
              </span>
            );
        }
    }
    onclick() {
        const i = this.props.rowId;
        const j = this.props.colId;
        this.props.didClick(i, j);
    }
}

class Board extends React.Component {

    didClick(i, j) {
        this.props.didClick(i, j);
    }

    constructor(props) {
        super(props);
        this.didClick = this.didClick.bind(this);
    }

    render() {

        let areas = new Array(15 * 15);
        let pieces = new Array(15 * 15);
        for(let i = 0; i < 15; i++) {
            for(let j = 0; j < 15; j++) {
                if(this.props.status[i][j] === 0) {
                    areas[i * 15 + j] = <Cell key={(i * 15 + j).toString()} rowId={i} colId={j} selector={this.props.status[i][j]} didClick={this.didClick} />;
                } else {
                    if(this.props.lastPos[0] === i && this.props.lastPos[1] === j) {
                        pieces[i * 15 + j] = <Cell key={(i * 15 + j).toString()} rowId={i} colId={j} selector={this.props.status[i][j]} didClick={this.didClick} isLast={true} firstPlayer={this.props.firstPlayer} />;
                    } else {
                        pieces[i * 15 + j] = <Cell key={(i * 15 + j).toString()} rowId={i} colId={j} selector={this.props.status[i][j]} didClick={this.didClick} isLast={false} firstPlayer={this.props.firstPlayer}/>;
                    }
                }
            }
        }
        const piecesStyle = {
            position: 'absolute',
            top: '0',
            left: '0'
        };
        return (
            <div className={'board'}>
                <img width={768} height={746.25} src={boardImg} alt={'board'} useMap={'#boardMap'} />
                <div className={'pieces'} style={piecesStyle}>
                    {pieces}
                </div>
                <map name={'boardMap'}>
                    {areas}
                </map>
            </div>
        );
    }
}

class Info extends React.Component {

    render() {
        const infoStyle = {
            position: 'absolute',
            left: '780px',
            top: '0'
        }

        const len = this.props.historyLen;
        let history = String();
        for(let i = 0; i < len; i++) {
            const his = this.props.history[i];
            const playerName = ['none', 'AI', "???"]
            history += 'Step ' + (i + 1).toString() + ': ' + playerName[his[0]] + '??????' + his[1] + ', ' + his[2] + '?????????\n'
        }
        if(this.props.nextPlayer === 2) {
            return (
                <div className={'info'} style={infoStyle}>
                    <h1>?????????????????????</h1>
                    <h3>AI??????????????????{this.props.aiTime / 1000}s</h3>
                    <Dna
                        height="100"
                        width="100"
                        color='white'
                        ariaLabel='loading'
                    />
                    <Button variant="contained" className={'button'} onClick={() => {
                        alert(history);
                    }}>
                        <span>??????????????????</span>
                    </Button>
                </div>
            )
        } else {
            return (
                <div className={'info'} style={infoStyle}>
                    <h1>?????????AI?????????</h1>
                    <h3>AI??????????????????</h3>
                    <ColorRing
                        height="100"
                        width="100"
                        color='grey'
                        ariaLabel='loading'
                    />
                    <Button variant="contained" className={'button'} onClick={() => {
                        alert(history);
                    }}>
                        <span>??????????????????</span>
                    </Button>
                </div>
            )
        }

    }
}


class Game extends React.Component {

    restartGame(firstPlayer) {
        let stat = new Array(15);
        for(let i = 0; i < 15; i++) {
            stat[i] = new Array(15).fill(0);
        }
        this.setState({
            status: stat,
            nextPlayer: 2,
            history: new Array(15 * 15),
            historyLen: 0,
            aiTime: 'NA',
            stepCnt: 0,
            lastPos: [20, 20],
            firstPlayer: firstPlayer
        });
        if(firstPlayer === 1) {
            this.setState({
                nextPlayer: 1,
                lastPos: [7, 7]
            });
            setTimeout(() => {
                this.aiCallback(7, 7, 0)
            }, 500)
        }
    }

    constructor(props) {
        super(props);
        let stat = new Array(15);
        for(let i = 0; i < 15; i++) {
            stat[i] = new Array(15).fill(0);
        }
        this.state = {
            status: stat,
            nextPlayer: 1,
            history: new Array(15 * 15),
            historyLen: 0,
            aiTime: 'NA',
            stepCnt: 0,
            lastPos: [7, 7],
            firstPlayer: 0
        }

        this.restartGame = this.restartGame.bind(this);
        this.didClick = this.didClick.bind(this);
        this.aiCallback = this.aiCallback.bind(this);

    }

    didClick(i, j) {
        console.log(i, j);
        if(this.state.nextPlayer === 2) {
            if(this.state.status[i][j] === 0) {
                let newStatus = this.state.status.slice();
                newStatus[i][j] = 2;
                let newHistory = this.state.history.slice();
                newHistory[this.state.historyLen] = [2, i, j];
                this.setState({
                    status: newStatus,
                    nextPlayer: 1,
                    history: newHistory,
                    historyLen: this.state.historyLen + 1,
                    stepCnt: this.state.stepCnt + 1,
                    lastPos: [i, j]
                });
                setTimeout(() => aiSolve(this.state.status, this.aiCallback, calculateHash(this.state.status), this.state.stepCnt), 1000);
            } else {
                alert("????????????????????????");
            }
        } else {
            alert("?????????AI?????????");
        }
    }

    aiCallback(i, j, tim) {
        let newStatus = this.state.status.slice();
        newStatus[i][j] = 1;
        let newHistory = this.state.history.slice();
        newHistory[this.state.historyLen] = [1, i, j];
        this.setState({
            status: newStatus,
            nextPlayer: 2,
            history: newHistory,
            historyLen: this.state.historyLen + 1,
            aiTime: tim,
            stepCnt: this.state.stepCnt + 1,
            lastPos: [i, j]
        });
    }

    checkWinner() {
        for(let i = 0; i < 15; i++) {
            for(let j = 0; j < 11; j++) {
                let playerNum = 0, computerNum = 0;
                for(let k = j; k < j + 5; k++) {
                    if(this.state.status[i][k] === 1) {
                        computerNum++;
                    } else if(this.state.status[i][k] === 2) {
                        playerNum++;
                    }
                }
                if(computerNum === 5) {
                    return 1;
                } else if(playerNum === 5) {
                    return 2;
                }
            }
        }

        for(let j = 0; j < 15; j++) {
            for(let i = 0; i < 11; i++) {
                let playerNum = 0, computerNum = 0;
                for(let k = i; k < i + 5; k++) {
                    if(this.state.status[k][j] === 1) {
                        computerNum++;
                    } else if(this.state.status[k][j] === 2) {
                        playerNum++;
                    }
                }
                if(computerNum === 5) {
                    return 1;
                } else if(playerNum === 5) {
                    return 2;
                }
            }
        }

        for(let dec = 10; dec > -1; dec--) {
            for(let i = dec; i < 11; i++) {
                let playerNum = 0, computerNum = 0;
                for(let k = 0; k < 5; k++) {
                    if(this.state.status[i + k][i - dec + k] === 1) {
                        computerNum++;
                    } else if(this.state.status[i + k][i - dec + k] === 2) {
                        playerNum++;
                    }
                }
                if(computerNum === 5) {
                    return 1;
                } else if(playerNum === 5) {
                    return 2;
                }
            }
            if(dec > 0) {
                for(let j = dec; j < 11; j++) {
                    let playerNum = 0, computerNum = 0;
                    for(let k = 0; k < 5; k++) {
                        if(this.state.status[j - dec + k][j + k] === 1) {
                            computerNum++;
                        } else if(this.state.status[j - dec + k][j + k]=== 2) {
                            playerNum++;
                        }
                    }
                    if(computerNum === 5) {
                        return 1;
                    } else if(playerNum === 5) {
                        return 2;
                    }
                }
            }
        }


        for(let sum = 4; sum < 15; sum++) {
            for(let i = 4; i <= sum; i++) {
                let playerNum = 0, computerNum = 0;
                for(let k = 0; k < 5; k++) {
                    if(this.state.status[i - k][sum - i + k] === 1) {
                        computerNum++;
                    } else if(this.state.status[i - k][sum - i + k] === 2) {
                        playerNum++;
                    }
                }
                if(computerNum === 5) {
                    return 1;
                } else if(playerNum === 5) {
                    return 2;
                }
            }
        }
        for(let sum = 15; sum < 25; sum++) {
            for(let j = sum - 14; j < 11; j++) {
                let playerNum = 0, computerNum = 0;
                for(let k = 0; k < 5; k++) {
                    if(this.state.status[sum - j - k][j + k] === 1) {
                        computerNum++;
                    } else if(this.state.status[sum - j - k][j + k] === 2) {
                        playerNum++;
                    }
                }
                if(computerNum === 5) {
                    return 1;
                } else if(playerNum === 5) {
                    return 2;
                }
            }
        }

        let tie = true
        for(let i = 0; i < 15; i++) {
            for(let j = 0; j < 15; j++) {
                if(this.state.status[i][j] === 0) {
                    tie = false;
                    break;
                }
                if(!tie) {
                    break;
                }
            }
        }
        if(tie) {
            return -1;
        }
        return 0;
    }

    render() {
        if(this.state.firstPlayer !== 0) { // who to be the first to play is decided
            console.log(JSON.stringify(this.state.status))
            let winner = this.checkWinner();
            if(winner === 1) {
                winner = 'AI'
            } else if(winner === 2) {
                winner = '???'
            } else if(winner === -1) {
                winner = 'no one'
            }
            if(winner !== 0) {
                setTimeout(() => {
                    alert(winner + " wins!");
                    this.setState({
                        firstPlayer: 0
                    })
                }, 500);

            }
            return (
                <div className={'game'}>
                    <Board didClick={this.didClick} status={this.state.status} lastPos={this.state.lastPos} firstPlayer={this.state.firstPlayer}/>
                    <Info nextPlayer={this.state.nextPlayer} history={this.state.history} historyLen={this.state.historyLen}
                          aiTime={this.state.aiTime} />
                </div>
            );
        } else {
            return (
                <div className={'selector'}>
                    <Button variant="contained" className={'button'} onClick={() => {
                        this.restartGame(2)
                    }}>
                        <span>?????????</span>
                    </Button>
                    <Button variant="contained" className={'button'} onClick={() => {
                        this.restartGame(1)
                    }}>
                        <span>AI??????</span>
                    </Button>
                </div>
            );
        }

    }
}


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <Game />
);



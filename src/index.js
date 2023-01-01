import React from 'react';
import ReactDOM from 'react-dom/client';
import boardImg from './images/board.jpg';
import blackImg from './images/black.png';
import whiteImg from './images/white.png';
import {aiSolve} from "./transport";


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
            pieceStyle["left"] = (37 + j * 49 - 12  ).toString() + 'px';
        }

        if(i <= 7) {
            pieceStyle["top"] = (37.5 + i * 48 - 17).toString() + 'px';
        } else {
            pieceStyle["top"] = (37.5 + i * 48 - 19).toString() + 'px';
        }
        if(this.props.selector === 0) {
            return <area onClick={() => this.onclick()} shape={'circle'} coords={(37.5 + j * 49) + ',' + (37.5 + i * 48) + ',12'} alt={'map'}/>;
        } else if(this.props.selector === 2) {
            return <img className={'piece'} src={blackImg} alt={'black'} style={pieceStyle}/>;
        } else {
            return <img className={'piece'} src={whiteImg} alt={'white'} style={pieceStyle}/>;
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
                   pieces[i * 15 + j] = <Cell key={(i * 15 + j).toString()} rowId={i} colId={j} selector={this.props.status[i][j]} didClick={this.didClick} />;
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
        const historyStyle = {
            overflow: 'auto',
            height: '500px'
        }
        const len = this.props.historyLen;
        let history = new Array(len);
        for(let i = 0; i < len; i++) {
            const his = this.props.history[i];
            history[i] = <div key={i} className={'step'}><p>{his[0] + '在（' + his[1] + ', ' + his[2] + '）落子'}</p></div>
        }
        if(this.props.nextPlayer === 2) {
            return (
                <div className={'info'} style={infoStyle}>
                    <h1>现在是{this.props.nextPlayer}的回合</h1>
                    <h3>AI上一步用时：{this.props.aiTime}ms</h3>
                    <div className={'histories'} style={historyStyle}>
                        {history}
                    </div>
                </div>
            )
        } else {
            return (
                <div className={'info'} style={infoStyle}>
                    <h1>现在是{this.props.nextPlayer}的回合</h1>
                    <h3>AI正在思考中…</h3>
                    <div className={'histories'} style={historyStyle}>
                        {history}
                    </div>
                </div>
            )
        }

    }
}


class Game extends React.Component {


    constructor(props) {
        super(props);
        let stat = new Array(15);
        for(let i = 0; i < 15; i++) {
            stat[i] = new Array(15).fill(0);
        }
        this.state = {
            status: stat,
            nextPlayer: 2,
            history: new Array(15 * 15),
            historyLen: 0,
            aiTime: 'NA'
        };
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
                    historyLen: this.state.historyLen + 1
                });
                setTimeout(() => aiSolve(this.state.status, this.aiCallback), 1000);
            } else {
                alert("该格已被下过棋子");
            }
        } else {
            alert("现在是AI的回合");
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
            aiTime: tim
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


        return 0;
    }

    render() {
        console.log(JSON.stringify(this.state.status))
        let winner = this.checkWinner();
        if(winner !== 0) {
            setTimeout(() => {
                alert(winner + " wins!");
                let stat = new Array(15);
                for(let i = 0; i < 15; i++) {
                    stat[i] = new Array(15).fill(0);
                }
                this.setState({
                    status: stat,
                    nextPlayer: 2,
                    history: new Array(15 * 15),
                    historyLen: 0
                });
            }, 500);

        }
        return (
            <div className={'game'}>
                <Board didClick={this.didClick} status={this.state.status} />
                <Info nextPlayer={this.state.nextPlayer} history={this.state.history} historyLen={this.state.historyLen}
                      aiTime={this.state.aiTime} />
            </div>
        );
    }
}


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <Game />
);



import React from 'react';
import ReactDOM from 'react-dom/client';
import boardImg from './images/board.jpg';
import blackImg from './images/black.png';
import whiteImg from './images/white.png';


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
            pieceStyle["left"] = (37 + j * 49 - 15).toString() + 'px';
        } else if(j >= 11) {
            pieceStyle["left"] = (37 + j * 49 - 9).toString() + 'px';
        } else {
            pieceStyle["left"] = (37 + j * 49 - 12  ).toString() + 'px';
        }

        if(i <= 7) {
            pieceStyle["top"] = (37.5 + i * 48 - 17).toString() + 'px';
        }
        if(this.props.selector === 'None') {
            return <area onClick={() => this.onclick()} shape={'circle'} coords={(37.5 + j * 49) + ',' + (37.5 + i * 48) + ',10'} alt={'map'}/>;
        } else if(this.props.selector === 'Player') {
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
                if(this.props.status[i][j] === 'None') {
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

class Game extends React.Component {
    constructor(props) {
        super(props);
        let stat = new Array(15);
        for(let i = 0; i < 15; i++) {
            stat[i] = new Array(15).fill('None');
        }
        this.state = {
            status: stat,
            nextPlayer: 'Player',
        };
        this.didClick = this.didClick.bind(this);
    }

    didClick(i, j) {
        console.log(i, j);
        if(this.state.status[i][j] === 'None') {
            let newStatus = this.state.status.slice();
            newStatus[i][j] = this.state.nextPlayer;
            this.setState({
                status: newStatus,
                nextPlayer: this.state.nextPlayer === 'Player' ? 'Computer' : 'Player'
            });
        }
    }

    render() {
        console.log(this.state.status);
        return <Board didClick={this.didClick} status={this.state.status}/>;
    }
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <Game />
);



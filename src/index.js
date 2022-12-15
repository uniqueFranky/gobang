import React from 'react';
import ReactDOM from 'react-dom/client';
import boardImg from './images/board.jpg';

class Cell extends React.Component {
    render() {
        const i = this.props.rowId;
        const j = this.props.colId;
        return <area onClick={() => this.onclick()} shape={'circle'} coords={(37.5 + j * 49) + ',' + (37.5 + i * 48) + ',10'} />;
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
        for(let i = 0; i < 15; i++) {
            for(let j = 0; j < 15; j++) {
                areas[i * 15 + j] = <Cell key={(i * 15 + j).toString()} rowId={i} colId={j} didClick={this.didClick} />;
            }
        }
        console.log(areas);
        return (
            <div className={'board'}>
                <img width={768} height={746.25} src={boardImg} alt={'board'} useMap={'#boardMap'}/>
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
            status: this.stat,
            nextPlayer: 'Player',
        };
        this.didClick = this.didClick.bind(this);
    }

    didClick(i, j) {
        console.log(i, j);
    }

    render() {
        return <Board didClick={this.didClick}/>;
    }
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <Game />
);



import React from 'react';
import { v4 as uuidv4 } from 'uuid';
import "./Game.css";

export default (props) => {
    const { board, movieHandler } = props;
    let cols = [];

    for (let i = 0; i < board.length; i++) {
        let row = []
        for (let j = 0; j < board[i].length; j++) {
            let val = board[i][j].val //(board[i][j].isOpen && board[i][j].val > 0 ? board[i][j].val : "");
            const cell = board[i][j];
            const classes = [];
            if (cell.isOpen) {
                classes.push("open");
                if (cell.val === -1) {
                    classes.push("bomb");
                }
            } else {
                classes.push("close");
            }
            if (cell.isMarked && !cell.isOpen) {
                classes.push("mark");
            }
            row.push(<span
                onMouseDown={e => movieHandler(i, j, e)}
                className={`cell ${classes.join(' ')}`}
                key={uuidv4()}>{val}</span>)
        }
        cols.push(row);
    }

    return (
        <div className="h-100 d-flex justify-content-center align-items-center">
            <div id='board'>
                {cols.map(row => <div className="row" key={uuidv4()}>{row}</div>)}
            </div>
        </div>

    );

}


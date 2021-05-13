import React, { useState } from 'react';
import DifficultySelector from './difficultySelector';
import Board from './board';
import { generateBoard } from '../../utils/boardUtils';
import Timer from './timer';
import axios from "axios";

import AuthService from '../../services/auth.service';
import UserService from '../../services/user.service';
import { Redirect } from 'react-router-dom'

export default () => {
    const [gameData, setGameData] = useState({
        difficulty: null,
        board: undefined,
        gameOver: false
    });
    const [user, setUser] = useState(AuthService.getCurrentUser().username);
    const [userStat, setUserStat] = useState({
        nGames: {
            easy: 0,
            medium: 0,
            hard: 0
        },
        nWins: {
            easy: 0,
            medium: 0,
            hard: 0
        },
        bests: {
            easy: null,
            medium: null,
            hard: null
        }
    });

    const selectDifficulty = (diff) => {
        let rows;
        let cols;
        let mines;
        switch (diff) {
            case 'easy':
                rows = 9;
                cols = 9;
                mines = 10;
                break;
            case 'medium':
                rows = 16;
                cols = 16;
                mines = 40;
                break;
            case 'hard':
                rows = 16;
                cols = 30;
                mines = 99;
                break;
        }

        setGameData({ ...gameData, difficulty: diff, board: generateBoard(rows, cols, mines), remaining: rows * cols - mines });
        console.log(`http://localhost:8080/api/userdata?name=${user}`)
        axios.get(`http://localhost:8080/api/userdata?name=${user}`).then(data => {
            setUserStat(data.data);
        });
    };

    const cascade = (board, row, col) => {
        if (row < 0 || col < 0 || row >= board.length || col >= board[0].length) {
            return board;
        }
        if (board[row][col].val === 0 && !board[row][col].isOpen) {
            board[row][col].isOpen = true;
            board = cascade(board, row - 1, col - 1);
            board = cascade(board, row + 1, col - 1);
            board = cascade(board, row - 1, col + 1);
            board = cascade(board, row + 1, col + 1);
            board = cascade(board, row - 1, col);
            board = cascade(board, row + 1, col);
            board = cascade(board, row, col - 1);
            board = cascade(board, row, col + 1);
            return board;
        } else if (board[row][col].val > 0) {
            board[row][col].isOpen = true;
            return board;
        }
        return board;
    }

    const movieHandler = (row, col, e) => {
        e.preventDefault();
        if (gameData.board[row][col].isOpen || gameData.gameOver) return;
        let newBoard = undefined;
        if (e.button === 0 && !gameData.board[row][col].isMarked) {
            let isGameOver = false;
            if (gameData.board[row][col].val === -1) {
                newBoard = gameData.board.map(row => row.map(cell => {
                    cell.isOpen = true;
                    return cell;
                }));
                isGameOver = true;
            } else if (gameData.board[row][col].val === 0) {
                newBoard = cascade(gameData.board.map(row => [...row]), row, col)
            } else {
                newBoard = gameData.board.map(row => [...row]);
            }

            newBoard[row][col].isOpen = true;

            let r = gameData.remaining;
            if (gameData.board[row][col].val !== -1) {
                r = 0;
                newBoard.forEach(row => {
                    row.forEach(cell => {
                        if (!cell.isOpen && cell.val !== -1) {
                            r += 1;
                        }
                    });
                });
                if (r === 0) {
                    isGameOver = true;
                }
            }

            setGameData({ ...gameData, board: newBoard, gameOver: isGameOver, remaining: r });
        } else if (e.button === 1 && !gameData.board[row][col].isOpen) {
            newBoard = gameData.board.map(row => [...row]);
            newBoard[row][col].isMarked = !newBoard[row][col].isMarked;
            setGameData({ ...gameData, board: newBoard });
        }
    }

    const submitResults = (time) => {
        if (gameData.remaining === 0 && gameData.gameOver) {
            UserService.submitResult(user, gameData.difficulty, time, true);
        } else {
            UserService.submitResult(user, gameData.difficulty, time, false);
        }
    }

    if (!user) {
        return <Redirect to='/login' />;
    }
    return (
        <div className="container">
            {gameData.difficulty ?
                <>
                    <table className="table">
                        <tr>
                            <th></th>
                            <th>Easy</th>
                            <th>Medium</th>
                            <th>Hard</th>
                        </tr>
                        <tr>
                            <th>Won</th>
                            <td>{userStat.nWins.easy}</td>
                            <td>{userStat.nWins.medium}</td>
                            <td>{userStat.nWins.hard}</td>
                        </tr>
                        <tr>
                            <th>Lost</th>
                            <td>{userStat.nGames.easy - userStat.nWins.easy}</td>
                            <td>{userStat.nGames.medium - userStat.nWins.medium}</td>
                            <td>{userStat.nGames.hard - userStat.nWins.hard}</td>
                        </tr>
                        <tr>
                            <th>Total</th>
                            <td>{userStat.nGames.easy}</td>
                            <td>{userStat.nGames.medium}</td>
                            <td>{userStat.nGames.hard}</td>
                        </tr>
                        <tr>
                            <th>Best result</th>
                            <td>{userStat.bests.easy}</td>
                            <td>{userStat.bests.medium}</td>
                            <td>{userStat.bests.hard}</td>
                        </tr>
                    </table>
                    <Timer submitResults={submitResults} gameOver={gameData.gameOver} />
                    <Board movieHandler={movieHandler} board={gameData.board} />
                </>

                : <DifficultySelector onSelect={selectDifficulty} />}
        </div>
    )
}
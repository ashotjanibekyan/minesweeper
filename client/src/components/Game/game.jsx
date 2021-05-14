import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Redirect } from 'react-router-dom';
import DifficultySelector from './difficultySelector';
import Board from './board';
import {
  generateBoard,
  getSettings,
  getNeighbors,
  cascade,
} from '../../utils/boardUtils';
import Timer from './timer';

import AuthService from '../../services/auth.service';
import UserService from '../../services/user.service';

import UserResults from './userResults';
import GameOverModal from './gameOverModal';

const initialState = {
  gameData: {
    difficulty: null,
    board: undefined,
    gameOver: false,
    remaining: 0,
    readyForSubmit: true,
  },
  userStat: {
    nGames: {
      easy: 0,
      medium: 0,
      hard: 0,
    },
    nWins: {
      easy: 0,
      medium: 0,
      hard: 0,
    },
    bests: {
      easy: null,
      medium: null,
      hard: null,
    },
  },
};

const Game = () => {
  const [gameData, setGameData] = useState(initialState.gameData);
  const [user] = useState(
    AuthService.getCurrentUser() ? AuthService.getCurrentUser().username : null
  );
  const [userStat, setUserStat] = useState(initialState.userStat);
  const [startTime, setStartTime] = useState(0);

  const selectDifficulty = (diff) => {
    const [rows, cols, mines] = getSettings(diff);
    setGameData({
      ...initialState.gameData,
      difficulty: diff,
      board: generateBoard(rows, cols, mines),
      remaining: rows * cols - mines,
    });
    setStartTime(new Date());
    axios
      .get(`http://localhost:8080/api/userdata?name=${user}`)
      .then((data) => {
        setUserStat(data.data);
      });
  };

  const movieHandler = (row, col, e) => {
    e.preventDefault();
    if (
      (gameData.board[row][col].isOpen && e.button !== 1) ||
      gameData.gameOver
    )
      return;
    let newBoard;
    if (e.button === 0 && !gameData.board[row][col].isMarked) {
      let isGameOver = false;
      if (gameData.board[row][col].val === -1) {
        newBoard = gameData.board.map((el) =>
          el.map((cell) => {
            cell.isOpen = true;
            return cell;
          })
        );
        isGameOver = true;
      } else if (gameData.board[row][col].val === 0) {
        newBoard = cascade(
          gameData.board.map((el) => [...el]),
          row,
          col
        );
      } else {
        newBoard = gameData.board.map((el) => [...el]);
      }

      newBoard[row][col].isOpen = true;

      let r = gameData.remaining;
      if (gameData.board[row][col].val !== -1) {
        r = 0;
        newBoard.forEach((el) => {
          el.forEach((cell) => {
            if (!cell.isOpen && cell.val !== -1) {
              r += 1;
            }
          });
        });
        if (r === 0) {
          isGameOver = true;
        }
      }

      setGameData({
        ...gameData,
        board: newBoard,
        gameOver: isGameOver,
        remaining: r,
      });
    } else if (
      e.button === 1 &&
      gameData.board[row][col].isOpen &&
      gameData.board[row][col].val > 0
    ) {
      const neighbors = getNeighbors(gameData.board, row, col);
      console.log(neighbors);
      const nMarked = neighbors.reduce((accumulator, [r, c]) => {
        if (gameData.board[r][c].isMarked) {
          console.log(r, c);
          return accumulator + 1;
        }
        return accumulator;
      }, 0);
      console.log(`nMarked, ${nMarked}`);
      console.log(
        `gameData.board[row][col].val, ${gameData.board[row][col].val}`
      );
      if (nMarked === gameData.board[row][col].val) {
        neighbors.forEach(([r, c]) => {
          if (!gameData.board[r][c].isMarked && !gameData.board[r][c].isOpen) {
            movieHandler(r, c, { button: 0, preventDefault: () => {} }); // make a fake left click event
          }
        });
      }
      // TODO : implement middle click effect
    } else if (e.button === 2 && !gameData.board[row][col].isOpen) {
      newBoard = gameData.board.map((el) => [...el]);
      newBoard[row][col].isMarked = !newBoard[row][col].isMarked;
      setGameData({ ...gameData, board: newBoard });
    }
  };

  const submitResults = (time) => {
    if (
      gameData.readyForSubmit &&
      gameData.remaining === 0 &&
      gameData.gameOver
    ) {
      UserService.submitResult(user, gameData.difficulty, time, true);
      setGameData({ ...gameData, readyForSubmit: false });
    } else if (
      gameData.readyForSubmit &&
      gameData.remaining > 0 &&
      gameData.gameOver
    ) {
      UserService.submitResult(user, gameData.difficulty, time, false);
      setGameData({ ...gameData, readyForSubmit: false });
    }
  };

  useEffect(() => {
    submitResults(Math.round((new Date() - startTime) / 1000));
  }, [gameData.gameOver]);

  if (!user) {
    return <Redirect to="/login" />;
  }

  return (
    <div className="container justify-content-center align-items-center">
      {gameData.difficulty ? (
        <>
          <UserResults userStat={userStat} />
          <Timer gameOver={gameData.gameOver} startTime={startTime} />
          <p className="text-center">Use middle click to mark mines</p>
          <Board
            movieHandler={movieHandler}
            restart={selectDifficulty}
            difficulty={gameData.difficulty}
            board={gameData.board}
          />
        </>
      ) : (
        <>
          <header className="jumbotron">
            <h1>{`Hello, general ${user}!`}</h1>
          </header>
          <DifficultySelector onSelect={selectDifficulty} />
        </>
      )}
      <GameOverModal
        isOpen={gameData.gameOver}
        isWin={gameData.remaining === 0 && gameData.gameOver}
        difficulty={gameData.difficulty}
        restart={selectDifficulty}
      />
    </div>
  );
};
export default Game;

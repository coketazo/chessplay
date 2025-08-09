import { useState, useEffect } from "react";
import { Chessboard } from "react-chessboard";
import { Chess } from "chess.js";

function ChessBoard() {
  // new Chess()로 새 게임 인스턴스를 만들고, 이걸 state로 관리합니다.
  const [game, setGame] = useState(new Chess());
  // 현재 게임 진행 상황 (턴)
  const [status, setStatus] = useState("");
  // 보드가 보이는 방향
  const [boardOrientation, setBoardOrientation] = useState("white");
  // 이동 가능한 타일 하이라이트
  const [movableSquares, setMovableSquares] = useState({});

  // 3. useEffect를 사용해 'game' state가 변할 때마다 실행될 코드를 작성합니다.
  useEffect(() => {
    function updateStatus() {
      let newStatus = "";
      const turn = game.turn() === "w" ? "백" : "흑";

      if (game.isCheckmate()) {
        newStatus = `체크메이트! ${turn === "백" ? "흑" : "백"}의 승리!`;
      } else if (game.isStalemate()) {
        newStatus = "스테일메이트! 무승부입니다.";
      } else if (game.isDraw()) {
        newStatus = "규칙에 따른 무승부입니다.";
      } else if (game.isCheck()) {
        newStatus = `체크! ${turn}의 차례입니다.`;
      } else {
        newStatus = `${turn}의 차례입니다.`;
      }
      setStatus(newStatus);
    }

    updateStatus();
  }, [game]); // 이 배열 안에 'game'을 넣어주면, game state가 바뀔 때만 useEffect가 실행됩니다.

  function makeAMove(move) {
    const gameCopy = new Chess();
    gameCopy.loadPgn(game.pgn());
    const result = gameCopy.move(move);
    setGame(gameCopy);
    setMovableSquares({});
    return result;
  }

  function onDrop(sourceSquare, targetSquare) {
    const move = makeAMove({
      from: sourceSquare,
      to: targetSquare,
      promotion: "q",
    });

    if (move === null) return false;
    return true;
  }

  function resetGame() {
    // game state를 완전히 새로운 Chess() 인스턴스로 교체합니다.
    setGame(new Chess());
  }

  function flipBoard() {
    setBoardOrientation((currentOrientation) =>
      currentOrientation === "white" ? "black" : "white"
    );
  }

  function onSquareClick(square) {
    // 클릭한 칸에 있는 기물이 갈 수 있는 모든 수를 찾습니다.
    const moves = game.moves({
      square: square,
      verbose: true, // 'verbose: true'는 이동에 대한 자세한 정보를 줍니다.
    });

    // 해당 기물이 움직일 수 없는 경우, 하이라이트를 지웁니다.
    if (moves.length === 0) {
      setMovableSquares({});
      return;
    }

    // 움직일 수 있는 칸들을 스타일 객체로 만듭니다.
    const newMoveSquares = {};
    moves.forEach((move) => {
      // 움직일 수 있는 각 칸(move.to)에 스타일을 적용합니다.
      newMoveSquares[move.to] = {
        background: "rgba(0, 255, 0, 0.4)", // 반투명한 녹색 배경
        borderRadius: "50%",
      };
    });
    setMovableSquares(newMoveSquares); // state를 업데이트해서 하이라이트를 표시합니다.
  }

  return (
    <div style={{ width: "600px" }}>
      <Chessboard
        position={game.fen()}
        onPieceDrop={onDrop}
        boardOrientation={boardOrientation}
        onSquareClick={onSquareClick}
        customSquareStyles={movableSquares}
      />
      <h3>{status}</h3>
      <button className="reset-button" onClick={resetGame}>
        새 게임
      </button>
      <button className="reset-button" onClick={flipBoard}>
        판 뒤집기
      </button>
      <h3>기보 (PGN)</h3>
      <pre>{game.pgn()}</pre>
    </div>
  );
}

export default ChessBoard;

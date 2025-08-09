// frontend/src/App.jsx

import "./App.css";
import ChessBoard from "./ChessBoard.jsx";

function App() {
  return (
    <div className="app-container">
      <h1>리액트 체스 게임</h1>
      <ChessBoard />
    </div>
  );
}

export default App;

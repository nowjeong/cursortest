import React, { useState, useCallback } from 'react';
import MainMenu from './components/MainMenu';
import GamePlay from './components/GamePlay';
import GameOver from './components/GameOver';
import { GameState, DifficultyLevel, GameStats } from './types';
import { DIFFICULTY_CONFIGS, loadSaveData, saveSaveData } from './utils';
import './styles.css';

const App: React.FC = () => {
  const [gameState, setGameState] = useState<GameState>('menu');
  const [selectedDifficulty, setSelectedDifficulty] = useState<DifficultyLevel>('beginner');
  const [gameStats, setGameStats] = useState<GameStats | null>(null);
  const [saveData, setSaveData] = useState(() => loadSaveData());

  // 게임 시작
  const handleStartGame = useCallback((difficulty: DifficultyLevel) => {
    setSelectedDifficulty(difficulty);
    setGameState('playing');
    setGameStats(null);
  }, []);

  // 게임 오버
  const handleGameOver = useCallback((stats: GameStats) => {
    setGameStats(stats);
    
    // 최고 점수 업데이트
    const currentHighScore = saveData.highScores[selectedDifficulty];
    if (stats.score > currentHighScore) {
      const newSaveData = {
        ...saveData,
        highScores: {
          ...saveData.highScores,
          [selectedDifficulty]: stats.score,
        },
      };
      setSaveData(newSaveData);
      saveSaveData(newSaveData);
    }
    
    setGameState('gameover');
  }, [selectedDifficulty, saveData]);

  // 재시작
  const handleRestart = useCallback(() => {
    setGameState('playing');
    setGameStats(null);
  }, []);

  // 메인 메뉴로
  const handleMainMenu = useCallback(() => {
    setGameState('menu');
    setGameStats(null);
  }, []);

  return (
    <div className="app">
      {gameState === 'menu' && (
        <MainMenu
          onStartGame={handleStartGame}
          highScores={saveData.highScores}
        />
      )}

      {gameState === 'playing' && (
        <GamePlay
          difficulty={DIFFICULTY_CONFIGS[selectedDifficulty]}
          onGameOver={handleGameOver}
        />
      )}

      {gameState === 'gameover' && gameStats && (
        <GameOver
          stats={gameStats}
          difficulty={selectedDifficulty}
          highScore={saveData.highScores[selectedDifficulty]}
          isNewHighScore={gameStats.score === saveData.highScores[selectedDifficulty]}
          onRestart={handleRestart}
          onMainMenu={handleMainMenu}
        />
      )}
    </div>
  );
};

export default App;


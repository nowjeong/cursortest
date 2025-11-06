import React from 'react';
import { DifficultyLevel } from '../types';
import { DIFFICULTY_CONFIGS } from '../utils';

interface MainMenuProps {
  onStartGame: (difficulty: DifficultyLevel) => void;
  highScores: Record<DifficultyLevel, number>;
}

const MainMenu: React.FC<MainMenuProps> = ({ onStartGame, highScores }) => {
  const [selectedDifficulty, setSelectedDifficulty] = React.useState<DifficultyLevel>('beginner');
  const [showInstructions, setShowInstructions] = React.useState(false);

  return (
    <div className="main-menu">
      <div className="menu-container">
        <h1 className="game-title">
          🌧️ 구구단 산성비 게임 ⚡
        </h1>
        
        <p className="game-subtitle">재미있게 구구단을 배워요!</p>

        <div className="difficulty-section">
          <h2>난이도 선택</h2>
          <div className="difficulty-buttons">
            {(Object.keys(DIFFICULTY_CONFIGS) as DifficultyLevel[]).map((level) => {
              const config = DIFFICULTY_CONFIGS[level];
              const highScore = highScores[level];
              
              return (
                <button
                  key={level}
                  className={`difficulty-btn ${selectedDifficulty === level ? 'selected' : ''}`}
                  onClick={() => setSelectedDifficulty(level)}
                >
                  <div className="difficulty-name">{config.displayName}</div>
                  <div className="difficulty-info">
                    {config.tables[0]}단 ~ {config.tables[config.tables.length - 1]}단
                  </div>
                  {highScore > 0 && (
                    <div className="high-score">최고: {highScore}점</div>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        <div className="menu-actions">
          <button
            className="start-btn"
            onClick={() => onStartGame(selectedDifficulty)}
          >
            게임 시작! 🚀
          </button>
          
          <button
            className="instructions-btn"
            onClick={() => setShowInstructions(!showInstructions)}
          >
            {showInstructions ? '닫기' : '게임 방법 📖'}
          </button>
        </div>

        {showInstructions && (
          <div className="instructions">
            <h3>🎮 게임 방법</h3>
            <div className="instruction-list">
              <div className="instruction-item">
                <span className="instruction-icon">1️⃣</span>
                <p>위에서 구구단 문제가 떨어져요!</p>
              </div>
              <div className="instruction-item">
                <span className="instruction-icon">2️⃣</span>
                <p>아래 답 버튼을 눌러 정답을 맞춰요!</p>
              </div>
              <div className="instruction-item">
                <span className="instruction-icon">3️⃣</span>
                <p>정답을 맞추면 점수를 얻어요! (10점)</p>
              </div>
              <div className="instruction-item">
                <span className="instruction-icon">4️⃣</span>
                <p>문제가 바닥에 닿으면 생명력이 줄어요! ❤️</p>
              </div>
              <div className="instruction-item">
                <span className="instruction-icon">⭐</span>
                <p>연속으로 맞추면 보너스 점수!</p>
              </div>
            </div>
          </div>
        )}

        <div className="character-decoration">
          <span className="character">🧒</span>
          <span className="character">📚</span>
        </div>
      </div>
    </div>
  );
};

export default MainMenu;


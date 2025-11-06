import React from 'react';
import { GameStats, DifficultyLevel } from '../types';
import { getEncouragementMessage, DIFFICULTY_CONFIGS } from '../utils';

interface GameOverProps {
  stats: GameStats;
  difficulty: DifficultyLevel;
  highScore: number;
  isNewHighScore: boolean;
  onRestart: () => void;
  onMainMenu: () => void;
}

const GameOver: React.FC<GameOverProps> = ({
  stats,
  difficulty,
  highScore,
  isNewHighScore,
  onRestart,
  onMainMenu,
}) => {
  const accuracy = stats.correctAnswers + stats.wrongAnswers > 0
    ? Math.round((stats.correctAnswers / (stats.correctAnswers + stats.wrongAnswers)) * 100)
    : 0;

  const encouragement = getEncouragementMessage(stats.score);
  const difficultyName = DIFFICULTY_CONFIGS[difficulty].displayName;

  return (
    <div className="game-over">
      <div className="game-over-container">
        <h1 className="game-over-title">게임 종료!</h1>

        {isNewHighScore && (
          <div className="new-high-score">
            🎉 새로운 최고 점수! 🎉
          </div>
        )}

        <div className="final-stats">
          <div className="stat-row main-stat">
            <span className="stat-label">최종 점수</span>
            <span className="stat-value final-score">{stats.score}점</span>
          </div>

          <div className="stat-row">
            <span className="stat-label">난이도</span>
            <span className="stat-value">{difficultyName}</span>
          </div>

          <div className="stat-divider"></div>

          <div className="stat-row">
            <span className="stat-label">맞춘 문제</span>
            <span className="stat-value correct">{stats.correctAnswers}개</span>
          </div>

          <div className="stat-row">
            <span className="stat-label">틀린 문제</span>
            <span className="stat-value wrong">{stats.wrongAnswers}개</span>
          </div>

          <div className="stat-row">
            <span className="stat-label">정확도</span>
            <span className="stat-value">{accuracy}%</span>
          </div>

          <div className="stat-row">
            <span className="stat-label">최대 콤보</span>
            <span className="stat-value combo">{stats.combo} 연속</span>
          </div>

          <div className="stat-divider"></div>

          <div className="stat-row">
            <span className="stat-label">최고 점수</span>
            <span className="stat-value high-score">{highScore}점</span>
          </div>
        </div>

        <div className="encouragement-message">
          {encouragement}
        </div>

        <div className="performance-badges">
          {stats.combo >= 10 && (
            <div className="badge">
              <span className="badge-icon">🔥</span>
              <span className="badge-text">콤보 마스터</span>
            </div>
          )}
          {accuracy >= 90 && (
            <div className="badge">
              <span className="badge-icon">🎯</span>
              <span className="badge-text">정확왕</span>
            </div>
          )}
          {stats.correctAnswers >= 20 && (
            <div className="badge">
              <span className="badge-icon">⚡</span>
              <span className="badge-text">구구단 박사</span>
            </div>
          )}
        </div>

        <div className="game-over-actions">
          <button className="restart-btn" onClick={onRestart}>
            다시 하기 🔄
          </button>
          <button className="menu-btn" onClick={onMainMenu}>
            메인으로 🏠
          </button>
        </div>
      </div>
    </div>
  );
};

export default GameOver;


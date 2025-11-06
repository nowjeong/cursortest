import React, { useEffect, useRef, useState } from 'react';
import { Drop, GameStats, DifficultyConfig } from '../types';
import { generateProblem, generateAnswerButtons, GAME_CONSTANTS, calculateScore } from '../utils';

interface GamePlayProps {
  difficulty: DifficultyConfig;
  onGameOver: (stats: GameStats) => void;
}

const GamePlay: React.FC<GamePlayProps> = ({ difficulty, onGameOver }) => {
  const [drops, setDrops] = useState<Drop[]>([]);
  const [stats, setStats] = useState<GameStats>({
    score: 0,
    lives: GAME_CONSTANTS.MAX_LIVES,
    correctAnswers: 0,
    wrongAnswers: 0,
    combo: 0,
    timeRemaining: difficulty.timeLimit,
  });
  const [answerButtons, setAnswerButtons] = useState<number[]>([]);
  const [selectedDrop, setSelectedDrop] = useState<number | null>(null);
  const [feedback, setFeedback] = useState<{ type: 'correct' | 'wrong'; text: string } | null>(null);
  
  const dropIdCounter = useRef(0);
  const animationFrameRef = useRef<number>();
  const lastSpawnTimeRef = useRef<number>(Date.now());
  const gameStartTimeRef = useRef<number>(Date.now());

  // 새로운 문제 생성
  const spawnDrop = () => {
    if (drops.length >= difficulty.maxDrops) return;

    const problem = generateProblem(difficulty.tables);
    const newDrop: Drop = {
      id: dropIdCounter.current++,
      multiplier1: problem.multiplier1,
      multiplier2: problem.multiplier2,
      answer: problem.answer,
      y: -100,
      x: Math.random() * 70 + 15, // 15% ~ 85% 위치
    };

    setDrops(prev => [...prev, newDrop]);
  };

  // 답안 버튼 업데이트
  useEffect(() => {
    if (drops.length > 0) {
      const allAnswers = drops.map(d => d.answer);
      const buttons = generateAnswerButtons(allAnswers[0], difficulty.tables);
      setAnswerButtons(buttons);
    } else {
      setAnswerButtons([]);
    }
  }, [drops, difficulty.tables]);

  // 게임 루프
  useEffect(() => {
    const gameLoop = () => {
      const now = Date.now();
      
      // 새 문제 생성
      if (now - lastSpawnTimeRef.current > difficulty.spawnInterval) {
        spawnDrop();
        lastSpawnTimeRef.current = now;
      }

      // 문제 떨어뜨리기
      setDrops(prev => {
        const updated = prev.map(drop => ({
          ...drop,
          y: drop.y + difficulty.fallSpeed,
        }));

        // 바닥에 닿은 문제 처리
        const fallen = updated.filter(d => d.y >= 100);
        if (fallen.length > 0) {
          setStats(s => ({
            ...s,
            lives: s.lives - fallen.length,
            combo: 0,
          }));
          setFeedback({ type: 'wrong', text: '앗! 놓쳤어요!' });
          setTimeout(() => setFeedback(null), 1000);
        }

        return updated.filter(d => d.y < 100);
      });

      animationFrameRef.current = requestAnimationFrame(gameLoop);
    };

    animationFrameRef.current = requestAnimationFrame(gameLoop);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [difficulty]);

  // 타이머
  useEffect(() => {
    const timer = setInterval(() => {
      setStats(prev => {
        const newTime = prev.timeRemaining - 1;
        if (newTime <= 0) {
          clearInterval(timer);
          return prev;
        }
        return { ...prev, timeRemaining: newTime };
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // 게임 오버 체크
  useEffect(() => {
    if (stats.lives <= 0 || stats.timeRemaining <= 0) {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      setTimeout(() => {
        onGameOver(stats);
      }, 500);
    }
  }, [stats.lives, stats.timeRemaining, stats, onGameOver]);

  // 답 선택
  const handleAnswer = (answer: number) => {
    const matchingDrop = drops.find(d => d.answer === answer);
    
    if (matchingDrop) {
      // 정답
      const isFast = matchingDrop.y < 20; // 빨리 답한 경우
      
      const { points, bonus } = calculateScore(stats.combo + 1, isFast);
      const totalPoints = points + bonus;

      setStats(prev => ({
        ...prev,
        score: prev.score + totalPoints,
        correctAnswers: prev.correctAnswers + 1,
        combo: prev.combo + 1,
      }));

      setDrops(prev => prev.filter(d => d.id !== matchingDrop.id));
      setSelectedDrop(matchingDrop.id);
      
      let feedbackText = `+${totalPoints}점! ⭐`;
      if (bonus > 0) {
        feedbackText = `${feedbackText} 보너스 +${bonus}점! 🎉`;
      }
      if (stats.combo + 1 === 5) {
        feedbackText = '5연속! 🔥';
      } else if (stats.combo + 1 === 10) {
        feedbackText = '10연속! 💯';
      }
      
      setFeedback({ type: 'correct', text: feedbackText });
      setTimeout(() => {
        setFeedback(null);
        setSelectedDrop(null);
      }, 800);
    } else {
      // 오답
      setStats(prev => ({
        ...prev,
        lives: prev.lives - 1,
        wrongAnswers: prev.wrongAnswers + 1,
        combo: 0,
      }));
      
      setFeedback({ type: 'wrong', text: '틀렸어요! 다시 생각해봐요!' });
      setTimeout(() => setFeedback(null), 1000);
    }
  };

  return (
    <div className="game-play">
      {/* 상단 정보바 */}
      <div className="info-bar">
        <div className="score">
          점수: <span className="score-value">{stats.score}</span>
        </div>
        <div className="lives">
          {Array.from({ length: GAME_CONSTANTS.MAX_LIVES }).map((_, i) => (
            <span key={i} className={`heart ${i < stats.lives ? 'alive' : 'dead'}`}>
              {i < stats.lives ? '❤️' : '🖤'}
            </span>
          ))}
        </div>
        <div className="timer">
          ⏱️ {stats.timeRemaining}초
        </div>
      </div>

      {/* 콤보 표시 */}
      {stats.combo >= 3 && (
        <div className="combo-display">
          {stats.combo} 연속! 🔥
        </div>
      )}

      {/* 피드백 메시지 */}
      {feedback && (
        <div className={`feedback ${feedback.type}`}>
          {feedback.text}
        </div>
      )}

      {/* 게임 영역 */}
      <div className="game-area">
        {drops.map(drop => (
          <div
            key={drop.id}
            className={`drop ${selectedDrop === drop.id ? 'selected' : ''}`}
            style={{
              top: `${drop.y}%`,
              left: `${drop.x}%`,
            }}
          >
            <div className="drop-content">
              {drop.multiplier1} × {drop.multiplier2}
            </div>
          </div>
        ))}
      </div>

      {/* 답안 버튼 영역 */}
      <div className="answer-area">
        <div className="answer-buttons">
          {answerButtons.map((answer, index) => (
            <button
              key={`${answer}-${index}`}
              className="answer-btn"
              onClick={() => handleAnswer(answer)}
              disabled={stats.lives <= 0 || stats.timeRemaining <= 0}
            >
              {answer}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default GamePlay;


// 게임 상태
export type GameState = 'menu' | 'playing' | 'gameover';

// 난이도 레벨
export type DifficultyLevel = 'beginner' | 'easy' | 'medium' | 'hard' | 'master';

// 난이도 설정
export interface DifficultyConfig {
  name: string;
  displayName: string;
  tables: number[]; // 구구단 범위 (예: [2, 3, 4, 5])
  fallSpeed: number; // 떨어지는 속도 (픽셀/프레임)
  spawnInterval: number; // 새 문제 생성 간격 (밀리초)
  maxDrops: number; // 동시에 떨어지는 최대 문제 수
  timeLimit: number; // 제한 시간 (초)
}

// 떨어지는 문제
export interface Drop {
  id: number;
  multiplier1: number;
  multiplier2: number;
  answer: number;
  y: number; // 현재 Y 위치
  x: number; // X 위치
}

// 게임 통계
export interface GameStats {
  score: number;
  lives: number;
  correctAnswers: number;
  wrongAnswers: number;
  combo: number;
  timeRemaining: number;
}

// 로컬 스토리지 데이터
export interface SaveData {
  highScores: {
    [key in DifficultyLevel]: number;
  };
}


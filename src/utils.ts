import { DifficultyConfig, DifficultyLevel, SaveData } from './types';

// 난이도별 설정
export const DIFFICULTY_CONFIGS: Record<DifficultyLevel, DifficultyConfig> = {
  beginner: {
    name: 'beginner',
    displayName: '입문',
    tables: [2, 5],
    fallSpeed: 1,
    spawnInterval: 3000,
    maxDrops: 2,
    timeLimit: 90,
  },
  easy: {
    name: 'easy',
    displayName: '초급',
    tables: [2, 3, 4, 5],
    fallSpeed: 1.5,
    spawnInterval: 2500,
    maxDrops: 3,
    timeLimit: 90,
  },
  medium: {
    name: 'medium',
    displayName: '중급',
    tables: [2, 3, 4, 5, 6, 7, 8, 9],
    fallSpeed: 2,
    spawnInterval: 2000,
    maxDrops: 3,
    timeLimit: 60,
  },
  hard: {
    name: 'hard',
    displayName: '고급',
    tables: [2, 3, 4, 5, 6, 7, 8, 9],
    fallSpeed: 2.5,
    spawnInterval: 1800,
    maxDrops: 4,
    timeLimit: 60,
  },
  master: {
    name: 'master',
    displayName: '달인',
    tables: [2, 3, 4, 5, 6, 7, 8, 9],
    fallSpeed: 3,
    spawnInterval: 1500,
    maxDrops: 5,
    timeLimit: 45,
  },
};

// 게임 상수
export const GAME_CONSTANTS = {
  MAX_LIVES: 3,
  CORRECT_POINTS: 10,
  FAST_ANSWER_BONUS: 5,
  COMBO_5_BONUS: 50,
  COMBO_10_BONUS: 100,
  GAME_AREA_HEIGHT: 500,
  DROP_SIZE: 80,
  ANSWER_BUTTON_COUNT: 12,
};

// 랜덤 구구단 문제 생성
export const generateProblem = (tables: number[]) => {
  const table = tables[Math.floor(Math.random() * tables.length)];
  const multiplier = Math.floor(Math.random() * 9) + 1;
  return {
    multiplier1: table,
    multiplier2: multiplier,
    answer: table * multiplier,
  };
};

// 답안 버튼 생성 (정답 + 오답)
export const generateAnswerButtons = (correctAnswer: number, tables: number[]): number[] => {
  const answers = new Set<number>();
  answers.add(correctAnswer);

  // 해당 구구단 범위의 가능한 답들
  const possibleAnswers: number[] = [];
  tables.forEach(table => {
    for (let i = 1; i <= 9; i++) {
      possibleAnswers.push(table * i);
    }
  });

  // 중복 제거
  const uniquePossibleAnswers = Array.from(new Set(possibleAnswers));

  // 랜덤하게 오답 추가
  while (answers.size < Math.min(GAME_CONSTANTS.ANSWER_BUTTON_COUNT, uniquePossibleAnswers.length)) {
    const randomAnswer = uniquePossibleAnswers[Math.floor(Math.random() * uniquePossibleAnswers.length)];
    answers.add(randomAnswer);
  }

  // 셔플
  return Array.from(answers).sort(() => Math.random() - 0.5);
};

// 로컬 스토리지 관리
const STORAGE_KEY = 'multiplication-rain-save';

export const loadSaveData = (): SaveData => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      return JSON.parse(saved);
    }
  } catch (error) {
    console.error('Failed to load save data:', error);
  }

  // 기본값
  return {
    highScores: {
      beginner: 0,
      easy: 0,
      medium: 0,
      hard: 0,
      master: 0,
    },
  };
};

export const saveSaveData = (data: SaveData): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (error) {
    console.error('Failed to save data:', error);
  }
};

// 점수에 따른 격려 메시지
export const getEncouragementMessage = (score: number): string => {
  if (score >= 201) return '완벽해요! 구구단 천재! 🏆';
  if (score >= 101) return '훌륭해요! 구구단 박사! 🎉';
  if (score >= 51) return '잘했어요! 조금만 더! 🌟';
  return '다시 도전해보자! 💪';
};

// 점수 계산
export const calculateScore = (
  combo: number,
  isFastAnswer: boolean
): { points: number; bonus: number } => {
  let points = GAME_CONSTANTS.CORRECT_POINTS;
  let bonus = 0;

  if (isFastAnswer) {
    bonus += GAME_CONSTANTS.FAST_ANSWER_BONUS;
  }

  if (combo === 5) {
    bonus += GAME_CONSTANTS.COMBO_5_BONUS;
  } else if (combo === 10) {
    bonus += GAME_CONSTANTS.COMBO_10_BONUS;
  }

  return { points, bonus };
};


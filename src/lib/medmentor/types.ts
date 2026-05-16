export type Language = "ja" | "en" | "bilingual";
export type Difficulty = "beginner" | "intermediate" | "advanced";
export type QuestionType = "multiple_choice" | "true_false" | "fill_blank" | "free_form";

export interface Topic {
  id: string;
  nameEn: string;
  nameJa: string;
  descriptionEn: string;
  descriptionJa: string;
}

export interface Subject {
  id: string;
  nameEn: string;
  nameJa: string;
  color: string;      // hex
  colorClass: string;  // tailwind class
  emoji: string;
  topics: Topic[];
}

export interface QuestionTranslation {
  question: string;
  options: string[] | null;
  hint: string;
}

export interface GeneratedQuestion {
  id: string;
  question: string;
  type: QuestionType;
  options: string[] | null;
  correctAnswer: string;
  acceptedAnswers?: string[] | null;
  hint: string;
  difficulty: Difficulty;
  teachingPoint?: string;
  source?: "ai" | "fallback";
  note?: string;
  // Optional Japanese translation, attached only when the session language
  // is "en". Powers the per-question "🌐 日本語" toggle so students can
  // self-check their English comprehension on demand.
  translation?: QuestionTranslation | null;
}

export interface AnsweredQuestion extends GeneratedQuestion {
  userAnswer: string;
  isCorrect: boolean;
  explanation: string;
  timestamp: string;
}

export interface StudySession {
  id: string;
  date: string;
  subject: string;
  topic: string;
  questions: AnsweredQuestion[];
  duration: number; // seconds
}

export interface ReviewItem {
  questionId: string;
  subject: string;
  topic: string;
  question: string;
  correctAnswer: string;
  userAnswer: string;
  lastAttempt: string;
  correctCount: number;
  incorrectCount: number;
  nextReview: string;
  difficulty: Difficulty;
}

export interface UserProgress {
  sessions: StudySession[];
  reviewQueue: ReviewItem[];
  stats: {
    totalQuestions: number;
    totalCorrect: number;
    currentStreak: number;
    longestStreak: number;
    lastStudyDate: string;
  };
  preferences: {
    language: Language;
    difficulty: Difficulty;
    dailyGoal: number;
  };
}

import type { UserProgress, StudySession, ReviewItem } from "./types";

const STORAGE_KEY = "medmentor-progress";

function getDefaultProgress(): UserProgress {
  return {
    sessions: [],
    reviewQueue: [],
    stats: {
      totalQuestions: 0,
      totalCorrect: 0,
      currentStreak: 0,
      longestStreak: 0,
      lastStudyDate: "",
    },
    preferences: {
      language: "bilingual",
      difficulty: "beginner",
      dailyGoal: 10,
    },
  };
}

export function getProgress(): UserProgress {
  if (typeof window === "undefined") return getDefaultProgress();
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : getDefaultProgress();
  } catch {
    return getDefaultProgress();
  }
}

export function saveProgress(progress: UserProgress): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
}

export function addSession(session: StudySession): void {
  const progress = getProgress();
  progress.sessions.push(session);

  const correct = session.questions.filter((q) => q.isCorrect).length;
  progress.stats.totalQuestions += session.questions.length;
  progress.stats.totalCorrect += correct;

  // Update streak
  const today = new Date().toISOString().split("T")[0];
  const lastDate = progress.stats.lastStudyDate;
  if (lastDate) {
    const diff = Math.floor(
      (new Date(today).getTime() - new Date(lastDate).getTime()) / 86400000
    );
    if (diff === 1) {
      progress.stats.currentStreak += 1;
    } else if (diff > 1) {
      progress.stats.currentStreak = 1;
    }
  } else {
    progress.stats.currentStreak = 1;
  }
  if (progress.stats.currentStreak > progress.stats.longestStreak) {
    progress.stats.longestStreak = progress.stats.currentStreak;
  }
  progress.stats.lastStudyDate = today;

  saveProgress(progress);
}

export function addToReviewQueue(item: ReviewItem): void {
  const progress = getProgress();
  const exists = progress.reviewQueue.find((r) => r.questionId === item.questionId);
  if (!exists) {
    progress.reviewQueue.push(item);
  } else {
    exists.incorrectCount += 1;
    exists.lastAttempt = item.lastAttempt;
    exists.nextReview = item.nextReview;
  }
  saveProgress(progress);
}

export function removeFromReviewQueue(questionId: string): void {
  const progress = getProgress();
  progress.reviewQueue = progress.reviewQueue.filter((r) => r.questionId !== questionId);
  saveProgress(progress);
}

export function getSubjectStats(subjectId: string) {
  const progress = getProgress();
  const subjectSessions = progress.sessions.filter((s) => s.subject === subjectId);
  let total = 0;
  let correct = 0;
  for (const session of subjectSessions) {
    total += session.questions.length;
    correct += session.questions.filter((q) => q.isCorrect).length;
  }
  return { total, correct, accuracy: total > 0 ? Math.round((correct / total) * 100) : 0 };
}

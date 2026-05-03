import type { Language } from "./types";

const dict: Record<string, { en: string; ja: string }> = {
  "nav.study": { en: "Study", ja: "学習" },
  "nav.dashboard": { en: "Dashboard", ja: "ダッシュボード" },
  "nav.review": { en: "Review", ja: "復習" },
  "nav.home": { en: "Home", ja: "ホーム" },
  "study.choose_subject": { en: "Choose Your Subject", ja: "科目を選択" },
  "study.choose_topic": { en: "Choose a Topic", ja: "トピックを選択" },
  "study.topics_count": { en: "topics", ja: "トピック" },
  "study.start": { en: "Start Studying", ja: "学習を開始" },
  "study.next_question": { en: "Next Question", ja: "次の問題" },
  "study.check_answer": { en: "Check Answer", ja: "回答を確認" },
  "study.submit": { en: "Submit", ja: "送信" },
  "study.correct": { en: "Correct!", ja: "正解！" },
  "study.incorrect": { en: "Incorrect", ja: "不正解" },
  "study.explanation": { en: "Explanation", ja: "解説" },
  "study.session_complete": { en: "Session Complete!", ja: "セッション完了！" },
  "study.score": { en: "Score", ja: "スコア" },
  "study.continue": { en: "Continue Studying", ja: "学習を続ける" },
  "study.back_to_subjects": { en: "Back to Subjects", ja: "科目に戻る" },
  "study.review_mistakes": { en: "Review Mistakes", ja: "間違いを復習" },
  "study.loading": { en: "Generating question...", ja: "問題を生成中..." },
  "study.loading_explanation": { en: "Generating explanation...", ja: "解説を生成中..." },
  "study.intro_banner_title": {
    en: "How this session works",
    ja: "このセッションの進め方",
  },
  "study.intro_banner_body": {
    en: "We'll start with 5 questions to gauge your current understanding of {topic}. Based on your answers, MedMentor will focus future practice on your weaker areas.",
    ja: "まずは5問の質問で{topic}の現在の理解度を確認します。回答をもとに、あなたの苦手分野を特定し、今後はそこを重点的に出題していきます。",
  },
  "dashboard.title": { en: "Learning Dashboard", ja: "学習ダッシュボード" },
  "dashboard.total_questions": { en: "Total Questions", ja: "総問題数" },
  "dashboard.accuracy": { en: "Accuracy", ja: "正答率" },
  "dashboard.streak": { en: "Day Streak", ja: "連続学習日数" },
  "dashboard.review_count": { en: "To Review", ja: "復習予定" },
  "dashboard.recent": { en: "Recent Sessions", ja: "最近のセッション" },
  "dashboard.subject_breakdown": { en: "Subject Breakdown", ja: "科目別成績" },
  "dashboard.no_data": { en: "No study data yet. Start learning!", ja: "まだ学習データがありません。学習を始めましょう！" },
  "review.title": { en: "Review Queue", ja: "復習キュー" },
  "review.empty": { en: "No items to review. Great job!", ja: "復習する問題はありません。よくできました！" },
  "review.study_again": { en: "Study Again", ja: "もう一度" },
  "review.your_answer": { en: "Your answer", ja: "あなたの回答" },
  "review.correct_answer": { en: "Correct answer", ja: "正解" },
  "landing.hero_title_1": { en: "Your AI", ja: "AIが導く" },
  "landing.hero_title_2": { en: "Medical Tutor.", ja: "医学の学び。" },
  "landing.hero_subtitle": { en: "Master chemistry, biology, anatomy, physiology, medical English, and more — with an AI tutor that explains the 'why' behind every answer.", ja: "化学、生物学、解剖学、生理学、医学英語をAIチューターと一緒に学ぶ。答えの「なぜ」を理解する。" },
  "landing.start_learning": { en: "Start Learning", ja: "学習を始める" },
  "landing.feature_1_title": { en: "AI-Powered Questions", ja: "AIが問題を生成" },
  "landing.feature_1_desc": { en: "Questions that test understanding, not just memorization. Adapted to your level.", ja: "暗記ではなく理解を問う問題。あなたのレベルに合わせて生成。" },
  "landing.feature_2_title": { en: "Instant Explanations", ja: "即座に解説" },
  "landing.feature_2_desc": { en: "Get clear, detailed explanations for every answer — with connections to broader medical concepts.", ja: "すべての回答に明確で詳細な解説。医学的な文脈とのつながりも。" },
  "landing.feature_3_title": { en: "Spaced Repetition", ja: "間隔反復学習" },
  "landing.feature_3_desc": { en: "Missed questions automatically enter your review queue. Review at optimal intervals.", ja: "間違えた問題は自動的に復習キューへ。最適な間隔で復習。" },
};

export function t(key: string, lang: Language): string {
  const entry = dict[key];
  if (!entry) return key;
  if (lang === "bilingual") return `${entry.en} / ${entry.ja}`;
  return entry[lang] || key;
}

export function tSingle(key: string, lang: Language): { en: string; ja: string } {
  const entry = dict[key];
  return entry || { en: key, ja: key };
}

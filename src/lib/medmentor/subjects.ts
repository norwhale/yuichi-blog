import type { Subject } from "./types";

export const subjects: Subject[] = [
  {
    id: "chemistry",
    nameEn: "Chemistry",
    nameJa: "化学",
    color: "#22C55E",
    colorClass: "green",
    emoji: "🧪",
    topics: [
      { id: "periodic-table", nameEn: "Periodic Table & Elements", nameJa: "周期表・元素", descriptionEn: "Understanding the periodic table, element properties, and trends", descriptionJa: "周期表の構成、元素の性質、周期的傾向" },
      { id: "ionic-bonds", nameEn: "Ionic Bonds", nameJa: "イオン結合", descriptionEn: "Formation of ionic compounds, lattice energy, properties", descriptionJa: "イオン化合物の形成、格子エネルギー、性質" },
      { id: "covalent-bonds", nameEn: "Covalent Bonds", nameJa: "共有結合", descriptionEn: "Sharing electrons, molecular geometry, polarity", descriptionJa: "電子の共有、分子の形、極性" },
      { id: "electron-config", nameEn: "Electron Configuration", nameJa: "電子配置", descriptionEn: "Orbital filling, quantum numbers, electron shells", descriptionJa: "軌道の充填、量子数、電子殻" },
      { id: "acids-bases", nameEn: "Acids & Bases", nameJa: "酸と塩基", descriptionEn: "pH, buffers, neutralization reactions", descriptionJa: "pH、緩衝液、中和反応" },
      { id: "organic-intro", nameEn: "Organic Chemistry Intro", nameJa: "有機化学入門", descriptionEn: "Functional groups, naming conventions, basic reactions", descriptionJa: "官能基、命名法、基本的な反応" },
    ],
  },
  {
    id: "biology",
    nameEn: "Biology",
    nameJa: "生物学",
    color: "#3B82F6",
    colorClass: "blue",
    emoji: "🧬",
    topics: [
      { id: "cell-structure", nameEn: "Cell Structure", nameJa: "細胞の構造", descriptionEn: "Organelles, cell membrane, prokaryotes vs eukaryotes", descriptionJa: "細胞小器官、細胞膜、原核生物と真核生物" },
      { id: "dna-rna", nameEn: "DNA & RNA", nameJa: "DNA・RNA", descriptionEn: "Structure, replication, transcription, translation", descriptionJa: "構造、複製、転写、翻訳" },
      { id: "genetics", nameEn: "Genetics", nameJa: "遺伝学基礎", descriptionEn: "Mendelian genetics, inheritance patterns, mutations", descriptionJa: "メンデル遺伝学、遺伝パターン、突然変異" },
      { id: "human-systems", nameEn: "Human Body Systems", nameJa: "人体の器官系", descriptionEn: "Circulatory, respiratory, nervous, digestive systems", descriptionJa: "循環器系、呼吸器系、神経系、消化器系" },
      { id: "neuroscience", nameEn: "Neuroscience Intro", nameJa: "神経科学入門", descriptionEn: "Neurons, synapses, brain regions, neural pathways", descriptionJa: "ニューロン、シナプス、脳の領域、神経経路" },
    ],
  },
  {
    id: "anatomy",
    nameEn: "Anatomy",
    nameJa: "解剖学",
    color: "#EC4899",
    colorClass: "pink",
    emoji: "🫀",
    topics: [
      { id: "anatomical-position", nameEn: "Anatomical Position & Planes", nameJa: "解剖学的体位・体の面", descriptionEn: "Standard anatomical position, sagittal/coronal/transverse planes, directional language", descriptionJa: "標準的な解剖学的体位、矢状面・冠状面・横断面、方向を示す用語" },
      { id: "directional-terms", nameEn: "Directional Terms", nameJa: "方向を示す用語", descriptionEn: "Superior/inferior, anterior/posterior, medial/lateral, proximal/distal", descriptionJa: "上・下、前・後、内側・外側、近位・遠位" },
      { id: "skeletal-overview", nameEn: "Skeletal System Overview", nameJa: "骨格系の概観", descriptionEn: "Axial vs appendicular skeleton, major bones, joints, and basic landmarks", descriptionJa: "体軸骨格と付属肢骨格、主要な骨、関節、基本ランドマーク" },
      { id: "muscle-basics", nameEn: "Muscle Basics", nameJa: "筋肉の基礎", descriptionEn: "Skeletal muscle actions, origin/insertion, agonist and antagonist relationships", descriptionJa: "骨格筋の作用、起始・停止、主動筋と拮抗筋の関係" },
      { id: "neuroanatomy-intro", nameEn: "Neuroanatomy Intro", nameJa: "神経解剖学入門", descriptionEn: "Brain regions, spinal cord basics, peripheral nerves, and beginner-safe neuroanatomy vocabulary", descriptionJa: "脳領域、脊髄の基礎、末梢神経、初心者向け神経解剖用語" },
    ],
  },
  {
    id: "physiology",
    nameEn: "Physiology",
    nameJa: "生理学",
    color: "#14B8A6",
    colorClass: "teal",
    emoji: "🫁",
    topics: [
      { id: "homeostasis", nameEn: "Homeostasis", nameJa: "恒常性", descriptionEn: "Negative feedback, set points, sensors, control centers, and effectors", descriptionJa: "負のフィードバック、セットポイント、センサー、制御中枢、効果器" },
      { id: "membrane-transport", nameEn: "Membrane Transport", nameJa: "膜輸送", descriptionEn: "Diffusion, osmosis, facilitated diffusion, active transport, concentration gradients", descriptionJa: "拡散、浸透、促進拡散、能動輸送、濃度勾配" },
      { id: "nerve-impulses", nameEn: "Nerve Impulses", nameJa: "神経インパルス", descriptionEn: "Resting membrane potential, depolarization, repolarization, and action potential logic", descriptionJa: "静止膜電位、脱分極、再分極、活動電位の考え方" },
      { id: "cardiorespiratory-basics", nameEn: "Cardiorespiratory Basics", nameJa: "循環・呼吸の基礎", descriptionEn: "Heart-lung coordination, gas exchange, blood flow, and oxygen delivery", descriptionJa: "心肺連携、ガス交換、血流、酸素運搬" },
      { id: "endocrine-signaling", nameEn: "Endocrine Signaling", nameJa: "内分泌シグナル", descriptionEn: "Hormones, receptors, feedback loops, and slow body-wide regulation", descriptionJa: "ホルモン、受容体、フィードバックループ、全身性のゆっくりした調節" },
    ],
  },
  {
    id: "medical-english",
    nameEn: "Medical English",
    nameJa: "医学英語",
    color: "#EAB308",
    colorClass: "yellow",
    emoji: "📚",
    topics: [
      { id: "anatomy-terms", nameEn: "Anatomy Terms", nameJa: "解剖学用語", descriptionEn: "Body parts, anatomical positions, planes of the body", descriptionJa: "体の部位、解剖学的体位、体の面" },
      { id: "clinical-terms", nameEn: "Clinical Terms", nameJa: "臨床用語", descriptionEn: "Common clinical vocabulary, abbreviations, medical records", descriptionJa: "一般的な臨床用語、略語、医療記録" },
      { id: "prefixes-suffixes", nameEn: "Prefixes & Suffixes", nameJa: "接頭辞・接尾辞", descriptionEn: "Greek and Latin roots in medical terminology", descriptionJa: "医学用語のギリシャ語・ラテン語の語根" },
      { id: "case-discussion", nameEn: "Case Discussion", nameJa: "症例ディスカッション", descriptionEn: "Presenting patient cases, medical history taking", descriptionJa: "症例提示、医療面接" },
    ],
  },
  {
    id: "physics",
    nameEn: "Physics",
    nameJa: "物理学",
    color: "#F97316",
    colorClass: "orange",
    emoji: "⚡",
    topics: [
      { id: "mechanics", nameEn: "Mechanics", nameJa: "力学基礎", descriptionEn: "Force, motion, Newton's laws, energy", descriptionJa: "力、運動、ニュートンの法則、エネルギー" },
      { id: "waves-sound", nameEn: "Waves & Sound", nameJa: "波動・音", descriptionEn: "Wave properties, sound waves, resonance", descriptionJa: "波の性質、音波、共鳴" },
      { id: "electricity", nameEn: "Electricity", nameJa: "電気", descriptionEn: "Circuits, Ohm's law, electromagnetic fields", descriptionJa: "回路、オームの法則、電磁場" },
      { id: "optics", nameEn: "Optics", nameJa: "光学", descriptionEn: "Reflection, refraction, lenses, light as a wave", descriptionJa: "反射、屈折、レンズ、光の波動性" },
    ],
  },
  {
    id: "bci-foundations",
    nameEn: "BCI Foundations",
    nameJa: "BCI基礎",
    color: "#A855F7",
    colorClass: "purple",
    emoji: "🧠",
    topics: [
      { id: "neural-signals", nameEn: "Neural Signals", nameJa: "神経信号の基礎", descriptionEn: "Action potentials, synaptic transmission, signal patterns", descriptionJa: "活動電位、シナプス伝達、信号パターン" },
      { id: "eeg-basics", nameEn: "EEG Basics", nameJa: "EEG（脳波）入門", descriptionEn: "Brain wave types (α, β, θ, δ, γ), measurement principles", descriptionJa: "脳波の種類、測定原理" },
      { id: "signal-processing", nameEn: "Signal Processing", nameJa: "信号処理の基礎", descriptionEn: "Fourier transform, filtering, time-frequency analysis", descriptionJa: "フーリエ変換、フィルタリング、時間-周波数解析" },
      { id: "bci-paradigms", nameEn: "BCI Paradigms", nameJa: "BCIのパラダイム", descriptionEn: "P300, SSVEP, Motor Imagery, invasive vs non-invasive", descriptionJa: "P300、SSVEP、運動イメージ、侵襲型と非侵襲型" },
      { id: "neuroethics", nameEn: "Neuroethics", nameJa: "神経倫理学", descriptionEn: "Informed consent in BCI, brain data privacy, cognitive liberty", descriptionJa: "BCIにおけるインフォームドコンセント、脳データのプライバシー" },
    ],
  },
];

export function getSubject(id: string): Subject | undefined {
  return subjects.find((s) => s.id === id);
}

export function getTopic(subjectId: string, topicId: string) {
  const subject = getSubject(subjectId);
  if (!subject) return undefined;
  const topic = subject.topics.find((t) => t.id === topicId);
  return topic ? { subject, topic } : undefined;
}

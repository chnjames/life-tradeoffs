// Life stages and "lost moments" taxonomy, merged into the dataset at build.
// Stages: broad chapter relevance by age.
// Moments: cross-chapter ordered checklists with a phase label.
// This file is intentionally small; refs are resolved at build time.
export const STAGES = [
  { key: '高中生', icon: '🎒', age: '14–18',
    desc: '先避开那几件一踩就毁的事，再谈前程', chapters: [1, 9, 13, 23, 21] },
  { key: '大学生', icon: '🎓', age: '18–22',
    desc: '人生路刚铺开，深造、恋爱、兼职，每步都有性价比',
    chapters: [10, 11, 12, 31, 32, 1] },
  { key: '刚工作', icon: '💼', age: '22–30',
    desc: '第一次有人按月给钱，也第一次有人想拿走更多',
    chapters: [19, 5, 7, 8, 23, 26] },
  { key: '中年', icon: '🏠', age: '30–50',
    desc: '上有老下有小，你的每条建议都牵着一家人',
    chapters: [16, 17, 18, 20, 27, 15] },
  { key: '退休前后', icon: '🌅', age: '50+',
    desc: '钱要守住，病要盯住，身后事可以提前安排',
    chapters: [16, 24, 25, 17, 34] },
]

export const DOMAINS = [
  { key: '工作与学习', icon: '💡', chapters: [3, 4, 11, 19, 23, 31] },
  { key: '日常开销', icon: '🪙', chapters: [5, 6, 7] },
  { key: '居住与安全', icon: '🏠', chapters: [1, 13, 15, 26] },
  { key: '健康与就医', icon: '🩺', chapters: [2, 16, 24, 28, 34] },
  { key: '家人与照护', icon: '👨‍👩‍👧', chapters: [17, 18, 20, 27, 30, 33] },
  { key: '办事与权益', icon: '⚖️', chapters: [8, 9, 10, 12, 21, 25, 32] },
]

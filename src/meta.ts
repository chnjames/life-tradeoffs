// 中文 key -> 手绘图标名 / 柔和配色（只给图标块上色，页面其余保持纸墨）
export const SCENARIO_ICON: Record<string, string> = {
  '被裁员了': 'layoff',
  '被欠薪加班没给钱': 'wage',
  '租房签约与退租': 'rent',
  '准备结婚': 'marry',
  '要生孩子': 'baby',
  '确诊慢性病': 'chronic',
  '家人走了': 'farewell',
  '被骗了': 'scam',
}

export const DOMAIN_ICON: Record<string, string> = {
  '工作与学习': 'work',
  '日常开销': 'money',
  '居住与安全': 'home',
  '健康与就医': 'health',
  '家人与照护': 'family',
  '办事与权益': 'rights',
}

// 柔和色循环（tone -> css 变量，在组件里以 .tone-x 使用）
export const TONES = ['pink', 'blue', 'sage', 'apricot', 'lilac']
export function toneAt(i: number): string {
  return TONES[i % TONES.length]
}

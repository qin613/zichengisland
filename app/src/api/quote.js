/**
 * 每日一句 / 名言 API
 *
 * 优先使用 Quotable（免费、支持 CORS）
 * 文档: https://github.com/lukePeavey/quotable
 *
 * 备用方案：内置中文金句库，API 失败时本地兜底
 */

const QUOTABLE_BASE = 'https://api.quotable.io'

/** 内置中文金句库，作为 API 不可用时的兜底 */
const LOCAL_QUOTES = [
  { content: '生活不止眼前的苟且，还有诗和远方。', author: '高晓松' },
  { content: '愿你走出半生，归来仍是少年。', author: '网络' },
  { content: '把每一个日出，当作生命的最后一天。', author: '佚名' },
  { content: '唯有美食与爱不可辜负。', author: '佚名' },
  { content: '生活明朗，万物可爱，人间值得，未来可期。', author: '张爱玲' },
  { content: '心若向阳，无谓悲伤。', author: '佚名' },
  { content: '愿你历尽千帆，归来仍是少年。', author: '苏轼（化用）' },
  { content: '人生得意须尽欢，莫使金樽空对月。', author: '李白' },
  { content: '海内存知己，天涯若比邻。', author: '王勃' },
  { content: '谁言寸草心，报得三春晖。', author: '孟郊' },
  { content: '千里之行，始于足下。', author: '老子' },
  { content: '知足者常乐，能忍者自安。', author: '古训' },
  { content: '一屋不扫，何以扫天下。', author: '陈蕃' },
  { content: '人间烟火气，最抚凡人心。', author: '佚名' },
  { content: '且将新火试新茶，诗酒趁年华。', author: '苏轼' }
]

/** 随机取一条本地金句 */
function getRandomLocal() {
  return LOCAL_QUOTES[Math.floor(Math.random() * LOCAL_QUOTES.length)]
}

/**
 * 获取一条随机的励志名言（英文）
 */
export async function getRandomQuote() {
  try {
    const controller = new AbortController()
    const timer = setTimeout(() => controller.abort(), 5000)
    const res = await fetch(`${QUOTABLE_BASE}/random`, {
      signal: controller.signal
    })
    clearTimeout(timer)
    if (!res.ok) throw new Error()
    const data = await res.json()
    return { content: data.content, author: data.author, fromApi: true }
  } catch {
    // 网络或服务不可用，使用本地兜底
    return { ...getRandomLocal(), fromApi: false }
  }
}

/**
 * 获取"今日一句"（基于日期稳定，同一天返回同一条）
 * 使用内置中文库 + 日期种子，保证稳定且无网络依赖
 */
export function getDailyQuote() {
  const today = new Date()
  const seed =
    today.getFullYear() * 10000 + (today.getMonth() + 1) * 100 + today.getDate()
  const index = seed % LOCAL_QUOTES.length
  return LOCAL_QUOTES[index]
}

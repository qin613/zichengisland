/**
 * 网易云音乐 — API 服务
 * 调用本地 NeteaseCloudMusicApi (localhost:3001)
 * 开发环境直连，绕开 Vite 代理（与 decompose.js 同模式）
 */

const API_BASE = 'http://localhost:3001'

/**
 * 搜索歌曲
 * @param {string} keywords - 搜索关键词
 * @param {number} limit - 每页数量，默认 20
 * @param {number} offset - 偏移量，默认 0
 * @returns {Promise<{code: number, result: {songs: Array, songCount: number}}>}
 */
export async function searchSongs(keywords, limit = 20, offset = 0) {
  const res = await fetch(
    `${API_BASE}/search?keywords=${encodeURIComponent(keywords)}&limit=${limit}&offset=${offset}`
  )
  return res.json()
}

/**
 * 获取歌曲播放 URL
 * @param {number|string} id - 歌曲 ID
 * @returns {Promise<{code: number, data: Array<{url: string, size: number, type: string, br: number}>}>}
 */
export async function getSongUrl(id) {
  const res = await fetch(`${API_BASE}/song/url?id=${id}`)
  return res.json()
}

/**
 * 获取歌曲详情（封面、歌手、专辑）
 * @param {number|string} ids - 歌曲 ID，多个用逗号分隔
 * @returns {Promise<{code: number, songs: Array}>}
 */
export async function getSongDetail(ids) {
  const res = await fetch(`${API_BASE}/song/detail?ids=${ids}`)
  return res.json()
}

/**
 * 获取歌词
 * @param {number|string} id - 歌曲 ID
 * @returns {Promise<{code: number, lrc: {lyric: string}}>}
 */
export async function getLyric(id) {
  const res = await fetch(`${API_BASE}/lyric?id=${id}`)
  return res.json()
}

/**
 * 获取推荐歌单
 * @param {number} limit - 数量，默认 6
 * @returns {Promise<{code: number, result: Array<{id: number, name: string, picUrl: string, playCount: number}>}>}
 */
export async function getPersonalized(limit = 6) {
  const res = await fetch(`${API_BASE}/personalized?limit=${limit}`)
  return res.json()
}

/**
 * 获取新歌速递（热门新歌）
 * @param {number} type - 0:全部, 7:华语, 96:欧美, 8:日本, 16:韩国
 * @returns {Promise<{code: number, data: Array}>}
 */
export async function getTopSongs(type = 0) {
  const res = await fetch(`${API_BASE}/top/song?type=${type}`)
  return res.json()
}

/**
 * 获取歌单详情（含歌曲列表）
 * @param {number} id - 歌单 ID
 * @returns {Promise<{code: number, playlist: {tracks: Array, name: string}}>}
 */
export async function getPlaylistDetail(id) {
  const res = await fetch(`${API_BASE}/playlist/detail?id=${id}`)
  return res.json()
}

/**
 * 获取用户歌单列表
 * @param {number} uid - 用户 ID
 * @returns {Promise<{code: number, playlist: Array}>}
 */
export async function getUserPlaylist(uid) {
  const res = await fetch(`${API_BASE}/user/playlist?uid=${uid}`)
  return res.json()
}

/**
 * 获取用户喜欢的歌曲 ID 列表
 * @param {number} uid - 用户 ID
 * @returns {Promise<{code: number, ids: Array<number>>}>
 */
export async function getLikelist(uid) {
  const res = await fetch(`${API_BASE}/likelist?uid=${uid}`)
  return res.json()
}

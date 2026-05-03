import axios from 'axios'

const BASE = 'https://www.omdbapi.com'
const KEY = import.meta.env.VITE_OMDB_API_KEY
const CACHE_KEY = 'rt_score_cache'
const CACHE_TTL = 7 * 24 * 60 * 60 * 1000 // 7 days

function readCache() {
  try { return JSON.parse(localStorage.getItem(CACHE_KEY) || '{}') } catch { return {} }
}

function writeCache(imdbId, score) {
  const cache = readCache()
  cache[imdbId] = { score, ts: Date.now() }
  try { localStorage.setItem(CACHE_KEY, JSON.stringify(cache)) } catch {}
}

// Returns the Rotten Tomatoes score (0-100) or null
export async function getRtScore(imdbId) {
  if (!imdbId) return null

  const cache = readCache()
  const hit = cache[imdbId]
  if (hit && Date.now() - hit.ts < CACHE_TTL) return hit.score

  try {
    const { data } = await axios.get(BASE, {
      params: { apikey: KEY, i: imdbId, tomatoes: true },
    })
    if (data.Response === 'False') {
      writeCache(imdbId, null)
      return null
    }
    const rt = data.Ratings?.find((r) => r.Source === 'Rotten Tomatoes')
    const score = rt ? parseInt(rt.Value, 10) : null
    writeCache(imdbId, score)
    return score
  } catch {
    return null
  }
}

// Fetches RT scores for a batch of { tmdbId, imdbId } objects
// Returns a map: { tmdbId: rtScore }
export async function getRtScores(movies) {
  const results = await Promise.all(
    movies.map(async ({ tmdbId, imdbId }) => {
      const score = await getRtScore(imdbId)
      return { tmdbId, score }
    })
  )
  return Object.fromEntries(results.map(({ tmdbId, score }) => [tmdbId, score]))
}

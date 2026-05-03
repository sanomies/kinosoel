import { supabase } from './supabase'

async function getUserId() {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Not authenticated')
  return user.id
}

export async function getWatchlistMovies(watchlistId) {
  const userId = await getUserId()
  const { data, error } = await supabase
    .from('watchlist')
    .select('*')
    .eq('owner_id', userId)
    .eq('watchlist_id', watchlistId)
    .order('added_at', { ascending: false })
  if (error) throw error
  return data
}

// Returns { [watchlistId]: Set<tmdbId> } for all watchlists
export async function getAllWatchlistEntries() {
  const userId = await getUserId()
  const { data, error } = await supabase
    .from('watchlist')
    .select('tmdb_id, watchlist_id')
    .eq('owner_id', userId)
  if (error) throw error
  const map = {}
  for (const row of data) {
    if (!map[row.watchlist_id]) map[row.watchlist_id] = new Set()
    map[row.watchlist_id].add(row.tmdb_id)
  }
  return map
}

export async function addToWatchlist(movie, watchlistId) {
  const userId = await getUserId()
  const { error } = await supabase.from('watchlist').insert({
    owner_id: userId,
    watchlist_id: watchlistId,
    tmdb_id: movie.tmdbId,
    imdb_id: movie.imdbId ?? null,
    title: movie.title,
    poster_path: movie.posterPath,
    year: movie.year,
    genre_ids: movie.genreIds,
    genre_names: movie.genreNames,
    tmdb_rating: movie.tmdbRating,
    rt_score: movie.rtScore,
  })
  if (error) throw error
}

export async function removeFromWatchlist(tmdbId, watchlistId) {
  const userId = await getUserId()
  const { error } = await supabase
    .from('watchlist')
    .delete()
    .eq('owner_id', userId)
    .eq('tmdb_id', tmdbId)
    .eq('watchlist_id', watchlistId)
  if (error) throw error
}

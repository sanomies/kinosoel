import { supabase } from './supabase'

async function getUserId() {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Not authenticated')
  return user.id
}

export async function getWatchlists() {
  const userId = await getUserId()
  const { data, error } = await supabase
    .from('watchlists')
    .select('*')
    .eq('owner_id', userId)
    .order('sort_order', { ascending: true })
    .order('created_at', { ascending: true })
  if (error) throw error
  return data
}

export async function createWatchlist(name, isDefault = false) {
  const userId = await getUserId()
  const { data, error } = await supabase
    .from('watchlists')
    .insert({ owner_id: userId, name, is_default: isDefault })
    .select()
    .single()
  if (error) throw error
  return data
}

export async function getOrCreateDefaultWatchlist() {
  const userId = await getUserId()

  // Already has a default
  const { data: existing } = await supabase
    .from('watchlists')
    .select('*')
    .eq('owner_id', userId)
    .eq('is_default', true)
    .maybeSingle()
  if (existing) return existing

  // Has watchlists but none marked default — promote the oldest
  const { data: oldest } = await supabase
    .from('watchlists')
    .select('*')
    .eq('owner_id', userId)
    .order('created_at', { ascending: true })
    .limit(1)
    .maybeSingle()
  if (oldest) {
    await supabase.from('watchlists').update({ is_default: true }).eq('id', oldest.id)
    return { ...oldest, is_default: true }
  }

  // No watchlists at all — create the default
  return createWatchlist('Watchlist', true)
}

export async function deleteWatchlist(id) {
  const { error } = await supabase.from('watchlists').delete().eq('id', id)
  if (error) throw error
}

export async function renameWatchlist(id, name) {
  const { error } = await supabase.from('watchlists').update({ name }).eq('id', id)
  if (error) throw error
}

// Save new order by updating sort_order for each watchlist
export async function saveWatchlistOrder(orderedIds) {
  const updates = orderedIds.map((id, index) =>
    supabase.from('watchlists').update({ sort_order: index }).eq('id', id)
  )
  await Promise.all(updates)
}

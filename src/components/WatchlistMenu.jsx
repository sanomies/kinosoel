import { useState } from 'react'
import {
  Menu, MenuItem, Divider, ListItemIcon, ListItemText,
  TextField, Box, IconButton, Typography, CircularProgress,
} from '@mui/material'
import CheckIcon from '@mui/icons-material/Check'
import AddIcon from '@mui/icons-material/Add'
import BookmarkIcon from '@mui/icons-material/Bookmark'
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder'

export default function WatchlistMenu({
  anchorEl,
  onClose,
  watchlists,          // [{ id, name }]
  movieWatchlistIds,   // Set of watchlistIds this movie is already in
  onAdd,               // (watchlistId) => void
  onRemove,            // (watchlistId) => void
  onCreateAndAdd,      // (name) => void
}) {
  const [creating, setCreating] = useState(false)
  const [newName, setNewName] = useState('')
  const [saving, setSaving] = useState(false)

  const handleCreate = async () => {
    if (!newName.trim()) return
    setSaving(true)
    await onCreateAndAdd(newName.trim())
    setSaving(false)
    setNewName('')
    setCreating(false)
    onClose()
  }

  return (
    <Menu
      anchorEl={anchorEl}
      open={Boolean(anchorEl)}
      onClose={onClose}
      slotProps={{ paper: { sx: { minWidth: 200, bgcolor: '#1a1a1a' } } }}
    >
      <Typography variant="caption" sx={{ px: 2, py: 0.5, color: '#888', display: 'block' }}>
        Save to watchlist
      </Typography>
      <Divider sx={{ mb: 0.5 }} />

      {watchlists.map((wl) => {
        const inList = movieWatchlistIds?.has(wl.id)
        return (
          <MenuItem
            key={wl.id}
            onClick={() => { inList ? onRemove(wl.id) : onAdd(wl.id); onClose() }}
          >
            <ListItemIcon sx={{ minWidth: 32 }}>
              {inList
                ? <BookmarkIcon fontSize="small" color="primary" />
                : <BookmarkBorderIcon fontSize="small" sx={{ color: '#666' }} />}
            </ListItemIcon>
            <ListItemText primary={wl.name} />
            {inList && <CheckIcon fontSize="small" color="primary" sx={{ ml: 1 }} />}
          </MenuItem>
        )
      })}

      <Divider sx={{ my: 0.5 }} />

      {creating ? (
        <Box sx={{ px: 1.5, py: 1, display: 'flex', gap: 1, alignItems: 'center' }}>
          <TextField
            size="small"
            placeholder="List name"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleCreate()}
            autoFocus
            sx={{ flexGrow: 1 }}
          />
          <IconButton size="small" color="primary" onClick={handleCreate} disabled={saving}>
            {saving ? <CircularProgress size={16} /> : <CheckIcon fontSize="small" />}
          </IconButton>
        </Box>
      ) : (
        <MenuItem onClick={() => setCreating(true)}>
          <ListItemIcon sx={{ minWidth: 32 }}>
            <AddIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText primary="New list…" />
        </MenuItem>
      )}
    </Menu>
  )
}

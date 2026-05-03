import { useState } from 'react'
import { Modal, Box, IconButton, Typography, CircularProgress } from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'
import BookmarkAddIcon from '@mui/icons-material/BookmarkAdd'
import WatchlistMenu from './WatchlistMenu'

export default function TrailerModal({
  open, onClose, title, youtubeKey, loading,
  movie, watchlists, movieWatchlistIds, onAdd, onRemove, onCreateAndAdd,
}) {
  const [menuAnchor, setMenuAnchor] = useState(null)
  const inAnyList = movieWatchlistIds?.size > 0

  return (
    <>
      <Modal open={open} onClose={onClose} slotProps={{ backdrop: { sx: { backgroundColor: 'rgba(0,0,0,0.92)' } } }}>
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: { xs: '95vw', sm: '90vw', md: '85vw' },
            maxWidth: 1400,
            bgcolor: '#0D0D0D',
            borderRadius: 2,
            boxShadow: '0 0 100px rgba(229,9,20,0.6)',
            outline: 'none',
            overflow: 'hidden',
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', px: 2, py: 1.5 }}>
            <Typography variant="subtitle1" fontWeight={600} noWrap sx={{ flexGrow: 1, mr: 1 }}>
              {title}
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <IconButton
                size="small"
                onClick={(e) => setMenuAnchor(e.currentTarget)}
                sx={inAnyList ? {
                  backgroundColor: '#E50914',
                  color: '#fff',
                  '&:hover': { backgroundColor: '#c0070f' },
                } : { color: '#888' }}
              >
                <BookmarkAddIcon fontSize="small" />
              </IconButton>
              <IconButton onClick={onClose} size="small" sx={{ color: '#888' }}>
                <CloseIcon />
              </IconButton>
            </Box>
          </Box>

          <Box sx={{ position: 'relative', paddingTop: '56.25%', backgroundColor: '#000' }}>
            {loading ? (
              <Box sx={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <CircularProgress color="primary" />
              </Box>
            ) : youtubeKey ? (
              <iframe
                style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', border: 'none' }}
                src={`https://www.youtube.com/embed/${youtubeKey}?autoplay=1`}
                title={title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            ) : (
              <Box sx={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Typography color="text.secondary">No trailer available</Typography>
              </Box>
            )}
          </Box>
        </Box>
      </Modal>

      <WatchlistMenu
        anchorEl={menuAnchor}
        onClose={() => setMenuAnchor(null)}
        watchlists={watchlists ?? []}
        movieWatchlistIds={movieWatchlistIds}
        onAdd={(watchlistId) => onAdd(movie, watchlistId)}
        onRemove={(watchlistId) => onRemove(movie?.tmdbId, watchlistId)}
        onCreateAndAdd={onCreateAndAdd}
      />
    </>
  )
}

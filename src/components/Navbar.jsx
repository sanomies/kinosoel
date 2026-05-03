import { AppBar, Toolbar, Button, Box, Tooltip } from '@mui/material'
import BookmarkIcon from '@mui/icons-material/Bookmark'
import LogoutIcon from '@mui/icons-material/Logout'
import logo from '../assets/logo-kinosoel.svg'
import { useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

export default function Navbar() {
  const navigate = useNavigate()
  const { pathname } = useLocation()
  const { user, signOut } = useAuth()

  const handleSignOut = async () => {
    await signOut()
    navigate('/login')
  }

  return (
    <AppBar position="sticky" elevation={0} sx={{ backgroundColor: '#0D0D0D', backgroundImage: 'none', borderBottom: '1px solid #1a1a1a' }}>
      <Toolbar>
        <Box
          sx={{ display: 'flex', alignItems: 'center', gap: 1, cursor: 'pointer', flexGrow: 1 }}
          onClick={() => navigate('/', { state: { reset: Date.now() } })}
        >
          <Box component="img" src={logo} alt="Kinosõel" sx={{ height: 28 }} />
        </Box>
        <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
          <Button
            startIcon={<BookmarkIcon />}
            onClick={() => navigate('/watchlist')}
            variant={pathname === '/watchlist' ? 'contained' : 'text'}
            color="primary"
          >
            Watchlist
          </Button>
          {user && (
            <Tooltip title={`Sign out (${user.email})`}>
              <Button
                startIcon={<LogoutIcon />}
                onClick={handleSignOut}
                variant="text"
                color="inherit"
                sx={{ color: '#888', ml: 1, minWidth: 0, '& .MuiButton-startIcon': { mr: { xs: 0, sm: 1 } } }}
              >
                <Box component="span" sx={{ display: { xs: 'none', sm: 'inline' } }}>Sign out</Box>
              </Button>
            </Tooltip>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  )
}

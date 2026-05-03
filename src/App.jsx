import { HashRouter, Routes, Route } from 'react-router-dom'
import { ThemeProvider, CssBaseline, Box } from '@mui/material'
import theme from './theme/theme'
import { AuthProvider } from './contexts/AuthContext'
import Navbar from './components/Navbar'
import ProtectedRoute from './components/ProtectedRoute'
import SearchPage from './pages/SearchPage'
import WatchlistPage from './pages/WatchlistPage'
import LoginPage from './pages/LoginPage'

export default function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <HashRouter>
        <AuthProvider>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route
              path="*"
              element={
                <ProtectedRoute>
                  <Navbar />
                  <Box sx={{ minHeight: 'calc(100vh - 64px)', backgroundColor: 'background.default' }}>
                    <Routes>
                      <Route path="/" element={<SearchPage />} />
                      <Route path="/watchlist" element={<WatchlistPage />} />
                    </Routes>
                  </Box>
                </ProtectedRoute>
              }
            />
          </Routes>
        </AuthProvider>
      </HashRouter>
    </ThemeProvider>
  )
}

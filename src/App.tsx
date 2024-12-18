import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Home } from './pages/Home';
import { Dashboard } from './pages/Dashboard';
import { Statistics } from './pages/Statistics';
import { TargetDetail } from './pages/TargetDetail';
import { Profile } from './pages/Profile';
import { Header } from './components/layout/Header';
import { CreateTarget } from './pages/CreateTarget';
import { Auth } from './pages/Auth';
import { UserProfile } from './pages/UserProfile';
import { ThemeProvider } from './lib/ThemeContext';

export function App() {
  return (
    <ThemeProvider>
      <Router>
        <div className="min-h-screen bg-gradient-to-b from-indigo-50 via-white to-white dark:from-gray-900 dark:via-gray-900 dark:to-gray-900 dark:text-gray-100">
          <Header />
          <main>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/auth" element={<Auth />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/statistics" element={<Statistics />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/targets/new" element={<CreateTarget />} />
              <Route path="/targets/:id" element={<TargetDetail />} />
              <Route path="/users/:id" element={<UserProfile />} />
            </Routes>
          </main>
        </div>
      </Router>
    </ThemeProvider>
  );
}

export default App;
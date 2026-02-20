import { useState, useEffect } from 'react';
import { LandingPage } from './components/LandingPage';
import { AuthModal } from './components/AuthModal';
import { Dashboard } from './components/Dashboard';
import { auth } from './utils/localStorage-auth';

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userEmail, setUserEmail] = useState('');
  const [userId, setUserId] = useState('');
  const [accessToken, setAccessToken] = useState('');
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signup');
  const [loading, setLoading] = useState(true);

  // Check for existing session on mount
  useEffect(() => {
    const checkSession = async () => {
      try {
        const { session } = await auth.getSession();
        if (session) {
          setUserEmail(session.user.email || '');
          setUserId(session.user.id);
          setAccessToken(session.access_token);
          setIsAuthenticated(true);
        }
      } catch {
        // session check failed silently
      } finally {
        setLoading(false);
      }
    };

    checkSession();
  }, []);

  const handleGetStarted = () => {
    setAuthMode('signup');
    setShowAuthModal(true);
  };

  const handleLogin = async (email: string, password: string) => {
    try {
      const { session, error } = await auth.signIn(email, password);

      if (error) {
        alert('Login failed: ' + error);
        return;
      }

      if (session) {
        setUserEmail(session.user.email || '');
        setUserId(session.user.id);
        setAccessToken(session.access_token);
        setIsAuthenticated(true);
        setShowAuthModal(false);
      }
    } catch {
      alert('Login failed. Please try again.');
    }
  };

  const handleSignup = async (email: string, password: string, name: string) => {
    try {
      const { session, error } = await auth.signUp(email, password, name);

      if (error) {
        alert('Signup failed: ' + error);
        return;
      }

      if (session) {
        setUserEmail(session.user.email || '');
        setUserId(session.user.id);
        setAccessToken(session.access_token);
        setIsAuthenticated(true);
        setShowAuthModal(false);
      }
    } catch {
      alert('Signup failed. Please try again.');
    }
  };

  const handleOpenLogin = () => {
    setAuthMode('signin');
    setShowAuthModal(true);
  };

  const handleLogout = async () => {
    try {
      await auth.signOut();
      setIsAuthenticated(false);
      setUserEmail('');
      setUserId('');
      setAccessToken('');
    } catch {
      // logout failed silently
    }
  };

  if (loading) {
    return (
      <div className="size-full flex items-center justify-center bg-[#0F172A]">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="size-full">
      {!isAuthenticated ? (
        <LandingPage
          onGetStarted={handleGetStarted}
          onLogin={handleOpenLogin}
        />
      ) : (
        <Dashboard
          userEmail={userEmail}
          userId={userId}
          accessToken={accessToken}
          onLogout={handleLogout}
        />
      )}

      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        onLogin={handleLogin}
        onSignup={handleSignup}
        initialMode={authMode}
      />
    </div>
  );
}
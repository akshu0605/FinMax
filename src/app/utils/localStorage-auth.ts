// ─── FinMax API-backed Auth ────────────────────────────────────────────────
// Uses Netlify Functions via /api/* proxy for real bcrypt + JWT auth.
// JWT stored in localStorage under "finmax_token".
// Passwords are NEVER stored client-side.

const TOKEN_KEY = 'finmax_token';
const USER_KEY = 'finmax_user';

// Base URL: relative /api/* works both on Netlify and with `npx netlify dev`
const API = '/api';

interface User {
  id: string;
  email: string;
  name: string;
}

interface Session {
  user: User;
  access_token: string;
}

// ── Helpers ────────────────────────────────────────────────────────────────

function saveSession(token: string, user: User): void {
  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(USER_KEY, JSON.stringify(user));
}

function clearSession(): void {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
  // Also clear any old-format keys from previous mock auth
  localStorage.removeItem('finmax_session');
  localStorage.removeItem('finmax_users');
}

function getStoredToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

function getStoredUser(): User | null {
  const raw = localStorage.getItem(USER_KEY);
  if (!raw) return null;
  try { return JSON.parse(raw) as User; } catch { return null; }
}

// ── API caller ─────────────────────────────────────────────────────────────

async function apiPost(path: string, body: object): Promise<{ data: any; error: string | null }> {
  try {
    const res = await fetch(`${API}${path}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    const json = await res.json();
    if (!json.success) return { data: null, error: json.error || 'Request failed' };
    return { data: json.data, error: null };
  } catch {
    return { data: null, error: 'Network error. Check your connection.' };
  }
}

async function apiGet(path: string, token: string): Promise<{ data: any; error: string | null }> {
  try {
    const res = await fetch(`${API}${path}`, {
      method: 'GET',
      headers: { Authorization: `Bearer ${token}` },
    });
    const json = await res.json();
    if (!json.success) return { data: null, error: json.error || 'Request failed' };
    return { data: json.data, error: null };
  } catch {
    return { data: null, error: 'Network error. Check your connection.' };
  }
}

// ── Public Auth API ────────────────────────────────────────────────────────

export const auth = {

  /** Register a new user. Returns session or error. */
  signUp: async (
    email: string,
    password: string,
    name: string,
  ): Promise<{ session: Session | null; error: string | null }> => {
    const { data, error } = await apiPost('/register', { name, email, password });
    if (error || !data) return { session: null, error };

    const { token, user } = data;
    saveSession(token, user);
    return {
      session: { user: { id: user.id, email: user.email, name: user.name }, access_token: token },
      error: null,
    };
  },

  /** Sign in an existing user. Returns session or error. */
  signIn: async (
    email: string,
    password: string,
  ): Promise<{ session: Session | null; error: string | null }> => {
    const { data, error } = await apiPost('/login', { email, password });
    if (error || !data) return { session: null, error };

    const { token, user } = data;
    saveSession(token, user);
    return {
      session: { user: { id: user.id, email: user.email, name: user.name }, access_token: token },
      error: null,
    };
  },

  /**
   * Restore session on page load.
   * Reads token from localStorage, then verifies it server-side.
   * Returns null session (gracefully) if token is missing, expired, or invalid.
   */
  getSession: async (): Promise<{ session: Session | null; error: string | null }> => {
    const token = getStoredToken();
    if (!token) return { session: null, error: null };

    // Fast-path: if we have a cached user object, optimistically return it,
    // then allow the caller to also do a background verify if needed.
    // For strict validation, always hit the server.
    const { data, error } = await apiGet('/verify-token', token);

    if (error || !data) {
      // Token invalid or expired — clean up
      clearSession();
      return { session: null, error: null };
    }

    const user: User = { id: data.user.id, email: data.user.email, name: data.user.name };
    // Refresh cached user (name etc might have changed)
    localStorage.setItem(USER_KEY, JSON.stringify(user));

    return {
      session: { user, access_token: token },
      error: null,
    };
  },

  /** Fully sign out: removes token and all session data from localStorage. */
  signOut: async (): Promise<void> => {
    clearSession();
  },

  /** Returns the current stored JWT token (for passing to API calls). */
  getToken: (): string | null => getStoredToken(),
};

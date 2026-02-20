// Simple localStorage-based authentication
interface User {
  id: string;
  email: string;
  name: string;
  password: string;
}

interface Session {
  user: {
    id: string;
    email: string;
    name: string;
  };
  access_token: string;
}

const USERS_KEY = 'finmax_users';
const SESSION_KEY = 'finmax_session';

// Get all users from localStorage
const getUsers = (): User[] => {
  const users = localStorage.getItem(USERS_KEY);
  return users ? JSON.parse(users) : [];
};

// Save users to localStorage
const saveUsers = (users: User[]) => {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
};

// Generate unique ID
const generateId = () => {
  return 'user_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
};

// Generate access token
const generateToken = () => {
  return 'token_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
};

export const auth = {
  // Sign up new user
  signUp: async (email: string, password: string, name: string): Promise<{ session: Session | null; error: string | null }> => {
    const users = getUsers();
    
    // Check if user already exists
    if (users.find(u => u.email === email)) {
      return { session: null, error: 'User already exists' };
    }

    // Create new user
    const newUser: User = {
      id: generateId(),
      email,
      name,
      password, // In production, this should be hashed
    };

    users.push(newUser);
    saveUsers(users);

    // Create session
    const session: Session = {
      user: {
        id: newUser.id,
        email: newUser.email,
        name: newUser.name,
      },
      access_token: generateToken(),
    };

    localStorage.setItem(SESSION_KEY, JSON.stringify(session));

    return { session, error: null };
  },

  // Sign in existing user
  signIn: async (email: string, password: string): Promise<{ session: Session | null; error: string | null }> => {
    const users = getUsers();
    const user = users.find(u => u.email === email && u.password === password);

    if (!user) {
      return { session: null, error: 'Invalid email or password' };
    }

    // Create session
    const session: Session = {
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
      },
      access_token: generateToken(),
    };

    localStorage.setItem(SESSION_KEY, JSON.stringify(session));

    return { session, error: null };
  },

  // Get current session
  getSession: async (): Promise<{ session: Session | null; error: string | null }> => {
    const sessionData = localStorage.getItem(SESSION_KEY);
    if (!sessionData) {
      return { session: null, error: null };
    }

    try {
      const session = JSON.parse(sessionData);
      return { session, error: null };
    } catch {
      return { session: null, error: 'Invalid session' };
    }
  },

  // Sign out
  signOut: async (): Promise<void> => {
    localStorage.removeItem(SESSION_KEY);
  },
};


import { generateId } from './data';

interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  createdAt: Date;
}

// Local storage keys
const USER_KEY = 'trakr_current_user';
const USERS_KEY = 'trakr_users';
const ONBOARDING_KEY = 'trakr_onboarding_completed';

// Get current user from local storage
export const getCurrentUser = (): User | null => {
  const userJson = localStorage.getItem(USER_KEY);
  if (!userJson) return null;
  
  try {
    return JSON.parse(userJson);
  } catch (error) {
    console.error('Error parsing current user:', error);
    return null;
  }
};

// Get all users from local storage
export const getUsers = (): User[] => {
  const usersJson = localStorage.getItem(USERS_KEY);
  if (!usersJson) return [];
  
  try {
    return JSON.parse(usersJson);
  } catch (error) {
    console.error('Error parsing users:', error);
    return [];
  }
};

// Save users to local storage
export const saveUsers = (users: User[]): void => {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
};

// Save current user to local storage
export const saveCurrentUser = (user: User): void => {
  localStorage.setItem(USER_KEY, JSON.stringify(user));
};

// Create a new user
export const createUser = async (name: string, email: string, password: string): Promise<boolean> => {
  // Get existing users
  const users = getUsers();
  
  // Check if email already exists
  if (users.some(user => user.email === email)) {
    return false;
  }
  
  // Create new user
  const newUser: User = {
    id: generateId(),
    name,
    email,
    password,
    createdAt: new Date()
  };
  
  // Add user to users list
  users.push(newUser);
  saveUsers(users);
  
  // Set as current user
  saveCurrentUser(newUser);
  
  return true;
};

// Login a user
export const loginUser = async (email: string, password: string): Promise<boolean> => {
  // Get existing users
  const users = getUsers();
  
  // Find user with matching email and password
  const user = users.find(user => user.email === email && user.password === password);
  
  if (!user) {
    return false;
  }
  
  // Set as current user
  saveCurrentUser(user);
  
  return true;
};

// Logout the current user
export const logoutUser = (): void => {
  localStorage.removeItem(USER_KEY);
};

// Check if user is logged in
export const isLoggedIn = (): boolean => {
  return !!getCurrentUser();
};

// Check if onboarding is completed
export const isOnboardingCompleted = (): boolean => {
  return localStorage.getItem(ONBOARDING_KEY) === 'true';
};

// Mark onboarding as completed
export const completeOnboarding = (): void => {
  localStorage.setItem(ONBOARDING_KEY, 'true');
};

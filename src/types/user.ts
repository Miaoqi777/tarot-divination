export interface UserProfile {
  id: string;
  nickname: string;
  avatar: string;  // emoji
  createdAt: number;
}

export interface AuthState {
  isLoggedIn: boolean;
  user: UserProfile | null;
}

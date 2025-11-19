
export type Page = 'dashboard' | 'team' | 'financials' | 'roadmap' | 'okrs' | 'chat' | 'settings';
export type RoleType = 'ceo' | 'developer' | 'marketing';

export interface CompanySettings {
  name: string;
  mission: string;
  vision: string;
  currency: string;
  primaryColor: string;
}

export interface TeamMember {
  id: number;
  name: string;
  role: string;
  roleType: RoleType;
  avatar: string;
  email: string;
  xp: number;
  level: number;
  badges: string[]; // Emojis representing achievements
}

export interface Transaction {
  id: number;
  type: 'revenue' | 'expense';
  description: string;
  amount: number;
  date: string;
}

export interface RoadmapTask {
  id: string;
  content: string;
  xpReward: number;
}

export interface RoadmapColumn {
  id: 'todo' | 'inProgress' | 'done';
  title: string;
  tasks: RoadmapTask[];
}

export interface KeyResult {
  id: number;
  description: string;
  progress: number; // 0-100
}

export interface Objective {
  id: number;
  title: string;
  keyResults: KeyResult[];
}

export interface ChatMessage {
  id: number;
  senderId: number;
  receiverId: number;
  text: string;
  timestamp: string;
}

export interface StartupData {
  settings: CompanySettings;
  team: TeamMember[];
  financials: Transaction[];
  roadmap: {
    todo: RoadmapTask[];
    inProgress: RoadmapTask[];
    done: RoadmapTask[];
  };
  okrs: Objective[];
  chatMessages: ChatMessage[];
  currentUser: TeamMember;
}

export interface UseStartupDataReturn extends StartupData {
  addTeamMember: (member: Omit<TeamMember, 'id' | 'avatar' | 'xp' | 'level' | 'badges'>) => void;
  updateTeamMember: (member: TeamMember) => void;
  removeTeamMember: (memberId: number) => void;
  addTransaction: (transaction: Omit<Transaction, 'id'>) => void;
  updateRoadmap: (newRoadmap: StartupData['roadmap']) => void;
  updateOkrProgress: (okrId: number, krId: number, progress: number) => void;
  sendMessage: (message: Omit<ChatMessage, 'id' | 'timestamp'>) => void;
  registerUser: (user: Omit<TeamMember, 'id' | 'avatar' | 'roleType' | 'xp' | 'level' | 'badges'>) => void;
  setCurrentUser: (user: TeamMember) => void;
  updateSettings: (settings: CompanySettings) => void;
  awardXP: (userId: number, amount: number) => void;
}

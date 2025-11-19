export type Page = 'dashboard' | 'team' | 'financials' | 'roadmap' | 'okrs' | 'chat';
export type RoleType = 'ceo' | 'developer' | 'marketing';

export interface TeamMember {
  id: number;
  name: string;
  role: string;
  roleType: RoleType;
  avatar: string;
  email: string;
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
  addTeamMember: (member: Omit<TeamMember, 'id' | 'avatar'>) => void;
  updateTeamMember: (member: TeamMember) => void;
  removeTeamMember: (memberId: number) => void;
  addTransaction: (transaction: Omit<Transaction, 'id'>) => void;
  updateRoadmap: (newRoadmap: StartupData['roadmap']) => void;
  updateOkrProgress: (okrId: number, krId: number, progress: number) => void;
  sendMessage: (message: Omit<ChatMessage, 'id' | 'timestamp'>) => void;
  registerUser: (user: Omit<TeamMember, 'id' | 'avatar' | 'roleType'>) => void;
  setCurrentUser: (user: TeamMember) => void;
}
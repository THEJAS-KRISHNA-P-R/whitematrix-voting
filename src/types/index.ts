export interface UserProfile {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  linkedInProfile: string | null;
  hasVoted: boolean;
  votedFor: string | null;
  provider: 'google' | 'linkedin' | 'email';
  createdAt: Date;
}

export interface Candidate {
  id: string;
  name: string;
  photoURL: string;
  linkedInProfile: string;
  description: string;
  voteCount: number;
}

export interface Vote {
  oderId: string;
  candidateId: string;
  timestamp: Date;
}

export interface Voter {
  oderId: string;
  displayName: string;
  photoURL: string | null;
  linkedInProfile: string;
}

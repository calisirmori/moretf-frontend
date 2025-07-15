export interface PlayerProfile {
  name: string;
  avatar: string;
}

export interface OverallStats {
  totalMatches: number;
  wins: number;
  losses: number;
  ties: number;
  winRate: number;
}

export interface MatchSummary {
  logId: number;
  map: string;
  result: 'W' | 'L' | 'T';
  date: string;
  kda: string;
  dpm: number;
  dtm: number;
  format: string;
}

export type MapStat = {
  count: number
  wins: number
  loss: number
  ties: number
  mapTime?: number  
}

export type ClassStat = {
  count: number
  wins: number
  loss: number
  ties: number
  classTime?: number 
}

export interface ActivityDay {
  activityDate: string;
  totalMatches: number;
  wins: number;
  losses: number;
  ties: number;
}

export interface PeerInfo {
  peer_id64: string;
  count: number;
  wins: number;
  loss: number;
  ties: number;
}



export interface UserProfileDTO {
  profile: PlayerProfile;
  overallStats: OverallStats;
  recentMatches: MatchSummary[];
  mapStats: Record<string, MapStat>;
  classStats: Record<string, ClassStat>;
  activity: ActivityDay[];
  topPeers: PeerInfo[];
  topEnemies: PeerInfo[]; 
}

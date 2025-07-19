export interface ClassStats {
  classType: string;
  totalTime: number;
  kills: number;
  deaths: number;
  assists: number;
  damage: number;
  weaponStats?: Record<string, {
    kills: number;
    damage: number;
    shots?: number;
    hits?: number;
  }>;
}
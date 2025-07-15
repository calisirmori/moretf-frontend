export interface Match {
  matchid: number;
  league: string;
  seasonid: number;
  division: string;
  team1: number;
  team2: number;
  date_played: number; // UNIX timestamp in seconds
  isforfeit: boolean;
  match_name: string;
  maps: string; // e.g. "{cp_steel_f12,None,None}"
  team1_tag: string;
  team1_teamname: string;
  team2_tag: string;
  team2_teamname: string;
  format: string; // e.g. "HL", "6s"
}

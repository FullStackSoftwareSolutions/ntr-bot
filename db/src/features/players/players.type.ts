export type Player = {
  id: number;
  email: string | null;
  fullName: string;
  nickname: string | null;
  phoneNumber: string | null;
  admin: boolean;
  skillLevel: number | null;
  skillLevelLetter: string | null;
  isPlayer: boolean;
  isGoalie: boolean;
  notes: string | null;
  dateAdded: Date;
};

export type PlayerCreate = {
  email: string | null;
  fullName: string;
  nickname?: string | null;
  phoneNumber: string;
  skillLevel: number | null;
  isPlayer: boolean;
  isGoalie: boolean;
  userId?: string | null;
  notes?: string | null;
};

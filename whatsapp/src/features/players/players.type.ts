export type Player = {
  id: number;
  email: string;
  fullName: string;
  nickname: string | null;
  phoneNumber: string;
  admin: boolean;
  skillLevel: string | null;
  isPlayer: boolean;
  isGoalie: boolean;
  notes: string | null;
  dateAdded: Date;
};

export type PlayerCreate = {
  email: string;
  fullName: string;
  nickname: string;
  phoneNumber: string;
  skillLevel: string;
  isPlayer: boolean;
  isGoalie: boolean;
  notes: string;
};
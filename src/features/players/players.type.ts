export type Player = {
  id: number;
  email: string;
  fullName: string | null;
  nickname: string | null;
  phoneNumber: string | null;
  admin: boolean;
  skillLevel: string | null;
};

export type PlayerCreate = {
  email: string;
  fullName: string;
  nickname: string;
  phoneNumber: string;
  skillLevel: string;
};
